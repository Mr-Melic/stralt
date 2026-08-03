import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  // ─── Inlined stored record types (no project imports) ───────────────────────
  // These mirror the deployed .most baseline signature at
  // .old/src/backend/dist/backend.most (lines 1-365). They are duplicated here
  // so the migration is self-contained and remains correct even if the project
  // types change in future builds.
  //
  // IMPORTANT: every field name, type, and mutability below MUST match the
  // .most baseline exactly. The .most is the authoritative deployed signature.

  type UserRole = { #admin; #guest; #user };

  type AchievementConfig = {
    active      : Bool;
    condition   : Text;
    description : Text;
    dokaReward  : Nat;
    id          : Text;
    name        : Text;
  };

  type AchievementProgress = {
    achievementId : Text;
    claimed       : Bool;
    principalId   : Text;
    unlocked      : Bool;
    unlockedAt    : Int;
  };

  type BattleEffect = {
    description : Text;
    effectType  : { #buff; #damage; #debuff };
    id          : Text;
    name        : Text;
    value       : Int;
  };

  type BossStats = {
    ap   : Nat;
    atk  : Nat;
    hp   : Nat;
    init : Nat;
    mp   : Nat;
    res  : Nat;
    sp   : Nat;
  };

  type BossPhaseConfig = {
    hpThreshold      : Float;
    phaseNumber      : Nat;
    specialAbilities : [Text];
    spellPoolIds     : [Text];
    statMultiplier   : Float;
    summonCount      : Nat;
  };

  type BossConfig = {
    adminNotes           : Text;
    baseStats            : BossStats;
    bossMapColor         : Text;
    defeated             : Bool;
    id                   : Text;
    name                 : Text;
    phase1               : BossPhaseConfig;
    phase2               : BossPhaseConfig;
    pieceType            : Text;
    portalColor          : Text;
    rewardDokaMultiplier : Float;
    rewardXpMultiplier   : Float;
  };

  type BossRushState = {
    currentRoom          : Nat;
    highestRoomCompleted : Nat;
    totalBossRushRuns    : Nat;
  };

  type BuffInventoryItem = {
    itemId   : Text;
    quantity : Nat;
  };

  // BuffInventory is a plain array of items (per .most line 56).
  type BuffInventory = [BuffInventoryItem];

  type CharacterStats = {
    ap        : Nat;
    atk       : Nat;
    chc       : Nat;
    evasion   : Nat;
    hp        : Nat;
    init      : Nat;
    killCount : Nat;
    mp        : Nat;
    res       : Nat;
    resilience: Nat;
    sp        : Nat;
    sr        : Nat;
  };

  type Character = {
    activeSpells            : ?[Nat];
    bloodBalance            : ?Nat;
    bossRushMasterComplete  : ?Bool;
    colors                  : [Text];
    covenantBuff            : ?Text;
    experience              : Nat;
    level                   : Nat;
    name                    : Text;
    pieceType               : Text;
    pixelPattern             : Text;
    rotation                : Nat;
    shrineCount             : ?Nat;
    spellBarOrder           : ?[Text];
    spellLevelKeys          : [Text];
    spellLevelValues        : [Nat];
    stats                   : CharacterStats;
  };

  type CharacterSlot = ?Character;

  type CharacterSlots = {
    slot1 : CharacterSlot;
    slot2 : CharacterSlot;
    slot3 : CharacterSlot;
  };

  type ChatMessage = {
    colorHex    : Text;
    id          : Nat;
    playerName  : Text;
    text        : Text;
    timestampMs : Int;
  };

  type DungeonRecord = {
    bestRewardMultiplier : Float;
    chainDepth           : Nat;
    totalMapsCompleted   : Nat;
  };

  type EnemyConfig = {
    ap        : Nat;
    hp        : Nat;
    id        : Text;
    initStat  : Nat;
    levelMax  : Nat;
    levelMin  : Nat;
    mp        : Nat;
    name      : Text;
    regions   : [Text];
    spriteUrl : ?Text;
  };

  type GameConfig = {
    dokaSpawnBaseValue : Nat;
    dokaSpawnChance    : Nat;
    leaderBoostPercent : Nat;
  };

  type LevelUpConfig = {
    apMpLevelThreshold          : Nat;
    maxSpellRange               : Nat;
    spellDmgGrowthPercent       : Nat;
    spellFailBaseChance         : Float;
    spellFailReductionPerLevel  : Float;
    spellLevelingBaseCost       : Nat;
    spellLevelingCostMultiplier  : Float;
    spellRangeGrowthLevels      : Nat;
    statGrowthPercent           : Nat;
  };

  type MapModifierConfig = {
    active        : Bool;
    description   : Text;
    id            : Text;
    modifierType  : Text;
    name          : Text;
    triggerChance : Nat;
  };

  type PlayerSpriteConfig = {
    backUrl           : ?Text;
    backWalkFrames    : [Text];
    characterPieceType: Text;
    frontUrl          : ?Text;
    frontWalkFrames   : [Text];
    id                : Text;
    leftUrl           : ?Text;
    leftWalkFrames    : [Text];
    name              : Text;
    rightUrl          : ?Text;
    rightWalkFrames   : [Text];
  };

  type PurchaseRecord = {
    customerAddress : Text;
    customerCity    : Text;
    customerCountry : Text;
    customerEmail   : Text;
    customerName    : Text;
    customerPostal  : Text;
    customerSurname : Text;
    dokaAmount      : Nat;
    id              : Text;
    packageId       : Text;
    proofFileUrl    : Text;
    status          : Text;
    timestamp       : Int;
    userPrincipal   : Principal;
  };

  type RegionConfig = {
    backgroundColor : Text;
    battleEffects   : [BattleEffect];
    id              : Text;
    levelMax        : Nat;
    levelMin        : Nat;
    name            : Text;
  };

  type ShopPackage = {
    displayOrder   : Nat;
    dokaAmount     : Nat;
    id             : Text;
    paymentLink    : Text;
    priceEuroCents : Nat;
  };

  type SpellConfig = {
    aoe             : Bool;
    apCost          : Nat;
    cooldown        : Nat;
    damage          : Nat;
    description     : Text;
    diagonal        : Bool;
    effectCategory  : Text;
    effectParams    : ?Text;
    effectType      : Text;
    freeCells       : Bool;
    healAmount      : Nat;
    hitTiles        : [(Int, Int)];
    hitsAllies      : Bool;
    iconEmoji       : Text;
    id              : Text;
    isPhysical      : Bool;
    lineOfSight     : Bool;
    linear          : Bool;
    maxRange        : Nat;
    minLevel        : Nat;
    minRange        : Nat;
    modifiableRange : Bool;
    mpCost          : Nat;
    multiTarget     : Bool;
    name            : Text;
    range           : Nat;
    spellType       : Text;
    usableByEnemy   : Bool;
    usableByPlayer  : Bool;
  };

  type TierSpawnConfig = {
    adjacentTierPercent    : Float;
    sameTierPercent        : Float;
    threeOrMorePercent     : Float;
    tierSize               : Nat;
    twoAwayPercent         : Float;
  };

  type UserProfile = {
    name     : Text;
    uiLayout : Text;
  };

  // ─── OldActor: matches the deployed .most signature (37 fields) ────────────
  // Field names, types, and var/let mutability match .most lines 224-364.
  type OldActor = {
    BUFF_CATALOG : [(Text, Text, Nat)];
    DEFAULT_ENEMY_NAMES : [Text];
    ROLE_CHANGE_MIN_NS : Int;
    accessControlState : AccessControl.AccessControlState;
    achievementConfigs : Map.Map<Text, AchievementConfig>;
    achievementProgress : Map.Map<Text, AchievementProgress>;
    var adBoxes : [(Text, Text, Bool)];
    var appVersion : Text;
    bannedPrincipals : Map.Map<Text, Bool>;
    bossConfigs : Map.Map<Text, BossConfig>;
    bossPortalAssignments : Map.Map<Text, Text>;
    var bossRushConfigStore : Text;
    bossRushStates : Map.Map<Text, BossRushState>;
    buffInventories : Map.Map<Text, BuffInventory>;
    changelogShownVersions : Map.Map<Principal, Text>;
    changelogs : Map.Map<Text, Text>;
    characterSlots : Map.Map<Principal, CharacterSlots>;
    var chatMessages : List.List<ChatMessage>;
    var colorPaletteStore : Text;
    dokaBalances : Map.Map<Principal, Nat>;
    dungeonRecords : Map.Map<Principal, DungeonRecord>;
    enemyConfigs : Map.Map<Text, EnemyConfig>;
    var enemyNames : List.List<Text>;
    var enemyNamesInitialised : Bool;
    var gameConfig : GameConfig;
    var levelUpConfig : LevelUpConfig;
    mapModifierConfigs : Map.Map<Text, MapModifierConfig>;
    var nextChatId : Nat;
    var nextPurchaseId : Nat;
    playerSpriteConfigs : Map.Map<Text, PlayerSpriteConfig>;
    purchaseRecords : Map.Map<Text, PurchaseRecord>;
    regionConfigs : Map.Map<Text, RegionConfig>;
    roleChangeTimestamps : Map.Map<Text, Int>;
    shopPackages : Map.Map<Text, ShopPackage>;
    spellConfigs : Map.Map<Text, SpellConfig>;
    var tierSpawnConfig : TierSpawnConfig;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  // NewActor is structurally identical to OldActor (no shape change in this build;
  // only inline initializers were removed from the actor body).
  type NewActor = OldActor;

  // ─── Fresh-install default literals ────────────────────────────────────────
  let DEFAULT_ENEMY_NAMES : [Text] = [
    // Roman
    "Maximus", "Brutus", "Cassius", "Octavian", "Tiberius",
    "Caligula", "Nero", "Vespasian", "Hadrian", "Trajan",
    "Marcus", "Lucius", "Gaius", "Quintus", "Flavius",
    "Decimus", "Publius", "Aulus", "Gnaeus", "Servius",
    // Greek
    "Achilles", "Hector", "Ajax", "Odysseus", "Perseus",
    "Theseus", "Heracles", "Leonidas", "Pericles", "Themistocles",
    "Xenophon", "Lysander", "Agamemnon", "Priam", "Diomedes",
    "Patroclus", "Menelaus", "Ptolemy", "Pyrrhus", "Alcibiades",
    // Egyptian
    "Ramses", "Thutmose", "Amenhotep", "Akhenaten", "Seti",
    "Khafre", "Djoser", "Narmer", "Khufu", "Sneferu",
    "Mentuhotep", "Ahmose", "Horemheb", "Tutankhamun", "Nefertiti",
    // Mesopotamian
    "Gilgamesh", "Sargon", "Hammurabi", "Nebuchadnezzar", "Ashurbanipal",
    "Tiglath", "Nimrod", "Enkidu", "Shamshi", "Naram",
    // Norse / Germanic
    "Odin", "Thor", "Loki", "Freyr", "Tyr",
    "Baldur", "Fenrir", "Sigurd", "Ragnar", "Ivar",
    // Persian / Achaemenid
    "Cyrus", "Darius", "Xerxes", "Artaxerxes", "Cambyses",
    // Celtic
    "Vercingetorix", "Brennus", "Boudicca", "Caractacus", "Ambiorix",
    // Aztec / Mayan
    "Itzcoatl", "Tlacaelel", "Moctezuma", "Cuauhtemoc", "Chimalli"
  ];

  let DEFAULT_BUFF_CATALOG : [(Text, Text, Nat)] = [
    ("health_potion",   "Health Potion",   50),
    ("greater_potion",  "Greater Potion",  120),
    ("battle_elixir",   "Battle Elixir",   200),
    ("swift_boots",     "Swift Boots",     80),
    ("shield_charm",    "Shield Charm",    150),
    ("fury_potion",     "Fury Potion",     100),
  ];

  let DEFAULT_AD_BOXES : [(Text, Text, Bool)] = [
    ("", "", false),
    ("", "", false),
    ("", "", false),
  ];

  /// Migration entry point.
  ///
  /// - Upgrade path (deployed canister present): `old` carries all 37 fields
  ///   populated with real persisted data. We return `old` verbatim because
  ///   NewActor = OldActor (no shape change in this build — only inline
  ///   initializers were stripped from the actor body).
  ///
  /// - Fresh-install path (no prior canister): the migration runner passes a
  ///   default-initialized `OldActor` (empty Maps/Lists, "" for Text, 0 for
  ///   Nat, false for Bool, empty arrays). We detect this by checking
  ///   `old.BUFF_CATALOG.size() == 0` — on a real upgrade the catalog is
  ///   always populated with the 6 default entries, so an empty catalog
  ///   reliably signals fresh install. We then supply the array-literal
  ///   defaults that the actor body previously inlined.
  public func migration(old : OldActor) : NewActor {
    if (old.BUFF_CATALOG.size() == 0) {
      // Fresh install: provide the literal defaults that were previously
      // inlined in the actor body. Empty Maps/Lists/Text/Nat/Bool already
      // have correct default-initialised values from `old`; we only need to
      // override the array-literal and appVersion fields.
      {
        BUFF_CATALOG = DEFAULT_BUFF_CATALOG;
        DEFAULT_ENEMY_NAMES = DEFAULT_ENEMY_NAMES;
        ROLE_CHANGE_MIN_NS = old.ROLE_CHANGE_MIN_NS;
        accessControlState = old.accessControlState;
        achievementConfigs = old.achievementConfigs;
        achievementProgress = old.achievementProgress;
        var adBoxes = DEFAULT_AD_BOXES;
        var appVersion = "v163";
        bannedPrincipals = old.bannedPrincipals;
        bossConfigs = old.bossConfigs;
        bossPortalAssignments = old.bossPortalAssignments;
        var bossRushConfigStore = old.bossRushConfigStore;
        bossRushStates = old.bossRushStates;
        buffInventories = old.buffInventories;
        changelogShownVersions = old.changelogShownVersions;
        changelogs = old.changelogs;
        characterSlots = old.characterSlots;
        var chatMessages = old.chatMessages;
        var colorPaletteStore = old.colorPaletteStore;
        dokaBalances = old.dokaBalances;
        dungeonRecords = old.dungeonRecords;
        enemyConfigs = old.enemyConfigs;
        var enemyNames = old.enemyNames;
        var enemyNamesInitialised = old.enemyNamesInitialised;
        var gameConfig = old.gameConfig;
        var levelUpConfig = old.levelUpConfig;
        mapModifierConfigs = old.mapModifierConfigs;
        var nextChatId = old.nextChatId;
        var nextPurchaseId = old.nextPurchaseId;
        playerSpriteConfigs = old.playerSpriteConfigs;
        purchaseRecords = old.purchaseRecords;
        regionConfigs = old.regionConfigs;
        roleChangeTimestamps = old.roleChangeTimestamps;
        shopPackages = old.shopPackages;
        spellConfigs = old.spellConfigs;
        var tierSpawnConfig = old.tierSpawnConfig;
        userProfiles = old.userProfiles;
      };
    } else {
      // Upgrade: return old verbatim (NewActor = OldActor; no shape change).
      old;
    };
  };
};
