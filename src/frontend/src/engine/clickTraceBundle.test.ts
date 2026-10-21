import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isClickTraceRecorderImport,
  shouldStubClickTraceRecorder,
} from "./clickTraceBundle.ts";

describe("shouldStubClickTraceRecorder", () => {
  it("stubs only the production Vite build", () => {
    assert.equal(
      shouldStubClickTraceRecorder({ command: "build", mode: "production" }),
      true,
    );
  });

  it("keeps the recorder for vite serve and non-production builds", () => {
    assert.equal(
      shouldStubClickTraceRecorder({ command: "serve", mode: "development" }),
      false,
    );
    assert.equal(
      shouldStubClickTraceRecorder({ command: "build", mode: "development" }),
      false,
    );
  });
});

describe("isClickTraceRecorderImport", () => {
  it("matches WorldExploration and ChatPanel relative imports", () => {
    assert.equal(isClickTraceRecorderImport("../debug/clickTrace"), true);
    assert.equal(
      isClickTraceRecorderImport(
        "/workspace/src/frontend/src/debug/clickTrace",
      ),
      true,
    );
    assert.equal(isClickTraceRecorderImport("./clickTrace"), true);
  });

  it("does not match the stub or the policy helper", () => {
    assert.equal(isClickTraceRecorderImport("../debug/clickTrace.prod"), false);
    assert.equal(isClickTraceRecorderImport("./clickTraceBundle.ts"), false);
  });
});
