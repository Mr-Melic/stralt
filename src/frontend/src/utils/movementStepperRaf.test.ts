import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  cancelExclusiveMovementRaf,
  leftoverMovementStepperReappliesTile,
  startExclusiveRafLoop,
} from "./movementStepperRaf.ts";

describe("leftoverMovementStepperReappliesTile", () => {
  it("re-applies lava when a stale-step leftover loop is still running", () => {
    assert.equal(
      leftoverMovementStepperReappliesTile({
        leftoverLoopRunning: true,
        closedOverStepIndex: 0,
        liveStepIndex: 1,
        targetStepIndex: 1,
      }),
      true,
    );
  });

  it("does not re-apply after the leftover frame is cancelled", () => {
    assert.equal(
      leftoverMovementStepperReappliesTile({
        leftoverLoopRunning: false,
        closedOverStepIndex: 0,
        liveStepIndex: 1,
        targetStepIndex: 1,
      }),
      false,
    );
  });

  it("does not re-apply a tile the leftover loop has not reached", () => {
    assert.equal(
      leftoverMovementStepperReappliesTile({
        leftoverLoopRunning: true,
        closedOverStepIndex: 0,
        liveStepIndex: 1,
        targetStepIndex: 2,
      }),
      false,
    );
  });
});

describe("startExclusiveRafLoop", () => {
  it("cancels the pending frame so a leftover tick cannot run", () => {
    const queued: Array<() => void> = [];
    const cancelled = new Set<number>();
    let ticks = 0;
    const stop = startExclusiveRafLoop(
      () => {
        ticks += 1;
        return true;
      },
      (cb) => {
        queued.push(cb);
        return queued.length;
      },
      (id) => {
        cancelled.add(id);
      },
    );
    assert.equal(queued.length, 1);
    stop();
    assert.equal(cancelled.has(1), true);
    for (let i = 0; i < queued.length; i++) {
      if (!cancelled.has(i + 1)) queued[i]?.();
    }
    assert.equal(ticks, 0);
  });

  it("lets the live loop reschedule until step returns false", () => {
    const queued: Array<() => void> = [];
    let ticks = 0;
    startExclusiveRafLoop(
      () => {
        ticks += 1;
        return ticks < 2;
      },
      (cb) => {
        queued.push(cb);
        return queued.length;
      },
      () => {},
    );
    queued[0]?.();
    queued[1]?.();
    assert.equal(ticks, 2);
    assert.equal(queued.length, 2);
  });
});

describe("cancelExclusiveMovementRaf", () => {
  it("skips 0 so an unscheduled stepper does not cancel a foreign frame", () => {
    const cancelled: number[] = [];
    cancelExclusiveMovementRaf(0, (id) => {
      cancelled.push(id);
    });
    assert.deepEqual(cancelled, []);
  });
});
