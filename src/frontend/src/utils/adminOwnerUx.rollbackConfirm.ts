/**
 * Last-good rollback confirm helpers.
 *
 * Five canister writers exist (`adminRollbackLevelUpConfig` / GameConfig /
 * TierSpawnConfig / ColorPalette / BossRushConfig). Settings has no buttons.
 * Require a typed ROLLBACK phrase (same pattern as Transfer Admin).
 * Cancel must not call the actor. Not wired (stack).
 */

export const OWNER_ROLLBACK_PHRASE = "ROLLBACK";

export type OwnerRollbackWriterId =
  | "levelUp"
  | "gameConfig"
  | "tierSpawn"
  | "colorPalette"
  | "bossRush";

export type OwnerRollbackWriter = {
  id: OwnerRollbackWriterId;
  method: string;
  label: string;
};

export const OWNER_ROLLBACK_WRITERS: readonly OwnerRollbackWriter[] = [
  {
    id: "levelUp",
    method: "adminRollbackLevelUpConfig",
    label: "Level-up config",
  },
  {
    id: "gameConfig",
    method: "adminRollbackGameConfig",
    label: "Game config",
  },
  {
    id: "tierSpawn",
    method: "adminRollbackTierSpawnConfig",
    label: "Tier spawn config",
  },
  {
    id: "colorPalette",
    method: "adminRollbackColorPalette",
    label: "Color palette",
  },
  {
    id: "bossRush",
    method: "adminRollbackBossRushConfig",
    label: "Boss Rush config",
  },
];

export function ownerRollbackWriter(
  id: OwnerRollbackWriterId,
): OwnerRollbackWriter | null {
  return OWNER_ROLLBACK_WRITERS.find((w) => w.id === id) ?? null;
}

export function ownerRollbackConfirmReady(typed: string): boolean {
  return typed.trim() === OWNER_ROLLBACK_PHRASE;
}

export function ownerRollbackConfirmBody(label: string): string {
  const name = label.trim() || "this live config";
  return `Restores the last-good ${name} on the canister immediately. Type ${OWNER_ROLLBACK_PHRASE} to confirm. There is no undo beyond another publish.`;
}

export function shouldRunOwnerRollback(args: {
  typed: string;
  confirmed: boolean;
}): boolean {
  return args.confirmed === true && ownerRollbackConfirmReady(args.typed);
}
