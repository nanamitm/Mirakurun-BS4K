const { describe, it, before } = require("node:test");
const assert = require("assert");
const path = require("path");
const { Writable } = require("stream");

// status.ts のタイマーでテストのプロセスが終了しなくなるため差し替える
const status = { streamCount: { tlvFilter: 0 }, errorCount: { bufferOverflow: 0 }, epgByChannel: {} };
const statusPath = path.join(__dirname, "../lib/Mirakurun/status.js");
require.cache[statusPath] = {
  id: statusPath,
  filename: statusPath,
  loaded: true,
  exports: { __esModule: true, default: status }
};

const log = require("../lib/Mirakurun/log");
let TLVFilter;

const nullPackets = (count, size = 1000) => {
  const packet = Buffer.alloc(4 + size, 0xff);
  packet[0] = 0x7f;
  packet.writeUInt16BE(size, 2);
  return Buffer.concat(Array(count).fill(packet));
};

// 書き込みの完了を release() まで保留する出力
function stalledOutput(highWaterMark) {
  const callbacks = [];
  const output = new Writable({
    highWaterMark,
    write(chunk, encoding, callback) {
      output.received.push(chunk);
      callbacks.push(callback);
    }
  });
  output.received = [];
  output.release = () => {
    while (callbacks.length !== 0) {
      callbacks.shift()();
    }
  };
  return output;
}

describe("[tlvfilter.spec] TLVFilter.ts: write()", () => {
  before(() => {
    for (const level of ["info", "debug", "warn", "error"]) {
      log[level] = () => {};
    }
    require("../lib/Mirakurun/_").default.config = { server: {} };
    TLVFilter = require("../lib/Mirakurun/TLVFilter").default;
  });

  it("drops whole packets while the output is full and resumes after it drains", async () => {
    const overflowBefore = status.errorCount.bufferOverflow;
    const output = stalledOutput(10 * 1024);
    const filter = new TLVFilter({ output, channel: "45328" });
    const chunk = nullPackets(8); // 8032 バイト

    for (let i = 0; i < 100; i++) {
      filter.write(chunk);
    }
    assert.ok(output.writableLength < 10 * 1024 + chunk.length, `pending ${output.writableLength} bytes`);
    assert.strictEqual(status.errorCount.bufferOverflow, overflowBefore + 1);

    const received = () => output.received.reduce((n, b) => n + b.length, 0);
    const before = received();
    output.release();
    await new Promise(resolve => setImmediate(resolve));
    output.release();
    filter.write(chunk);
    assert.ok(received() > before, "writes resume after the output drains");

    // 破棄はパケット単位なので、出力は常にパケットの先頭から始まる
    for (const b of output.received) {
      assert.strictEqual(b[0], 0x7f);
      assert.strictEqual(b.length % 1004, 0);
    }
    filter.close();
  });

  it("does not drop anything while the output keeps up", () => {
    const overflowBefore = status.errorCount.bufferOverflow;
    let written = 0;
    const output = new Writable({
      write(chunk, encoding, callback) {
        written += chunk.length;
        callback();
      }
    });
    const filter = new TLVFilter({ output, channel: "45328" });
    const chunk = nullPackets(8);

    filter.write(chunk);
    filter.write(chunk);
    filter.write(chunk);
    assert.strictEqual(status.errorCount.bufferOverflow, overflowBefore);
    assert.ok(written >= chunk.length * 2, `written ${written} bytes`);
    filter.close();
  });
});
