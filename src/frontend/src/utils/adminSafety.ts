/**
 * Client-side mirror of src/backend/lib/adminGuard.mo.
 * Backend enforcement is authoritative; these helpers prove failure paths
 * and keep the admin UI from submitting payloads the canister will reject.
 */

export const MAX_DOKA_GRANT = 10_000_000;
export const MAX_JSON_BLOB = 32_768;
export const BUILT_IN_SPELL_IDS = [
  "shadow_strike",
  "soul_rend",
  "vampire_bite",
  "reflect_barrier",
  "thunder_clap",
  "void_collapse",
] as const;

const SPELL_TYPES = new Set(["damage", "heal", "drain", "summon"]);
const SUMMON_AIS = new Set([
  "hunter",
  "guardian",
  "archer",
  "kiter",
  "bomber",
  "kamikaze",
  "healer",
]);
const PIECE_TYPES = new Set([
  "king",
  "queen",
  "pawn",
  "rook",
  "bishop",
  "knight",
  "wolf",
  "golem",
  "archer",
  "bomber",
  "wisp",
]);
const EFFECT_TYPES = new Set([
  "damage",
  "heal",
  "drain",
  "dot",
  "aoe",
  "debuff",
  "buff",
  "attract_multi",
  "summon",
]);
const EFFECT_CATEGORIES = new Set([
  "damage",
  "heal",
  "drain",
  "defense",
  "pushback",
  "attract",
  "teleport",
  "aoe",
  "dot",
  "debuff",
  "buff",
  "cc",
]);

function finiteInRange(
  label: string,
  x: number,
  lo: number,
  hi: number,
): string | null {
  if (!Number.isFinite(x)) return `${label} must be a finite number`;
  if (x < lo || x > hi) return `${label} is out of range`;
  return null;
}

function requireId(id: string, label: string): string | null {
  if (!id) return `${label} id cannot be empty`;
  if (id.length > 64) return `${label} id exceeds maximum length`;
  return null;
}

export function unsafeUrl(url: string): boolean {
  const lower = url.trimStart().toLowerCase();
  return (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  );
}

/** Player-facing hrefs: only http(s) after trim. Rejects javascript: ads. */
export function safeExternalHref(url: string): string {
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("https://") || lower.startsWith("http://")) {
    return trimmed;
  }
  return "#";
}

export function validateWalkFrameUrls(
  frames: readonly string[],
): string | null {
  if (frames.length > 16) return "Walk-frame arrays cannot exceed 16 entries";
  for (const url of frames) {
    const err = validateOptionalUrl("walkFrame", url);
    if (err) return err;
  }
  return null;
}

export function isBanReasonKey(version: string): boolean {
  return version.startsWith("ban#");
}

export function validateChangelog(
  version: string,
  text: string,
): string | null {
  if (!version) return "version cannot be empty";
  if (version.length > 32) return "version exceeds maximum length";
  if (isBanReasonKey(version)) {
    return "version cannot use the ban-reason namespace";
  }
  if (text.length > MAX_JSON_BLOB) return "changelog exceeds maximum size";
  return null;
}

export function validateEnemyName(name: string): string | null {
  if (!name) return "Name cannot be empty";
  if (name.length > 100) return "Name exceeds maximum length";
  return null;
}

export function validateAdBox(
  index: number,
  imageUrl: string,
  linkUrl: string,
): string | null {
  if (index < 0 || index > 2) return "index out of range: must be 0, 1, or 2";
  if (!imageUrl) return "imageUrl cannot be empty";
  if (!linkUrl) return "linkUrl cannot be empty";
  return (
    validateOptionalUrl("imageUrl", imageUrl) ??
    validateOptionalUrl("linkUrl", linkUrl)
  );
}

/** Retired catalog spells must not become owned via upgradeSpell. */
export function shouldRejectRetiredSpellUpgrade(args: {
  usableByPlayer: boolean;
  alreadyOwned: boolean;
}): boolean {
  return args.usableByPlayer === false && !args.alreadyOwned;
}

