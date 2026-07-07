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
import { Operation } from "express-openapi";
import * as api from "../api";
import * as BSTSIDScan from "../BSTSIDScan";

export const post: Operation = async (req, res) => {
    const writeParam = req.query.write as unknown;
    const write = writeParam === true || writeParam === "1" || writeParam === "true";

    try {
        const result = await BSTSIDScan.scan(write);
        api.responseJSON(res, result);
    } catch (err: any) {
        if (err.message === "no available tuners") {
            api.responseError(res, 503, "Tuner Resource Unavailable");
        } else if (err.message === "no BS channel configured") {
            api.responseError(res, 404, err.message);
        } else {
            api.responseError(res, 500, err.message);
        }
    }
};

post.apiDoc = {
    tags: ["misc"],
    summary: "Scan BS NIT and reconcile bs_tsid.conf",
    operationId: "scanBSTSID",
    produces: ["application/json"],
    parameters: [
        {
            in: "query",
            name: "write",
            type: "boolean",
            required: false,
            description: "true で bs_tsid.conf を実際に書き換える (既定はドライラン)"
        }
    ],
    responses: {
        200: {
            description: "OK"
        },
        default: {
            description: "Unexpected Error",
            schema: {
                $ref: "#/definitions/Error"
            }
        }
    }
};
