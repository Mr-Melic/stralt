import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { withTimeout } from "./withTimeout.ts";

describe("withTimeout", () => {
  it("resolves the actor value before the deadline", async () => {
    const value = await withTimeout(Promise.resolve(42), 1000);
    assert.equal(value, 42);
  });

  it("rejects when the actor never settles", async () => {
    await assert.rejects(
      () => withTimeout(new Promise(() => {}), 20),
      (err: unknown) => {
        assert.ok(err instanceof Error);
        assert.equal(err.message, "Query timed out after 20ms");
        return true;
      },
    );
  });

  it("does not reject after a resolved query", async () => {
    const late: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      late.push(reason);
    };
    process.on("unhandledRejection", onUnhandled);
    try {
      await withTimeout(Promise.resolve("ok"), 30);
      await new Promise((r) => setTimeout(r, 50));
      assert.deepEqual(late, []);
    } finally {
      process.off("unhandledRejection", onUnhandled);
    }
  });

  it("propagates an actor rejection and still clears the timer", async () => {
    const late: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      late.push(reason);
    };
    process.on("unhandledRejection", onUnhandled);
    try {
      await assert.rejects(
        () => withTimeout(Promise.reject(new Error("replica down")), 30),
        /replica down/,
      );
      await new Promise((r) => setTimeout(r, 50));
      assert.deepEqual(late, []);
    } finally {
      process.off("unhandledRejection", onUnhandled);
    }
  });
});
