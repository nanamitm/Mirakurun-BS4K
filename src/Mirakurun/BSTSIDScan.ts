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
/*
   BS TSID スキャン (実機内で完結)。scripts/scan_bs_tsid.py の突合ロジックを移植。

   実機の NIT を Mirakurun 自身のチューナーで受信し、BS チャンネル → 実 MPEG TS-ID
   対応表 (bs_tsid.conf) と突き合わせて差分 (NEW / MOVED / MISSING) を報告する。
   smb400-tuner.sh が参照する bs_tsid.conf を書き換えることで、スクリプト本体を
   触らずに TSID の追加・変更ができる。
*/
import { existsSync, readFileSync, writeFileSync } from "fs";
import _ from "./_";
import * as log from "./log";

// BS の LNB LO = 10.678 GHz。IF(kHz) = 衛星周波数(kHz) - 10678000。
const LNB_LO_KHZ = 10678000;
// BS トランスポンダ TP1 の IF と TP 間隔 (smb400-tuner.sh と一致させること)。
const IF_TP1_KHZ = 1049480;
const IF_STEP_KHZ = 38360; // TP が 2 増えるごとの IF 差

// bs_tsid.conf のパス。既定は実機 (SMB400) 上の smb400-tuner.sh 参照先。
export const CONF_PATH = process.env.BS_TSID_CONF_PATH || "/data/local/tmp/bs_tsid.conf";

export type ReportKind = "NEW" | "MOVED" | "MISSING" | "WARN";

export interface ScanReport {
    kind: ReportKind;
    message: string;
}

export interface ScanEntry {
    label: string;
    tsid: number;
    tp: number;
}

export interface ScanResult {
    confPath: string;
    detected: number; // NIT で検出した BS TS 数
    changed: boolean; // 既存表と差分があるか
    written: boolean; // conf を書き換えたか
    entries: ScanEntry[];
    reports: ScanReport[];
    conf: string; // 生成後の bs_tsid.conf 内容 (プレビュー/確認用)
}

/** 衛星周波数(kHz) → BS トランスポンダ番号。算出不能なら null。 */
export function tpForFreqKHz(freqKHz: number): number | null {
    const ifKHz = freqKHz - LNB_LO_KHZ;
    const num = ifKHz - IF_TP1_KHZ;
    // BCD 由来なので通常はぴったり割り切れる。念のため近い値へ丸める。
    const tp = (num % IF_STEP_KHZ !== 0)
        ? Math.round(num / IF_STEP_KHZ) * 2 + 1
        : (num / IF_STEP_KHZ) * 2 + 1;
    if (tp < 1 || tp > 99 || !Number.isFinite(tp)) {
        return null;
    }
    return tp;
}

/** "BS15_0" -> 15 */
function labelTp(label: string): number | null {
    const m = /^BS(\d+)_/.exec(label);
    if (!m) {
        return null;
    }
    return parseInt(m[1], 10);
}

function pad2(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
}

/** 既存 bs_tsid.conf を読み、{tsid -> label} を返す。 */
export function loadConf(path: string): Map<number, string> {
    const mapping = new Map<number, string>();
    if (!existsSync(path)) {
        return mapping;
    }
    const text = readFileSync(path, "utf8");
    for (const line of text.split("\n")) {
        const s = line.trim();
        if (!s || s.startsWith("#")) {
            continue;
        }
        const parts = s.split(/\s+/);
        if (parts.length >= 2 && parts[0].startsWith("BS")) {
            const tsid = parseInt(parts[1], 10);
            if (Number.isFinite(tsid)) {
                mapping.set(tsid, parts[0]);
            }
        }
    }
    return mapping;
}

/**
 * NIT 実測 (tsid -> freqKHz) と既存表を突き合わせ、entries と reports を返す。
 * 既存ラベルは決して機械的に付け替えず保持し、新規 TSID にのみ暫定ラベルを割り当てる。
 */