/** Deactivated achievements must not accept new unlocks. Existing claims stay. */
export function shouldRejectInactiveAchievementUnlock(
  active: boolean,
): boolean {
  return active === false;
}

export const MAX_DUNGEON_DEPTH = 16;

export function clampDungeonDepth(depth: number): number {
  if (!Number.isFinite(depth) || depth < 0) return 0;
  return Math.min(Math.floor(depth), MAX_DUNGEON_DEPTH);
}

/** Official overworld / heal max HP. Mirrors adminGuard.maxPersistedHp. */
export function maxPersistedHp(level: number, growthPercent: number): number {
  const lvl = Math.max(1, Math.floor(level));
  const growth = Math.max(1, Math.floor(growthPercent));
  return 100 + (lvl - 1) * growth;
}

/**
 * Server-checkable achievement conditions. Combat feats stay client-trusted.
 * Mirrors adminGuard.achievementUnlockRejected.
 */
export function achievementUnlockRejected(
  condition: string,
  bestLevel: number,
  doka: number,
  bestSpellLevel: number,
): string | null {
  if (condition === "level_10" && bestLevel < 10) return "Level below 10";
  if (condition === "doka_1000" && doka < 1000) {
    return "Doka balance below 1000";
  }
  if (condition === "doka_10000" && doka < 10000) {
    return "Doka balance below 10000";
  }
  if (condition === "spell_level_5" && bestSpellLevel < 5) {
    return "No spell at level 5";
  }
  return null;
}

/**
 * Wallet / level feats are checked against canister state. Victory used to
 * call markAchievementUnlocked with projected recap totals before
 * applyRewards, so the unlock #err'd and achievementsShownRef blocked the
 * post-credit retry. Fire these only after applyRewards commits.
 * spell_level_5 is already on the canister via upgradeSpell.
 */
export function shouldDeferAchievementUnlockUntilRewardsPersist(
  condition: string,
): boolean {
  return (
    condition === "level_10" ||
    condition === "doka_1000" ||
    condition === "doka_10000"
  );
}

/** Conditions that become legal only after applyRewards writes level / Doka. */
export function thresholdAchievementConditionsFromPersist(args: {
  level: number;
  doka: number;
}): string[] {
  const level = Math.max(0, Math.floor(Number(args.level) || 0));
  const doka = Math.max(0, Math.floor(Number(args.doka) || 0));
  const out: string[] = [];
  if (level >= 10) out.push("level_10");
  if (doka >= 1000) out.push("doka_1000");
  if (doka >= 10000) out.push("doka_10000");
  return out;
}

/** Count a Boss Rush master run only while still occupying room 9. */
export function shouldCountBossRushRun(
  currentRoom: number,
  roomIndex: number,
): boolean {
  return roomIndex === 9 && currentRoom === 9;
}

export function validateOptionalUrl(label: string, url: string): string | null {
  if (!url) return null;
  if (url.length > 2048) return `${label} exceeds maximum URL length`;
  if (unsafeUrl(url)) return `${label} uses a forbidden URL scheme`;
  return null;
}

export function validateJsonBlob(label: string, blob: string): string | null {
  if (blob.length > MAX_JSON_BLOB) return `${label} exceeds maximum size`;
  if (blob.length === 0) return null;
  if (!(blob.startsWith("{") || blob.startsWith("["))) {
    return `${label} must be empty or a JSON object/array`;
  }
  return null;
}

export function validateDokaGrant(amount: number): string | null {
  if (!Number.isFinite(amount) || amount <= 0) {
    return "Grant amount must be greater than 0";
  }
  if (amount > MAX_DOKA_GRANT) {
    return "Grant amount exceeds maximum of 10000000";
  }
  return null;
}

export function validateAssignRole(role: string): string | null {
  if (role !== "admin" && role !== "user") {
    return 'role must be "admin" or "user"';
  }
  return null;
}

export function wouldSelfDemote(
  callerText: string,
  targetText: string,
  role: string,
): boolean {
  return callerText === targetText && role !== "admin";
}

