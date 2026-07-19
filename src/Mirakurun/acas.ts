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
import { randomUUID } from "crypto";
import { chmod, readFile, rename, rm, writeFile } from "fs/promises";

const DEFAULT_ACAS_KEY_PATH = "/data/local/tmp/.acas_key";
const ACAS_KEY_PATTERN = /^[0-9a-fA-F]{64}$/;

function getKeyPath(): string {
    return process.env.ACAS_KEY_PATH || DEFAULT_ACAS_KEY_PATH;
}

export function normalizeKey(value: unknown): string | null {
    if (typeof value !== "string") {
        return null;
    }

    const key = value.trim();
    return ACAS_KEY_PATTERN.test(key) ? key.toLowerCase() : null;
}

export async function isConfigured(): Promise<boolean> {
    try {
        return normalizeKey(await readFile(getKeyPath(), "utf8")) !== null;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return false;
        }
        throw error;
    }
}

export async function saveKey(value: unknown): Promise<void> {
    const key = normalizeKey(value);
    if (key === null) {
        throw new TypeError("ACAS key must be exactly 64 hexadecimal characters");
    }

    const path = getKeyPath();
    const temporaryPath = `${path}.${randomUUID()}.tmp`;

    try {
        await writeFile(temporaryPath, `${key}\n`, {
            encoding: "utf8",
            flag: "wx",
            mode: 0o600
        });
        await rename(temporaryPath, path);
        await chmod(path, 0o600);
    } finally {
        await rm(temporaryPath, { force: true });
    }
}

export async function deleteKey(): Promise<void> {
    await rm(getKeyPath(), { force: true });
}
