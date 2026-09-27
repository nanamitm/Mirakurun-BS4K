const { afterEach, describe, it } = require("node:test");
const assert = require("assert");
const { mkdtemp, readFile, rm } = require("fs/promises");
const { tmpdir } = require("os");
const { join } = require("path");

const db = require("../lib/Mirakurun/db");

let temporaryDirectory;

afterEach(async () => {
  delete process.env.PROGRAMS_DB_PATH;
  if (temporaryDirectory) {
    await rm(temporaryDirectory, { recursive: true, force: true });
    temporaryDirectory = undefined;
  }
});

function programs(n) {
  const items = [];
  for (let i = 0; i < n; i++) {
    items.push({
      id: 3176063488000 + i,
      eventId: i,
      serviceId: 63488,
      networkId: 31760,
      startAt: 1790000000000 + i * 60000,
      duration: 60000,
      isFree: true,
      name: `番組 ${i} 🎬 "quoted" \\ back sep`,
      genres: [{ lv1: 2, lv2: 4, un1: 15, un2: 15 }]
    });
  }
  return items;
}

describe("[db.spec] stringifyChunked", () => {
  it("matches JSON.stringify across chunk boundaries", async () => {
    for (const n of [0, 1, 499, 500, 501, 1234]) {
      const data = programs(n);
      assert.strictEqual(await db.stringifyChunked(data), JSON.stringify(data));
    }
  });

  it("matches JSON.stringify for elements JSON.stringify maps to null or rewrites", async () => {
    const data = [
      undefined,
      () => 1,
      Symbol("x"),
      null,
      NaN,
      { a: undefined, d: new Date(0), toJSONTest: { toJSON: () => "custom" } },
      [1, [2, undefined]],
      "str"
    ];
    assert.strictEqual(await db.stringifyChunked(data), JSON.stringify(data));
  });

  it("serializes non-array values like JSON.stringify", async () => {
    for (const value of [{ a: 1 }, "s", 1, null]) {
      assert.strictEqual(await db.stringifyChunked(value), JSON.stringify(value));
    }
  });

  it("yields to the event loop between chunks", async () => {
    let ticks = 0;
    const timer = setInterval(() => ticks++, 0);
    const done = db.stringifyChunked(programs(20000));
    await done;
    clearInterval(timer);
    assert.ok(ticks > 0, "no timer callbacks ran while serializing");
  });

  it("rejects when an element cannot be serialized", async () => {
    const cyclic = {};
    cyclic.self = cyclic;
    await assert.rejects(db.stringifyChunked([1, cyclic]), TypeError);
  });

  it("savePrograms writes a DB that loadPrograms reads back", async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), "mirakurun-db-"));
    process.env.PROGRAMS_DB_PATH = join(temporaryDirectory, "programs.json");
    const data = programs(1234);

    await db.savePrograms(data.slice(), "integrity-1");

    const saved = JSON.parse(await readFile(process.env.PROGRAMS_DB_PATH, "utf8"));
    assert.deepStrictEqual(saved[0], { __integrity__: "integrity-1" });
    assert.deepStrictEqual(await db.loadPrograms("integrity-1"), data);
  });
});
