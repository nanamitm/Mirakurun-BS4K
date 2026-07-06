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
import { useState } from "react";
import { Button, Dialog, DialogBody, DialogFooter, Spinner } from "@blueprintjs/core";

export const Restart: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const [restarting, setRestarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        setRestarting(false);
        setError(null);
        onClose();
    };

    const handleRestart = async () => {
        setRestarting(true);
        setError(null);
        try {
            const res = await fetch("/api/restart", { method: "PUT" });
            if (res.status === 202) {
                // サーバーが終了するので接続が切れる。state.ts の RPC 再接続に任せてダイアログを閉じる。
                onClose();
            } else {
                setError(`Not supported in this environment (HTTP ${res.status}).`);
                setRestarting(false);
            }
        } catch {
            // サーバーが即座に落ちた場合もここに来るが、再起動は成功している
            onClose();
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={restarting ? undefined : handleClose}
            title="Restart Mirakurun"
            canEscapeKeyClose={!restarting}
        >
            <DialogBody>
                {restarting ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Spinner size={16} />
                        <span>Restarting...</span>
                    </div>
                ) : error ? (
                    <p className="bp5-text-danger">{error}</p>
                ) : (
                    <p>Do you want to restart Mirakurun?</p>
                )}
            </DialogBody>
            <DialogFooter
                actions={
                    <>
                        <Button text="Cancel" disabled={restarting} onClick={handleClose} />
                        <Button text="Restart" intent="danger" disabled={restarting} onClick={handleRestart} />
                    </>
                }
            />
        </Dialog>
    );
};
