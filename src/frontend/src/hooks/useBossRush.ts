import { Principal } from "@dfinity/principal";
import { useCallback, useEffect, useState } from "react";

export interface BossRushRoom {
  roomIndex: number;
  boss1Id: string;
  boss2Id: string;
  boss1Name: string;
  boss2Name: string;
  combinedMechanic: string;
  dokaReward: number;
  xpReward: number;
}

export const BOSS_RUSH_ROOMS: BossRushRoom[] = [
  {
    roomIndex: 0,
    boss1Id: "pale_archbishop",
    boss2Id: "weeping_pawn",
    boss1Name: "Pale Archbishop",
    boss2Name: "Weeping Pawn",
    combinedMechanic:
      "Archbishop heals Pawn every 2 turns. Kill Archbishop first or Pawn resurges to 50% HP on death.",
    dokaReward: 500,
    xpReward: 200,
  },
  {
    roomIndex: 1,
    boss1Id: "crimson_countess",
    boss2Id: "fetid_rook",
    boss1Name: "Crimson Countess",
    boss2Name: "Fetid Rook",
    combinedMechanic:
      "Countess lava trails deal poison (not burn) while Rook lives. Both enrage at 50% HP simultaneously.",
    dokaReward: 750,
    xpReward: 300,
  },
  {
    roomIndex: 2,
    boss1Id: "bone_cavalier",
    boss2Id: "lord_of_static",
    boss1Name: "Bone Cavalier",
    boss2Name: "Lord of Static",
    combinedMechanic:
      "Cavalier charge gains chain lightning from Static. Static channels through Cavalier granting temporary physical immunity.",
    dokaReward: 1000,
    xpReward: 400,
  },
  {
    roomIndex: 3,
    boss1Id: "starborn_queen",
    boss2Id: "enthroned_void",
    boss1Name: "Starborn Queen",
    boss2Name: "Enthroned Void",
    combinedMechanic:
      "Queen void tiles feed the Void's mist. Void phase 2 coalesces faster based on Queen's void tile count.",
    dokaReward: 1250,
    xpReward: 500,
  },
  {
    roomIndex: 4,
    boss1Id: "void_grandmaster",
    boss2Id: "mirror_sovereign",
    boss1Name: "Void Grandmaster",
    boss2Name: "Mirror Sovereign",
    combinedMechanic:
      "Grandmaster ghost copies are reflected by Sovereign. Player must identify the real one. Sovereign mirrors 30% of all damage.",
    dokaReward: 1500,
    xpReward: 600,
  },
  {
    roomIndex: 5,
    boss1Id: "chessboard_lich",
    boss2Id: "pale_archivist",
    boss1Name: "Chessboard Lich",
    boss2Name: "Pale Archivist",
    combinedMechanic:
      "Lich curse zones are marked by Archivist scrolls. Stepping on a marked zone triggers both curse and scroll attack simultaneously.",
    dokaReward: 2000,
    xpReward: 800,
  },
  {
    roomIndex: 6,
    boss1Id: "eternal_pawn_king",
    boss2Id: "final_pawn",
    boss1Name: "Eternal Pawn King",
    boss2Name: "Final Pawn",
    combinedMechanic:
      "Final Pawn death reveals it was the real Pawn King. The visible Pawn King was the decoy all along.",
    dokaReward: 2500,
    xpReward: 1000,
  },
  {
    roomIndex: 7,
    boss1Id: "midnight_bishop",
    boss2Id: "twin_monarchs",
    boss1Name: "Midnight Bishop",
    boss2Name: "Twin Monarchs",
    combinedMechanic:
      "White Bishop syncs with Dawn Monarch, Black Bishop with Dusk. Killing one half of either pair triggers a rage burst from the survivor.",
    dokaReward: 3000,
    xpReward: 1200,
  },
  {
    roomIndex: 8,
    boss1Id: "alabaster_fortress",
    boss2Id: "broodmother_rook",
    boss1Name: "Alabaster Fortress",
    boss2Name: "Broodmother Rook",
    combinedMechanic:
      "Fortress walls spawn on larva positions. Larvae use walls as cover. Destroying a wall releases a burst of larvae.",
    dokaReward: 3500,
    xpReward: 1500,
  },
  {
    roomIndex: 9,
    boss1Id: "starved_vampire_pawn",
    boss2Id: "weeping_pawn_2",
    boss1Name: "Starved Vampire Pawn",
    boss2Name: "Weeping Pawn",
    combinedMechanic:
      "Starved Pawn feeds on HP that Weeping Pawn regenerates. Both grow stronger as the other takes damage. JACKPOT ROOM.",
    dokaReward: 5000,
    xpReward: 2000,
  },
];

export interface BossRushState {
  active: boolean;
  currentRoom: number;
  complete: boolean;
  totalDokaEarned: number;
  totalXpEarned: number;
}

