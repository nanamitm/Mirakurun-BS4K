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
import { Operation } from "express-openapi";
import sift from "sift";
import * as api from "../api";
import * as apid from "../../../api";
import _ from "../_";

function numberQuery(value: any): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string" && value !== "") {
        const n = Number(value);
        if (Number.isFinite(n)) {
            return n;
        }
    }
    return null;
}

export const get: Operation = (req, res) => {
    let programs: apid.Program[];

    const query = { ...req.query };
    const channelType = typeof query.type === "string" ? query.type : undefined;
    const startAtGte = numberQuery(query.startAtGte);
    const startAtLt = numberQuery(query.startAtLt);
    delete query.type;
    delete query.startAtGte;
    delete query.startAtLt;

    if (channelType) {
        // Map a channel type (GR/BS/CS/SKY/BS4K) to the set of networkIds that
        // belong to it via the configured services, so an EPG view can fetch a
        // single type without pulling every network's programs (~15MB → a fraction).
        const networkIds = new Set<number>();
        for (const service of _.service.items) {
            if (service.channel.type === channelType) {
                networkIds.add(service.networkId);
            }
        }
        programs = [];
        for (const program of _.program.itemMap.values()) {
            if (networkIds.has(program.networkId)) {
                programs.push(program);
            }
        }
        if (Object.keys(query).length !== 0) {
            programs = programs.filter(sift(query));
        }
    } else if (Object.keys(query).length !== 0) {
        programs = _.program.findByQuery(query);
    } else {
        programs = Array.from(_.program.itemMap.values());
    }

    if (startAtGte !== null || startAtLt !== null) {
        programs = programs.filter(program => {
            if (startAtGte !== null && program.startAt < startAtGte) {
                return false;
            }
            if (startAtLt !== null && program.startAt >= startAtLt) {
                return false;
            }
            return true;
        });
    }

    api.responseJSON(res, programs);
};

get.apiDoc = {
    tags: ["programs"],
    operationId: "getPrograms",
    parameters: [
        {
            in: "query",
            name: "type",
            type: "string",
            enum: ["GR", "BS", "CS", "SKY", "BS4K"],
            required: false
        },
        {
            in: "query",
            name: "networkId",
            type: "integer",
            required: false
        },
        {
            in: "query",
            name: "serviceId",
            type: "integer",
            required: false
        },
        {
            in: "query",
            name: "eventId",
            type: "integer",
            required: false
        },
        {
            in: "query",
            name: "startAtGte",
            type: "integer",
            required: false
        },
        {
            in: "query",
            name: "startAtLt",
            type: "integer",
            required: false
        }
    ],
    responses: {
        200: {
            description: "OK",
            schema: {
                type: "array",
                items: {
                    $ref: "#/definitions/Program"
                }
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