export function reconcile(
    tsidFreq: Map<number, number>,
    current: Map<number, string>
): { entries: ScanEntry[]; reports: ScanReport[] } {
    const entries: ScanEntry[] = [];
    const reports: ScanReport[] = [];
    const usedLabels = new Set<string>(current.values());

    // 指定 TP で未使用の暫定ラベル (BSxx_y) を採番する。
    const nextLabel = (tp: number): string => {
        let i = 0;
        while (usedLabels.has(`BS${pad2(tp)}_${i}`)) {
            i++;
        }
        return `BS${pad2(tp)}_${i}`;
    };

    for (const tsid of [...tsidFreq.keys()].sort((a, b) => a - b)) {
        const tp = tpForFreqKHz(tsidFreq.get(tsid));
        if (tp === null) {
            reports.push({
                kind: "WARN",
                message: `TSID ${tsid}: 周波数 ${tsidFreq.get(tsid)}kHz から TP を算出できず。スキップ`
            });
            continue;
        }
        if (current.has(tsid)) {
            let label = current.get(tsid);
            const curTp = labelTp(label);
            if (curTp !== tp) {
                // 同じ TSID が別トランスポンダへ移動 = 再編
                reports.push({
                    kind: "MOVED",
                    message: `TSID ${tsid} が ${label}(BS${pad2(curTp)}) → BS${pad2(tp)} へ移動。` +
                        `ラベルを BS${pad2(tp)}_y に変更し channels.yml も更新すること`
                });
                label = nextLabel(tp);
                usedLabels.add(label);
            }
            entries.push({ label, tsid, tp });
        } else {
            // 新規 TSID: 下位ニブルを暫定 _y に (多くの TP で一致。要レビュー)
            let suggest = `BS${pad2(tp)}_${tsid & 0x0f}`;
            if (usedLabels.has(suggest)) {
                suggest = nextLabel(tp);
            }
            usedLabels.add(suggest);
            entries.push({ label: suggest, tsid, tp });
            reports.push({
                kind: "NEW",
                message: `新 TSID ${tsid} @ BS${pad2(tp)} → 暫定ラベル ${suggest} を割当。` +
                    `_y が正しいか確認し channels.yml に追加すること`
            });
        }
    }

    // 表にあるが NIT で見えなかったもの
    for (const [tsid, label] of current) {
        if (!tsidFreq.has(tsid)) {
            reports.push({
                kind: "MISSING",
                message: `TSID ${tsid} (${label}) が今回 NIT に無し (休止/廃止/受信不良の可能性)。表には残す`
            });
            const tp = labelTp(label);
            entries.push({ label, tsid, tp: tp ?? 0 });
        }
    }

    // ラベル順 (TP → _y) で整列
    entries.sort((a, b) => {
        const ta = labelTp(a.label) ?? 0;
        const tb = labelTp(b.label) ?? 0;
        if (ta !== tb) {
            return ta - tb;
        }
        const ya = parseInt(a.label.slice(a.label.indexOf("_") + 1), 10) || 0;
        const yb = parseInt(b.label.slice(b.label.indexOf("_") + 1), 10) || 0;
        return ya - yb;
    });

    return { entries, reports };
}

function renderConf(entries: ScanEntry[]): string {
    const now = new Date();
    const ts = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())} ` +
        `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
    const lines = [
        "# bs_tsid.conf — BS (2K / ISDB-S) チャンネル → 実 MPEG TS-ID 対応表",
        "#",
        "# Mirakurun の BS TSID スキャン (実機 NIT) が生成/更新。書式: <CHANNEL> <TSID>",
        "# CHANNEL は channels.yml の channel と一致させること。IF は BSxx 名から算出。",
        `# generated: ${ts}`,
        ""
    ];
    for (const e of entries) {
        lines.push(`${e.label} ${e.tsid}`);
    }
    return lines.join("\n") + "\n";
}

/** スキャンに使う BS チャンネルを 1 つ選ぶ (NIT はどの TP でも全ネットワーク分得られる)。 */
function pickBSChannel() {
    const channels = _.channel.findByType("BS");
    return channels.length > 0 ? channels[0] : null;
}

/**
 * 実機 NIT をスキャンし、bs_tsid.conf と突合する。
 * write=true で conf を実際に書き換える (既定はドライラン)。
 */
export async function scan(write: boolean): Promise<ScanResult> {
    const channel = pickBSChannel();
    if (channel === null) {
        throw new Error("no BS channel configured");
    }

    log.info("BSTSIDScan: scanning NIT via BS channel %s ...", channel.channel);
    const streams = await _.tuner.scanBSNit(channel);

    // BS: original_network_id = 4 のみ採用。周波数が取れたものだけ。
    const tsidFreq = new Map<number, number>();
    for (const s of streams) {
        if (s.originalNetworkId === 4 && s.frequencyKHz > 0) {
            tsidFreq.set(s.transportStreamId, s.frequencyKHz);
        }
    }
    if (tsidFreq.size === 0) {
        throw new Error("NIT received but no BS transport streams found");
    }
    log.info("BSTSIDScan: detected %d BS transport streams", tsidFreq.size);

    const current = loadConf(CONF_PATH);
    const { entries, reports } = reconcile(tsidFreq, current);
    const conf = renderConf(entries);

    // 差分判定: 既存表 (tsid->label) と生成後 entries を比較。
    const newMap = new Map(entries.map(e => [e.tsid, e.label]));
    let changed = current.size !== newMap.size;
    if (!changed) {
        for (const [tsid, label] of newMap) {
            if (current.get(tsid) !== label) {
                changed = true;
                break;
            }
        }
    }

    let written = false;
    if (write && changed) {
        writeFileSync(CONF_PATH, conf, "utf8");
        written = true;
        log.info("BSTSIDScan: wrote %s", CONF_PATH);
    }

    return {
        confPath: CONF_PATH,
        detected: tsidFreq.size,
        changed,
        written,
        entries,
        reports,
        conf
    };
}
