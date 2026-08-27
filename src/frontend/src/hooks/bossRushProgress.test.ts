import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseBossRushStateTuple,
  persistBossRushRoomClear,
  progressAfterRoomClear,
  resumeRoomFromPersisted,
} from "./bossRushProgress.ts";

describe("parseBossRushStateTuple", () => {
  it("reads (currentRoom, highestRoomCompleted, totalBossRushRuns)", () => {
    assert.deepEqual(parseBossRushStateTuple([1n, 1n, 0n]), {
      currentRoom: 1,
      highestRoomCompleted: 1,
      totalBossRushRuns: 0,
    });
  });

  it("rejects a non-tuple so Doka/XP cannot be read from the wrong slots", () => {
    assert.equal(parseBossRushStateTuple(null), null);
    assert.equal(parseBossRushStateTuple([1n, 2n]), null);
  });
});

describe("resumeRoomFromPersisted", () => {
  it("starts at room 0 when the backend has no mid-run progress", () => {
    assert.equal(resumeRoomFromPersisted(0), 0);
    assert.equal(resumeRoomFromPersisted(-1), 0);
  });

  it("resumes the persisted room instead of resetting to 0", () => {
    assert.equal(resumeRoomFromPersisted(1), 1);
    assert.equal(resumeRoomFromPersisted(9), 9);
    assert.equal(resumeRoomFromPersisted(12), 9);
  });
});

describe("progressAfterRoomClear", () => {
  it("advances currentRoom on a non-final clear so reload cannot re-farm", () => {
    assert.deepEqual(progressAfterRoomClear(0), {
      nextCurrentRoom: 1,
      runComplete: false,
    });
  });

  it("resets currentRoom after the final room so the jackpot is not resumable", () => {
    assert.deepEqual(progressAfterRoomClear(9), {
      nextCurrentRoom: 0,
      runComplete: true,
    });
  });
});

describe("persistBossRushRoomClear", () => {
  it("writes progress before completeBossRushRoom (room 0 → currentRoom 1)", async () => {
    const calls: string[] = [];
    await persistBossRushRoomClear(
      {
        setBossRushProgress: async (slot, room) => {
          calls.push(`progress:${slot}:${room}`);
        },
        resetBossRush: async () => {
          calls.push("reset");
        },
        completeBossRushRoom: async (slot, room, doka, xp) => {
          calls.push(`complete:${slot}:${room}:${doka}:${xp}`);
        },
      },
      2,
      0,
    );
    assert.deepEqual(calls, ["progress:2:1", "complete:2:0:0:0"]);
  });

  it("resets currentRoom before recording the final-room complete", async () => {
    const calls: string[] = [];
    await persistBossRushRoomClear(
      {
        setBossRushProgress: async () => {
          calls.push("progress");
        },
        resetBossRush: async (slot) => {
          calls.push(`reset:${slot}`);
        },
        completeBossRushRoom: async (_slot, room) => {
          calls.push(`complete:${room}`);
        },
      },
      1,
      9,
    );
    assert.deepEqual(calls, ["reset:1", "complete:9"]);
  });

  it("re-resets currentRoom when death aborts the run during the persist", async () => {
    const calls: string[] = [];
    let aborted = false;
    await persistBossRushRoomClear(
      {
        setBossRushProgress: async (slot, room) => {
          calls.push(`progress:${slot}:${room}`);
          aborted = true;
        },
        resetBossRush: async (slot) => {
          calls.push(`reset:${slot}`);
        },
        completeBossRushRoom: async (slot, room) => {
          calls.push(`complete:${slot}:${room}`);
        },
      },
      2,
      0,
      { wasSuperseded: () => aborted },
    );
    assert.deepEqual(calls, ["progress:2:1", "complete:2:0", "reset:2"]);
  });

  it("keeps the advanced room when the run is still live", async () => {
    const calls: string[] = [];
    await persistBossRushRoomClear(
      {
        setBossRushProgress: async (slot, room) => {
          calls.push(`progress:${slot}:${room}`);
        },
        resetBossRush: async (slot) => {
          calls.push(`reset:${slot}`);
        },
        completeBossRushRoom: async (slot, room) => {
          calls.push(`complete:${slot}:${room}`);
        },
      },
      2,
      0,
      { wasSuperseded: () => false },
    );
    assert.deepEqual(calls, ["progress:2:1", "complete:2:0"]);
  });
});
