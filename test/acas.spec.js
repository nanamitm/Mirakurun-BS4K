const { afterEach, describe, it } = require("node:test");
const assert = require("assert");
const { mkdtemp, readFile, rm, stat, writeFile } = require("fs/promises");
const { tmpdir } = require("os");
const { join } = require("path");

const acas = require("../lib/Mirakurun/acas");

let temporaryDirectory;

afterEach(async () => {
  delete process.env.ACAS_KEY_PATH;
  if (temporaryDirectory) {
    await rm(temporaryDirectory, { recursive: true, force: true });
    temporaryDirectory = undefined;
  }
});

async function prepareKeyPath() {
  temporaryDirectory = await mkdtemp(join(tmpdir(), "mirakurun-acas-"));
  process.env.ACAS_KEY_PATH = join(temporaryDirectory, ".acas_key");
  return process.env.ACAS_KEY_PATH;
}

describe("[acas.spec] ACAS key storage", () => {
  it("normalizes a valid key and rejects invalid values", () => {
    assert.strictEqual(acas.normalizeKey(`  ${"AB".repeat(32)}\n`), "ab".repeat(32));
    assert.strictEqual(acas.normalizeKey("ab"), null);
    assert.strictEqual(acas.normalizeKey("z".repeat(64)), null);
    assert.strictEqual(acas.normalizeKey(null), null);
  });

  it("writes a normalized key with mode 0600", async () => {
    const path = await prepareKeyPath();

    await acas.saveKey("AB".repeat(32));

    assert.strictEqual(await readFile(path, "utf8"), `${"ab".repeat(32)}\n`);
    assert.strictEqual((await stat(path)).mode & 0o777, 0o600);
    assert.strictEqual(await acas.isConfigured(), true);
  });

  it("reports invalid or missing files as not configured", async () => {
    const path = await prepareKeyPath();

    assert.strictEqual(await acas.isConfigured(), false);
    await writeFile(path, "invalid\n");
    assert.strictEqual(await acas.isConfigured(), false);
  });

  it("deletes an existing key", async () => {
    await prepareKeyPath();
    await acas.saveKey("01".repeat(32));

    await acas.deleteKey();

    assert.strictEqual(await acas.isConfigured(), false);
  });
});
