import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { raceWithTimeout } from "./promiseTimeout.ts";

describe("raceWithTimeout", () => {
  it("resolves the actor value and does not reject later", async () => {
    const value = await raceWithTimeout(Promise.resolve("ok"), 50);
    assert.equal(value, "ok");
    await new Promise((resolve) => setTimeout(resolve, 60));
  });

  it("rejects when the actor hangs past the timeout", async () => {
    await assert.rejects(
      () =>
        raceWithTimeout(
          new Promise<string>(() => {
            /* hang */
          }),
          20,
          "chat poll timed out",
        ),
      /chat poll timed out/,
    );
  });
});
