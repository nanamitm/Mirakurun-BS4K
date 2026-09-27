const { describe, it } = require("node:test");
const assert = require("assert");

const { default: TLVPacketAligner, findTLVPacketStart } = require("../lib/Mirakurun/TLVPacketAligner");

// deterministic PRNG (mulberry32)
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TYPES = [0x01, 0x02, 0x03, 0xfe, 0xff];

// TLV packets whose payloads are full of 0x7f and valid-looking type bytes
function makePackets(rand, count) {
  const packets = [];
  for (let i = 0; i < count; i++) {
    const len = Math.floor(rand() * 3000);
    const p = Buffer.alloc(4 + len);
    p[0] = 0x7f;
    p[1] = TYPES[Math.floor(rand() * TYPES.length)];
    p.writeUInt16BE(len, 2);
    for (let j = 4; j < p.length; j++) {
      const r = rand();
      p[j] = r < 0.05 ? 0x7f : r < 0.1 ? 0x01 : Math.floor(rand() * 256);
    }
    packets.push(p);
  }
  return packets;
}

function chunked(buf, rand, maxSize) {
  const chunks = [];
  for (let i = 0; i < buf.length; ) {
    const n = 1 + Math.floor(rand() * maxSize);
    chunks.push(buf.subarray(i, i + n));
    i += n;
  }
  return chunks;
}

function run(chunks) {
  const aligner = new TLVPacketAligner();
  const outs = [];
  for (const c of chunks) {
    for (const o of aligner.push(c)) {
      outs.push(o);
    }
  }
  return outs;
}

// every output buffer must itself be a run of whole packets
function assertWholePackets(buf) {
  let p = 0;
  while (p < buf.length) {
    assert.strictEqual(buf[p], 0x7f, `sync at ${p}`);
    p += 4 + buf.readUInt16BE(p + 2);
  }
  assert.strictEqual(p, buf.length);
}

describe("[tlvaligner.spec] TLVPacketAligner", () => {
  it("passes an aligned stream through unchanged for any chunking", () => {
    const rand = rng(1);
    const stream = Buffer.concat(makePackets(rand, 400));
    for (const max of [1, 3, 7, 188, 4096, 65536]) {
      const outs = run(chunked(stream, rand, max));
      outs.forEach(assertWholePackets);
      assert.ok(Buffer.concat(outs).equals(stream), `chunk size <= ${max}`);
    }
  });

  it("starts on the first packet boundary when the input starts mid-packet", () => {
    const rand = rng(2);
    const packets = makePackets(rand, 300);
    for (const cut of [1, 5, 663, 1500]) {
      const lead = packets[0].subarray(Math.min(cut, packets[0].length - 1));
      const rest = Buffer.concat(packets.slice(1));
      const outs = run(chunked(Buffer.concat([lead, rest]), rand, 65536));
      outs.forEach(assertWholePackets);
      assert.ok(Buffer.concat(outs).equals(rest), `cut ${cut}`);
    }
  });

  it("holds back an incomplete last packet", () => {
    const rand = rng(3);
    const packets = makePackets(rand, 50).filter(p => p.length > 10);
    const whole = Buffer.concat(packets.slice(0, -1));
    const partial = packets[packets.length - 1].subarray(0, 7);
    const outs = run(chunked(Buffer.concat([whole, partial]), rand, 4096));
    assert.ok(Buffer.concat(outs).equals(whole));
  });

  it("resynchronizes after corrupted bytes", () => {
    const rand = rng(4);
    const a = makePackets(rand, 100);
    const b = makePackets(rand, 100);
    const junk = Buffer.from([0x12, 0x7f, 0x09, 0x34, 0x7f, 0x01]); // no valid chain
    const outs = run(chunked(Buffer.concat([...a, junk, ...b]), rand, 8192));
    outs.forEach(assertWholePackets);
    assert.ok(Buffer.concat(outs).equals(Buffer.concat([...a, ...b])));
  });

  it("findTLVPacketStart skips 0x7f bytes that do not chain", () => {
    const p = makePackets(rng(5), 5);
    const buf = Buffer.concat([Buffer.from([0x7f, 0x09, 0x00, 0x00, 0x7f, 0x01, 0x00, 0x10]), ...p]);
    assert.deepStrictEqual(findTLVPacketStart(buf), { offset: 8, pending: false });
    assert.strictEqual(findTLVPacketStart(Buffer.from([0x00, 0x12, 0x34])), null);
  });

  it("findTLVPacketStart defers a candidate whose chain leaves the buffer", () => {
    const p = makePackets(rng(6), 5);
    // only two whole packets after the candidate: the chain cannot be checked yet
    assert.deepStrictEqual(findTLVPacketStart(Buffer.concat(p.slice(0, 2))), { offset: 0, pending: true });
    assert.deepStrictEqual(findTLVPacketStart(Buffer.from([0x00, 0x7f, 0x01])), { offset: 1, pending: true });
  });
});
