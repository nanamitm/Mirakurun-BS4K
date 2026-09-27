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

const TLV_SYNC = 0x7f;
const TLV_HEADER_SIZE = 4; // sync(1) + packet_type(1) + data_length(2)
// headers that must follow a candidate before it is trusted as a packet start
const TLV_CHAIN_CHECK = 3;

// packet_type: IPv4, IPv6, header-compressed IP, transmission control signal, null
function isTLVPacketType(type: number): boolean {
    return type === 0x01 || type === 0x02 || type === 0x03 || type === 0xfe || type === 0xff;
}

export interface TLVPacketStart {
    offset: number;
    /** the candidate's chain runs past the end of the buffer; decide when more data arrives */
    pending: boolean;
}

/**
 * The first TLV packet start in `buf` at or after `from`, or null.
 *
 * A candidate needs the sync byte and a known packet type, and so must the
 * TLV_CHAIN_CHECK headers its length fields lead to, so a 0x7f inside a
 * payload is not taken for a packet start. If that chain leaves `buf`
 * before it is fully checked, the candidate is returned as pending instead
 * of looking further: a later candidate could lie inside its payload.
 */
export function findTLVPacketStart(buf: Buffer, from = 0): TLVPacketStart | null {
    for (let i = buf.indexOf(TLV_SYNC, from); i !== -1; i = buf.indexOf(TLV_SYNC, i + 1)) {
        let p = i;
        let checked = 0;
        for (; checked <= TLV_CHAIN_CHECK; checked++) {
            if (p + TLV_HEADER_SIZE > buf.length) {
                return { offset: i, pending: true };
            }
            if (buf[p] !== TLV_SYNC || !isTLVPacketType(buf[p + 1])) {
                break;
            }
            p += TLV_HEADER_SIZE + buf.readUInt16BE(p + 2);
        }
        if (checked > TLV_CHAIN_CHECK) {
            return { offset: i, pending: false };
        }
    }
    return null;
}

/**
 * Re-cuts a TLV byte stream so that only whole TLV packets come out.
 *
 * The chunks a stream filter receives are cut at arbitrary byte offsets.
 * Forwarding them as-is makes a service stream start in the middle of a
 * packet (its output begins with the chunk after the MPT was seen) and end
 * in the middle of one when it is cut off. `push()` returns the whole
 * packets completed by the chunk, starting on a packet boundary, and keeps
 * an incomplete trailing packet until the rest of it arrives.
 */
export default class TLVPacketAligner {
    private _tail: Buffer = null;
    private _synced = false;

    push(chunk: Buffer): Buffer[] {
        const buf = this._tail ? Buffer.concat([this._tail, chunk]) : chunk;
        this._tail = null;

        const out: Buffer[] = [];
        let start = 0; // first byte not yet emitted or dropped
        let pos = 0;   // start of the next packet header

        if (this._synced === false) {
            pos = this._sync(buf, 0);
            if (pos === -1) {
                return out;
            }
            start = pos;
        }

        while (pos + TLV_HEADER_SIZE <= buf.length) {
            if (buf[pos] !== TLV_SYNC) {
                // lost sync: emit what was complete and look for the next packet
                if (pos > start) {
                    out.push(buf.subarray(start, pos));
                }
                this._synced = false;
                pos = this._sync(buf, pos + 1);
                if (pos === -1) {
                    return out;
                }
                start = pos;
                continue;
            }
            const end = pos + TLV_HEADER_SIZE + buf.readUInt16BE(pos + 2);
            if (end > buf.length) {
                break;
            }
            pos = end;
        }

        if (pos > start) {
            out.push(buf.subarray(start, pos));
        }
        if (pos < buf.length) {
            this._tail = buf.subarray(pos);
        }
        return out;
    }

    /** Returns the offset to continue from once synced, or -1 after stashing what to retry. */
    private _sync(buf: Buffer, from: number): number {
        const found = findTLVPacketStart(buf, from);
        if (found === null) {
            // a header may straddle the chunk boundary
            this._tail = buf.subarray(Math.max(from, buf.length - (TLV_HEADER_SIZE - 1)));
            return -1;
        }
        if (found.pending) {
            this._tail = buf.subarray(found.offset);
            return -1;
        }
        this._synced = true;
        return found.offset;
    }
}
