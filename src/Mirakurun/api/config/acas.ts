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
import { Response } from "express";
import { Operation } from "express-openapi";
import * as api from "../../api";
import * as apid from "../../../../api";
import * as acas from "../../acas";

const respondWithStatus = async (res: Response): Promise<void> => {
    const status: apid.AcasKeyStatus = {
        configured: await acas.isConfigured()
    };
    api.responseJSON(res, status);
};

export const get: Operation = async (req, res) => {
    await respondWithStatus(res);
};

get.apiDoc = {
    tags: ["config"],
    operationId: "getAcasKeyStatus",
    responses: {
        200: {
            description: "OK",
            schema: {
                $ref: "#/definitions/AcasKeyStatus"
            }
        },
        default: {
            description: "Unexpected Error",
            schema: {
                $ref: "#/definitions/Error"
            }
        }
    }
};

export const put: Operation = async (req, res) => {
    const body = req.body as apid.AcasKeyUpdate;

    if (acas.normalizeKey(body?.key) === null) {
        api.responseError(res, 400, "ACAS key must be exactly 64 hexadecimal characters");
        return;
    }

    await acas.saveKey(body.key);
    await respondWithStatus(res);
};

put.apiDoc = {
    tags: ["config"],
    operationId: "updateAcasKey",
    parameters: [
        {
            in: "body",
            name: "body",
            required: true,
            schema: {
                $ref: "#/definitions/AcasKeyUpdate"
            }
        }
    ],
    responses: {
        200: {
            description: "OK",
            schema: {
                $ref: "#/definitions/AcasKeyStatus"
            }
        },
        default: {
            description: "Unexpected Error",
            schema: {
                $ref: "#/definitions/Error"
            }
        }
    }
};

export const del: Operation = async (req, res) => {
    await acas.deleteKey();
    await respondWithStatus(res);
};

del.apiDoc = {
    tags: ["config"],
    operationId: "deleteAcasKey",
    responses: {
        200: {
            description: "OK",
            schema: {
                $ref: "#/definitions/AcasKeyStatus"
            }
        },
        default: {
            description: "Unexpected Error",
            schema: {
                $ref: "#/definitions/Error"
            }
        }
    }
};
