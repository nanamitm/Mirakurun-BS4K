/*
   Copyright 2016 kanreisa

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
import { promisify } from "util";
import * as yieldableJSON from "yieldable-json";
const stringifyAsync = promisify(yieldableJSON.stringifyAsync);
import * as express from "express";

export interface Error {
    readonly code: number;
    readonly reason: string;
    readonly errors: any[];
}

export function responseError(res: express.Response, code: number, reason?: string): express.Response {
    if (reason) {
        res.writeHead(code, reason, {
            "Content-Type": "application/json"
        });
    } else {
        res.writeHead(code, {
            "Content-Type": "application/json"
        });
    }

    const error: Error = {
        code: code,
        reason: reason || null,
        errors: []
    };

    res.end(JSON.stringify(error));

    return res;
}

export function responseStreamErrorHandler(res: express.Response, err: NodeJS.ErrnoException): express.Response {
    if (err.message === "no available tuners") {
        return responseError(res, 503, "Tuner Resource Unavailable");
    }

    return responseError(res, 500, err.message);
}

export async function responseJSON(res: express.Response, body: any): Promise<express.Response> {
    // 大きな配列 (例: 全番組 /api/programs は 15MB 超) は yieldable-json での
    // 文字列化に数十秒かかることがある。responseJSON は文字列化が完了するまで
    // 1 バイトも送信しないため、その間ソケットは無通信となり、Server 側の
    // socket timeout (既定 15 秒) に達すると接続が破棄されて空応答になる。
    // 非力な実機でも巨大 JSON を返しきれるよう、この応答に限りタイムアウトを延長する。
    res.setTimeout(1000 * 60 * 2); // 2 min.
    // this is lighter than res.json()
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200);
    res.end(await stringifyAsync(body));

    return res;
}
