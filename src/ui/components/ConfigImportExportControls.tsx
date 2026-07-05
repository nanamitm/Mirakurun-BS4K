/*
   Copyright 2026 kanreisa

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
import * as React from "react";
import { useRef, useState } from "react";
import { Button, Dialog, DialogBody, DialogFooter, Intent } from "@blueprintjs/core";
import { ConfigChannels, ConfigServer, ConfigTuners } from "../../../api.d";

interface ConfigBundle {
    version: 1;
    exportedAt: string;
    server: ConfigServer;
    tuners: ConfigTuners;
    channels: ConfigChannels;
}

const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null && Array.isArray(value) === false;
};

const isValidConfigBundle = (value: unknown): value is ConfigBundle => {
    if (!isObject(value)) {
        return false;
    }

    return (
        value.version === 1 &&
        isObject(value.server) &&
        Array.isArray(value.tuners) &&
        Array.isArray(value.channels)
    );
};

export const ConfigImportExportControls: React.FC<{
    onImported: () => void;
}> = ({ onImported }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [pendingImport, setPendingImport] = useState<{ fileName: string; bundle: ConfigBundle } | null>(null);
    const [message, setMessage] = useState<{ intent: Intent; text: string } | null>(null);

    const handleExport = async () => {
        setIsExporting(true);
        setMessage(null);

        try {
            const [server, tuners, channels] = await Promise.all([
                fetch("/api/config/server").then(res => res.json()),
                fetch("/api/config/tuners").then(res => res.json()),
                fetch("/api/config/channels").then(res => res.json())
            ]);

            const bundle: ConfigBundle = {
                version: 1,
                exportedAt: new Date().toISOString(),
                server,
                tuners,
                channels
            };

            const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `mirakurun-config-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            setMessage({ intent: "success", text: "設定をエクスポートしました。" });
        } catch (error) {
            console.error(error);
            setMessage({ intent: "danger", text: "設定のエクスポートに失敗しました。" });
        } finally {
            setIsExporting(false);
        }
    };

    const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) {
            return;
        }

        setMessage(null);

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);

            if (!isValidConfigBundle(parsed)) {
                throw new Error("Invalid config bundle");
            }

            setPendingImport({ fileName: file.name, bundle: parsed });
        } catch (error) {
            console.error(error);
            setMessage({ intent: "danger", text: "設定ファイルの形式が不正です。" });
        }
    };

    const handleImport = async () => {
        if (!pendingImport) {
            return;
        }

        setIsImporting(true);
        setMessage(null);

        try {
            const responses = await Promise.all([
                fetch("/api/config/server", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    body: JSON.stringify(pendingImport.bundle.server)
                }),
                fetch("/api/config/tuners", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    body: JSON.stringify(pendingImport.bundle.tuners)
                }),
                fetch("/api/config/channels", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    body: JSON.stringify(pendingImport.bundle.channels)
                })
            ]);

            if (responses.some(response => response.ok === false)) {
                throw new Error("Import request failed");
            }

            setPendingImport(null);
            setMessage({ intent: "success", text: "設定をインポートしました。" });
            onImported();
        } catch (error) {
            console.error(error);
            setMessage({ intent: "danger", text: "設定のインポートに失敗しました。" });
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                style={{ display: "none" }}
                onChange={handleFileSelected}
            />

            <Button
                minimal
                icon="export"
                text={isExporting ? "Exporting..." : "Export"}
                disabled={isExporting || isImporting}
                onClick={handleExport}
            />
            <Button
                minimal
                icon="import"
                text={isImporting ? "Importing..." : "Import"}
                disabled={isExporting || isImporting}
                onClick={() => fileInputRef.current?.click()}
            />

            {message && (
                <span className={`bp5-text-${message.intent}`} style={{ marginLeft: 8 }}>
                    {message.text}
                </span>
            )}

            <Dialog
                isOpen={pendingImport !== null}
                onClose={() => {
                    if (!isImporting) {
                        setPendingImport(null);
                    }
                }}
                title="設定をインポート"
            >
                <DialogBody>
                    <p>このファイルの内容でサーバー設定、チューナー設定、チャンネル設定を上書きします。</p>
                    <p>ファイル: <strong>{pendingImport?.fileName}</strong></p>
                </DialogBody>
                <DialogFooter
                    actions={
                        <>
                            <Button
                                text="Cancel"
                                disabled={isImporting}
                                onClick={() => setPendingImport(null)}
                            />
                            <Button
                                intent="primary"
                                text={isImporting ? "Importing..." : "Import"}
                                loading={isImporting}
                                onClick={handleImport}
                            />
                        </>
                    }
                />
            </Dialog>
        </>
    );
};
