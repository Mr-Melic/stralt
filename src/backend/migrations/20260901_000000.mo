import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {

  // Introduce GameKey shop stables onto a canister that already ran 20260831.
  // OldActor is the frozen 20260831 NewActor (no GameKey maps). Other live
  // fields (characterSlots, dokaBalances, …) persist orthogonally.
  // Inlined types stay frozen if project types change later.
  // FROZEN once Caffeine may have applied this tail. Do not add fields to
  // NewActor — that traps populated upgrades (RTS memory-incompatible / IC0503).
  // Further stables go in a later lex file (20260902+). Handle both replica
  // states: 20260901 never applied (first deploy trapped) → this file is the
  // GameKey step; 20260901 applied → new fields need a later file.

  type SummonUnitDef = {
    pieceType : Text;
    level : Nat;
    hpScale : Float;
    damageScale : Float;
  };

  type SpellConfig = {
    id : Text;
    name : Text;
    description : Text;
    iconEmoji : Text;
    apCost : Nat;
    mpCost : Nat;
    damage : Nat;
    healAmount : Nat;
    effectType : Text;
    spellType : Text;
    isPhysical : Bool;
    range : Nat;
    minRange : Nat;
    maxRange : Nat;
    modifiableRange : Bool;
    lineOfSight : Bool;
    linear : Bool;
    diagonal : Bool;
    freeCells : Bool;
    aoe : Bool;
    multiTarget : Bool;
    hitsAllies : Bool;
    hitTiles : [(Int, Int)];
    effectCategory : Text;
    usableByPlayer : Bool;
    usableByEnemy : Bool;
    minLevel : Nat;
    effectParams : ?Text;
    isSummon : Bool;
    summonAI : Text;
    summonLifespan : Nat;
    summonUnitDef : SummonUnitDef;
    cooldown : Nat;
  };

  type LevelUpConfig = {
    statGrowthPercent : Nat;
    apMpLevelThreshold : Nat;
    spellLevelingBaseCost : Nat;
    spellLevelingCostMultiplier : Float;
    spellDmgGrowthPercent : Nat;
    maxSpellRange : Nat;
    spellRangeGrowthLevels : Nat;
    spellFailBaseChance : Float;
    spellFailReductionPerLevel : Float;
  };

  type AdminGameConfig = {
    leaderBoostPercent : Nat;
    dokaSpawnChance : Nat;
    dokaSpawnBaseValue : Nat;
  };

  type TierSpawnConfig = {
    tierSize : Nat;
    sameTierPercent : Float;
    adjacentTierPercent : Float;
    twoAwayPercent : Float;
    threeOrMorePercent : Float;
  };

  type AdminAuditEntry = {
    adminPrincipal : Text;
    timestampNs : Int;
    action : Text;
    objectId : Text;
    previousSummary : Text;
    newSummary : Text;
  };

  type GameKeyRequest = {
    id : Text;
    userPrincipal : Principal;
    email : Text;
    emailConsent : Bool;
    hintedEuroCents : Nat;
    timestamp : Int;
    status : Text;
    dokaAmount : Nat;
    emailed : Bool;
    approvedAt : Int;
    redeemedAt : Int;
    redeemedBy : Text;
  };

  type GameKeyLedgerEntry = {
    requestId : Text;
    dokaAmount : Nat;
    redeemed : Bool;
    redeemedBy : Text;
  };

  // Deployed Caffeine shape after 20260831 (no GameKey). Matches that
  // migration's NewActor so a populated canister is not "already past" this
  // step. Empty-start still runs 20260826 → 20260827 → 20260831 → here.
  type OldActor = {
    spellConfigs : Map.Map<Text, SpellConfig>;
    var adminAuditLog : List.List<AdminAuditEntry>;
    var levelUpConfigPrev : LevelUpConfig;
    var hasLevelUpConfigPrev : Bool;
    var gameConfigPrev : AdminGameConfig;
    var hasGameConfigPrev : Bool;
    var tierSpawnConfigPrev : TierSpawnConfig;
    var hasTierSpawnConfigPrev : Bool;
    var colorPalettePrev : Text;
    var hasColorPalettePrev : Bool;
    var bossRushConfigPrev : Text;
    var hasBossRushConfigPrev : Bool;
  };

  type NewActor = {
    spellConfigs : Map.Map<Text, SpellConfig>;
    var adminAuditLog : List.List<AdminAuditEntry>;
    var levelUpConfigPrev : LevelUpConfig;
    var hasLevelUpConfigPrev : Bool;
    var gameConfigPrev : AdminGameConfig;
    var hasGameConfigPrev : Bool;
    var tierSpawnConfigPrev : TierSpawnConfig;
    var hasTierSpawnConfigPrev : Bool;
    var colorPalettePrev : Text;
    var hasColorPalettePrev : Bool;
    var bossRushConfigPrev : Text;
    var hasBossRushConfigPrev : Bool;
    gameKeyRequests : Map.Map<Text, GameKeyRequest>;
    gameKeyLedger : Map.Map<Text, GameKeyLedgerEntry>;
    gameKeyReveals : Map.Map<Text, Text>;
    lastGameKeyRequestAt : Map.Map<Principal, Int>;
    var nextGameKeyRequestId : Nat;
  };

  public func migration(old : OldActor) : NewActor {
    {
      spellConfigs = old.spellConfigs;
      var adminAuditLog = old.adminAuditLog;
      var levelUpConfigPrev = old.levelUpConfigPrev;
      var hasLevelUpConfigPrev = old.hasLevelUpConfigPrev;
      var gameConfigPrev = old.gameConfigPrev;
      var hasGameConfigPrev = old.hasGameConfigPrev;
      var tierSpawnConfigPrev = old.tierSpawnConfigPrev;
      var hasTierSpawnConfigPrev = old.hasTierSpawnConfigPrev;
      var colorPalettePrev = old.colorPalettePrev;
      var hasColorPalettePrev = old.hasColorPalettePrev;
      var bossRushConfigPrev = old.bossRushConfigPrev;
      var hasBossRushConfigPrev = old.hasBossRushConfigPrev;
      gameKeyRequests = Map.empty();
      gameKeyLedger = Map.empty();
      gameKeyReveals = Map.empty();
      lastGameKeyRequestAt = Map.empty();
      var nextGameKeyRequestId = 0;
    };
  };
};