const INITIAL_STATE: BossRushState = {
  active: false,
  currentRoom: 0,
  complete: false,
  totalDokaEarned: 0,
  totalXpEarned: 0,
};

export function useBossRush(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor?: any,
  characterSlot?: number,
  principal?: Principal | string,
) {
  const [bossRushState, setBossRushState] =
    useState<BossRushState>(INITIAL_STATE);

  // Load persisted Boss Rush progress from the backend on mount
  useEffect(() => {
    if (!actor || !principal) return;
    const slot = BigInt(characterSlot ?? 0);
    let resolvedPrincipal: Principal | null = null;
    try {
      resolvedPrincipal =
        typeof principal === "string"
          ? Principal.fromText(principal)
          : (principal ?? null);
    } catch {
      return; // not a valid IC principal — skip backend load gracefully
    }
    if (!resolvedPrincipal) return;
    (async () => {
      try {
        const result = await actor.getBossRushState?.(resolvedPrincipal, slot);
        if (result && Array.isArray(result) && result.length >= 3) {
          const [roomIndex, totalDoka, totalXp] = result as [
            bigint,
            bigint,
            bigint,
          ];
          const room = Number(roomIndex);
          if (room > 0) {
            setBossRushState({
              active: true,
              currentRoom: Math.min(room, BOSS_RUSH_ROOMS.length - 1),
              complete: room >= BOSS_RUSH_ROOMS.length,
              totalDokaEarned: Number(totalDoka),
              totalXpEarned: Number(totalXp),
            });
          }
        }
      } catch (e) {
        console.error("[BossRush] Failed to load state from backend:", e);
      }
    })();
  }, [actor, characterSlot, principal]);

  const [rewardMultiplier, setRewardMultiplier] = useState(1.0);

  // Load admin-configured reward multiplier
  useEffect(() => {
    if (!actor) return;
    (async () => {
      try {
        const result = await actor.getBossRushConfig?.();
        const cfg = result && Array.isArray(result) ? result[0] : result;
        if (cfg) {
          const parsed = JSON.parse(cfg as string);
          if (parsed.rewardMultiplier)
            setRewardMultiplier(parsed.rewardMultiplier);
        }
      } catch (_) {
        // use default multiplier of 1.0
      }
    })();
  }, [actor]);

  const startBossRush = useCallback(() => {
    setBossRushState({ ...INITIAL_STATE, active: true });
  }, []);

  const advanceBossRushRoom = useCallback(
    async (dokaEarned: number, xpEarned: number) => {
      let nextRoomSnapshot = 0;
      let completedSnapshot = false;

      setBossRushState((prev) => {
        const nextRoom = prev.currentRoom + 1;
        const complete = nextRoom >= BOSS_RUSH_ROOMS.length;
        nextRoomSnapshot = complete ? prev.currentRoom : nextRoom;
        completedSnapshot = complete;
        return {
          ...prev,
          currentRoom: nextRoomSnapshot,
          complete,
          totalDokaEarned: prev.totalDokaEarned + dokaEarned,
          totalXpEarned: prev.totalXpEarned + xpEarned,
        };
      });

      if (actor) {
        try {
          const slot = BigInt(characterSlot ?? 0);
          const roomIdx = BigInt(
            completedSnapshot ? nextRoomSnapshot : nextRoomSnapshot - 1,
          );

          // M1 — Persist current room entry so progress survives tab close mid-run
          await actor.setBossRushProgress?.(slot, nextRoomSnapshot);

          // Complete the room with scaled rewards (no BigInt wrapping — backend takes plain Nat)
          await actor.completeBossRushRoom?.(
            slot,
            roomIdx,
            Math.round(dokaEarned * rewardMultiplier),
            Math.round(xpEarned * rewardMultiplier),
          );
        } catch (e) {
          console.error("[BossRush] Failed to save room progress:", e);
        }
      }
    },
    [actor, characterSlot, rewardMultiplier],
  );

  const abortBossRush = useCallback(async () => {
    setBossRushState(INITIAL_STATE);
    if (actor) {
      try {
        await actor.resetBossRush?.(BigInt(characterSlot ?? 0));
      } catch (e) {
        console.error("[BossRush] Failed to reset backend state:", e);
      }
    }
  }, [actor, characterSlot]);

  const getCurrentRoom = useCallback((): BossRushRoom | null => {
    if (!bossRushState.active) return null;
    return BOSS_RUSH_ROOMS[bossRushState.currentRoom] ?? null;
  }, [bossRushState]);

  return {
    bossRushState,
    startBossRush,
    advanceBossRushRoom,
    abortBossRush,
    getCurrentRoom,
    BOSS_RUSH_ROOMS,
  };
}
