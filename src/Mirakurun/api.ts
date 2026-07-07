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

export function responseJSON(res: express.Response, body: any): express.Response {
    // 直列化には native JSON.stringify を用いる。
    // 以前は yieldable-json の stringifyAsync を使っていたが、これはイベント
    // ループを塞がない代わりに極端に遅く、全番組 /api/programs (15MB 超) では
    // 非力な実機で直列化に ~26 秒かかっていた。responseJSON は直列化が終わる
    // まで 1 バイトも送信しないため、その間ソケットが無通信となり Server 側の
    // socket timeout (既定 15 秒) で接続破棄→空応答になっていた。
    // native は一瞬イベントループを塞ぐが桁違いに速く (15MB でも 1 秒未満)、
    // この構成 (単一チューナー機・視聴/録画中は番組表を開かない) では実害がない。
    // 念のため応答ソケットのタイムアウトも延長しておく。
    res.setTimeout(1000 * 60 * 2); // 2 min.
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200);
    res.end(JSON.stringify(body));

    return res;
}