export function validateLevelUpConfig(config: {
  statGrowthPercent: number;
  apMpLevelThreshold: number;
  spellLevelingBaseCost: number;
  spellLevelingCostMultiplier: number;
  spellDmgGrowthPercent: number;
  maxSpellRange: number;
  spellRangeGrowthLevels: number;
  spellFailBaseChance: number;
  spellFailReductionPerLevel: number;
}): string | null {
  if (config.statGrowthPercent < 1 || config.statGrowthPercent > 50) {
    return "statGrowthPercent must be between 1 and 50";
  }
  if (config.apMpLevelThreshold < 1 || config.apMpLevelThreshold > 100) {
    return "apMpLevelThreshold must be between 1 and 100";
  }
  if (
    config.spellLevelingBaseCost < 1 ||
    config.spellLevelingBaseCost > 1_000_000
  ) {
    return "spellLevelingBaseCost must be between 1 and 1000000";
  }
  const mult = finiteInRange(
    "spellLevelingCostMultiplier",
    config.spellLevelingCostMultiplier,
    1,
    10,
  );
  if (mult) return mult;
  if (config.spellDmgGrowthPercent > 50) {
    return "spellDmgGrowthPercent must be at most 50";
  }
  if (config.maxSpellRange < 1 || config.maxSpellRange > 20) {
    return "maxSpellRange must be between 1 and 20";
  }
  if (
    config.spellRangeGrowthLevels < 1 ||
    config.spellRangeGrowthLevels > 100
  ) {
    return "spellRangeGrowthLevels must be between 1 and 100";
  }
  return (
    finiteInRange("spellFailBaseChance", config.spellFailBaseChance, 0, 100) ??
    finiteInRange(
      "spellFailReductionPerLevel",
      config.spellFailReductionPerLevel,
      0,
      10,
    )
  );
}

export function validateGameConfig(config: {
  dokaSpawnChance: number;
  leaderBoostPercent: number;
  dokaSpawnBaseValue: number;
}): string | null {
  if (config.dokaSpawnChance < 0 || config.dokaSpawnChance > 100) {
    return "dokaSpawnChance must be between 0 and 100";
  }
  if (config.leaderBoostPercent < 0 || config.leaderBoostPercent > 100) {
    return "leaderBoostPercent must be between 0 and 100";
  }
  if (config.dokaSpawnBaseValue < 1 || config.dokaSpawnBaseValue > 10_000) {
    return "dokaSpawnBaseValue must be between 1 and 10000";
  }
  return null;
}

export function validateTierSpawnConfig(config: {
  tierSize: number;
  sameTierPercent: number;
  adjacentTierPercent: number;
  twoAwayPercent: number;
  threeOrMorePercent: number;
}): string | null {
  if (config.tierSize < 1 || config.tierSize > 100) {
    return "tierSize must be between 1 and 100";
  }
  return (
    finiteInRange("sameTierPercent", config.sameTierPercent, 0, 100) ??
    finiteInRange("adjacentTierPercent", config.adjacentTierPercent, 0, 100) ??
    finiteInRange("twoAwayPercent", config.twoAwayPercent, 0, 100) ??
    finiteInRange("threeOrMorePercent", config.threeOrMorePercent, 0, 100)
  );
}

