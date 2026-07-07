/*
   Copyright 2026 nanamitm

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
import { useState } from "react";
import { Button, Dialog, DialogBody, DialogFooter, Spinner, Callout, Tag } from "@blueprintjs/core";

type ReportKind = "NEW" | "MOVED" | "MISSING" | "WARN";

interface ScanReport {
    kind: ReportKind;
    message: string;
}

interface ScanResult {
    confPath: string;
    detected: number;
    changed: boolean;
    written: boolean;
    reports: ScanReport[];
    conf: string;
}

const KIND_INTENT: Record<ReportKind, "success" | "warning" | "danger" | "primary"> = {
    NEW: "success",
    MOVED: "warning",
    MISSING: "danger",
    WARN: "warning"
};

export const BSTSIDScan: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ScanResult | null>(null);

    const reset = () => {
        setBusy(false);
        setError(null);
        setResult(null);
    };

    const handleClose = () => {
        if (busy) {
            return;
        }
        reset();
        onClose();
    };

    const runScan = async (write: boolean) => {
        setBusy(true);
        setError(null);
        try {
            const res = await fetch(`/api/bs-tsid-scan${write ? "?write=1" : ""}`, { method: "POST" });
            if (res.ok) {
                setResult(await res.json());
            } else {
                let reason = `HTTP ${res.status}`;
                try {
                    const body = await res.json();
                    if (body && body.reason) {
                        reason = body.reason;
                    }
                } catch { /* ignore */ }
                setError(reason);
            }
        } catch (e: any) {
            setError(e?.message || "request failed");
        } finally {
            setBusy(false);
        }
    };

    const renderBody = () => {
        if (busy) {
            return (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Spinner size={16} />
                    <span>スキャン中... (チューナーで BS を受信して NIT を解析します)</span>
                </div>
            );
        }
        if (error) {
            return <Callout intent="danger" title="スキャンに失敗しました">{error}</Callout>;
        }
        if (result) {
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                        <Tag intent="primary" minimal>検出 {result.detected} TS</Tag>{" "}
                        {result.written
                            ? <Tag intent="success">bs_tsid.conf を更新しました</Tag>
                            : result.changed
                                ? <Tag intent="warning">差分あり (未反映)</Tag>
                                : <Tag minimal>差分なし</Tag>}
                    </div>

                    {result.reports.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 180, overflowY: "auto" }}>
                            {result.reports.map((r, i) => (
                                <Callout key={i} intent={KIND_INTENT[r.kind]} icon={null} compact>
                                    <strong>{r.kind}</strong> — {r.message}
                                </Callout>
                            ))}
                        </div>
                    ) : (
                        <Callout intent="success" compact>実機 NIT と bs_tsid.conf は一致しています。</Callout>
                    )}

                    {result.changed && !result.written && (
                        <Callout intent="warning" compact>
                            「反映する」で {result.confPath} を書き換えます。MOVED / NEW がある場合は
                            channels.yml の手動更新も必要です。反映は次回チューニングから有効です。
                        </Callout>
                    )}

                    <details>
                        <summary style={{ cursor: "pointer" }}>生成後の bs_tsid.conf をプレビュー</summary>
                        <pre style={{ maxHeight: 200, overflow: "auto", fontSize: 12 }}>{result.conf}</pre>
                    </details>
                </div>
            );
        }
        return (
            <p>
                実機の BS NIT を受信してチャンネル → TSID 表 (bs_tsid.conf) と突き合わせます。
                まずはドライラン (ファイルは書き換えません) で差分を確認してください。
                スキャン中はチューナーを占有するため、視聴/録画中は実行できません
                (チューナーが空いていないと失敗します)。
            </p>
        );
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title="Scan BS TSID"
            canEscapeKeyClose={!busy}
            style={{ width: 600 }}
        >
            <DialogBody>{renderBody()}</DialogBody>
            <DialogFooter
                actions={
                    <>
                        <Button text="閉じる" disabled={busy} onClick={handleClose} />
                        {result && result.changed && !result.written && (
                            <Button
                                text="反映する (WRITE)"
                                intent="primary"
                                disabled={busy}
                                onClick={() => runScan(true)}
                            />
                        )}
                        {(!result || result.written) ? (
                            <Button
                                text={result ? "再スキャン" : "スキャン (ドライラン)"}
                                intent="success"
                                disabled={busy}
                                onClick={() => runScan(false)}
                            />
                        ) : (
                            <Button
                                text="再スキャン"
                                disabled={busy}
                                onClick={() => runScan(false)}
                            />
                        )}
                    </>
                }
            />
        </Dialog>
    );
};