export function validateSpellConfig(config: {
  id: string;
  name: string;
  apCost: number;
  minRange: number;
  maxRange: number;
  spellType: string;
  effectType: string;
  effectCategory: string;
  isSummon?: boolean;
  summonAI?: string;
  summonLifespan?: number;
  summonPieceType?: string;
  summonLevel?: number;
  hpScale?: number;
  damageScale?: number;
  summonUnitDef?: {
    pieceType?: string;
    level?: number;
    hpScale?: number;
    damageScale?: number;
  };
}): string | null {
  const idErr = requireId(config.id, "Spell");
  if (idErr) return idErr;
  if (!config.name) return "Spell name cannot be empty";
  if (config.apCost < 1 || config.apCost > 12) {
    return "apCost must be between 1 and 12";
  }
  if (config.minRange > config.maxRange) {
    return "minRange cannot exceed maxRange";
  }
  if (!SPELL_TYPES.has(config.spellType)) {
    return "spellType must be damage, heal, drain, or summon";
  }
  if (!EFFECT_TYPES.has(config.effectType)) {
    return "effectType is not a recognized value";
  }
  if (!EFFECT_CATEGORIES.has(config.effectCategory)) {
    return "effectCategory is not a recognized value";
  }
  if (config.spellType === "summon" && !config.isSummon) {
    return "spellType summon requires isSummon";
  }
  if (config.effectType === "summon" && !config.isSummon) {
    return "effectType summon requires isSummon";
  }
  const ai = config.summonAI ?? "";
  if (config.isSummon === true) {
    if (!SUMMON_AIS.has(ai)) {
      return "summonAI must be a known archetype";
    }
  } else if (config.isSummon === false && ai !== "") {
    return "summonAI must be empty when isSummon is false";
  } else if (ai && !SUMMON_AIS.has(ai)) {
    return "summonAI is not a recognized archetype";
  }
  if (config.summonLifespan != null && config.summonLifespan > 20) {
    return "summonLifespan cannot exceed 20";
  }
  const summonLevel = config.summonLevel ?? config.summonUnitDef?.level;
  if (summonLevel != null && summonLevel > 99) {
    return "summonUnitDef.level cannot exceed 99";
  }
  const piece = config.summonPieceType ?? config.summonUnitDef?.pieceType ?? "";
  if (config.isSummon === true) {
    if (!PIECE_TYPES.has(piece)) {
      return "summonUnitDef.pieceType is not a recognized value";
    }
  } else if (piece && !PIECE_TYPES.has(piece)) {
    return "summonUnitDef.pieceType is not a recognized piece type";
  }
  const hpScale = config.hpScale ?? config.summonUnitDef?.hpScale;
  const damageScale = config.damageScale ?? config.summonUnitDef?.damageScale;
  if (hpScale != null) {
    const hp = finiteInRange("summonUnitDef.hpScale", hpScale, 0, 10);
    if (hp) return hp;
  }
  if (damageScale != null) {
    const dmg = finiteInRange("summonUnitDef.damageScale", damageScale, 0, 10);
    if (dmg) return dmg;
  }
  return null;
}

export function validateBossPortalAssignment(
  portalId: string,
  bossId: string,
): string | null {
  return requireId(portalId, "Portal") ?? requireId(bossId, "Boss");
}

/**
 * Appearance/editor updates must keep stored spell arrays.
 * Failure: union+max on incoming keys minted retired ids and unpaid levels.
 */
export function resolveAppearanceSpellLevels(args: {
  storedKeys: readonly string[];
  storedValues: readonly number[];
  incomingKeys: readonly string[];
  incomingValues: readonly number[];
}): { keys: string[]; values: number[] } {
  void args.incomingKeys;
  void args.incomingValues;
  return {
    keys: [...args.storedKeys],
    values: [...args.storedValues],
  };
}

/** Incoming appearance arrays must not add ids or raise paid levels. */
export function incomingSpellLevelsWouldMint(args: {
  storedKeys: readonly string[];
  incomingKeys: readonly string[];
  storedLevel: number;
  incomingLevel: number;
}): boolean {
  const addsId = args.incomingKeys.some((id) => !args.storedKeys.includes(id));
  return addsId || args.incomingLevel > args.storedLevel;
}

/** Retired catalog spells stay in the library only if the player already owns them. */
export function shouldIncludeBackendSpellInLibrary(args: {
  usableByPlayer?: boolean;
  spellId: string;
  ownedSpellIds: ReadonlySet<string>;
}): boolean {
  if (args.usableByPlayer !== false) return true;
  return args.ownedSpellIds.has(args.spellId);
}

export function isBuiltInSpellId(id: string): boolean {
  return (BUILT_IN_SPELL_IDS as readonly string[]).includes(id);
}

/** Ban must keep claimed flags; wiping them is the double-claim path. */
export function shouldWipeAchievementsOnBan(): boolean {
  return false;
}
