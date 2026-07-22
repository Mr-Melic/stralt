import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Debug "mo:core/Debug";
import Nat8 "mo:core/Nat8";
import Blob "mo:core/Blob";
import List "mo:core/List";
import Time "mo:core/Time";
import AdminTypes "types/admin";
import AdminLib "lib/admin";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Float "mo:core/Float";

import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import Text "mo:core/Text";
















actor {
    let accessControlState = AccessControl.initState();
    include MixinAuthorization(accessControlState);

    public type UserProfile = {
        name : Text;
        /// Compact JSON blob holding the caller's full panel layout (per panel id:
        /// x, y, folded/width state). Empty string = no layout saved yet.
        /// Single field, single endpoint (saveUserUiLayout / getUserUiLayout).
        uiLayout : Text;
    };

    let userProfiles = Map.empty<Principal, UserProfile>();

    public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
        userProfiles.get(caller);
    };

    public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
        if (caller != user) {
            return null;
        };
        userProfiles.get(caller);
    };

    public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
        userProfiles.add(caller, profile);
    };

    /// Save the caller's full panel-layout blob (one compact JSON Text field).
    /// Single save endpoint for the layout — no per-panel records.
    /// Validates the caller is not anonymous. Reads the existing UserProfile,
    /// updates only uiLayout, and writes it back to the userProfiles Map.
    public shared ({ caller }) func saveUserUiLayout(layout : Text) : async { #ok; #err : Text } {
        if (caller.isAnonymous()) {
            return #err("Unauthorized: anonymous caller");
        };
        switch (userProfiles.get(caller)) {
            case null {
                userProfiles.add(caller, { name = ""; uiLayout = layout });
            };
            case (?existing) {
                userProfiles.add(caller, { existing with uiLayout = layout });
            };
        };
        #ok;
    };

    /// Load the caller's panel-layout blob. Returns the empty string if the
    /// caller has no UserProfile yet or if uiLayout was never set.
    public query ({ caller }) func getUserUiLayout() : async Text {
        switch (userProfiles.get(caller)) {
            case null { "" };
            case (?profile) { profile.uiLayout };
        };
    };

    // Character management system
    type Character = {
        name        : Text;
        pieceType   : Text;
        level       : Nat;
        experience  : Nat;
        stats       : CharacterStats;
        pixelPattern : Text;
        /// Maximum 16 colors (enforced in createCharacter/updateCharacter).
        colors      : [Text];
        rotation    : Nat;
        /// Spell upgrade levels keyed by spell id.
        /// Stored as parallel arrays for shared-type compatibility.
        spellLevelKeys   : [Text];
        spellLevelValues : [Nat];
        /// Session state — optional so existing saved characters continue to load.
        bloodBalance  : ?Nat;    // 0-100 blood balance for the region
        covenantBuff  : ?Text;   // active covenant buff name, empty = none
        shrineCount   : ?Nat;    // shrines activated this session
        activeSpells  : ?[Nat];  // array of equipped spell IDs (max 8)
        /// Player-arranged spell bar order (spell ids; max 8). Empty/null = derive default once on load.
        spellBarOrder : ?[Text];
        /// Boss Rush master completion flag — optional for backwards compat.
        bossRushMasterComplete : ?Bool;
    };

    type CharacterStats = {
        hp : Nat;
        ap : Nat;
        mp : Nat;
        atk : Nat;
        res : Nat;
        evasion : Nat;
        init : Nat;
        sp : Nat;
        sr : Nat;
        resilience : Nat;
        chc : Nat;
        killCount : Nat;
    };

    type CharacterSlot = ?Character;

    type CharacterSlots = {
        slot1 : CharacterSlot;
        slot2 : CharacterSlot;
        slot3 : CharacterSlot;
    };

    let characterSlots = Map.empty<Principal, CharacterSlots>();

    public shared ({ caller }) func createCharacter(slot : Nat, character : Character) : async { #ok; #err : Text } {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            return #err("Unauthorized: Only users can create characters");
        };

        if (slot < 1 or slot > 3) {
            return #err("Invalid slot number");
        };
        // L1: cap colors array at 16 entries.
        if (character.colors.size() > 16) {
            return #err("colors array exceeds maximum of 16 entries");
        };

        let existingSlots = switch (characterSlots.get(caller)) {
            case null {
                {
                    slot1 = null;
                    slot2 = null;
                    slot3 = null;
                };
            };
            case (?slots) { slots };
        };

        let updatedSlots = switch (slot) {
            case 1 {
                if (existingSlots.slot1 != null) {
                    return #err("Slot 1 is already occupied");
                };
                { existingSlots with slot1 = ?character };
            };
            case 2 {
                if (existingSlots.slot2 != null) {
                    return #err("Slot 2 is already occupied");
                };
                { existingSlots with slot2 = ?character };
            };
            case 3 {
                if (existingSlots.slot3 != null) {
                    return #err("Slot 3 is already occupied");
                };
                { existingSlots with slot3 = ?character };
            };
            case _ { return #err("Invalid slot number") };
        };

        characterSlots.add(caller, updatedSlots);
        #ok;
    };

    public shared ({ caller }) func updateCharacter(slot : Nat, character : Character) : async { #ok; #err : Text } {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            return #err("Unauthorized: Only users can update characters");
        };

        if (slot < 1 or slot > 3) {
            return #err("Invalid slot number");
        };
        // L1: cap colors array at 16 entries.
        if (character.colors.size() > 16) {
            return #err("colors array exceeds maximum of 16 entries");
        };

        // ─── Validation ───────────────────────────────────────────────────
        // HP cap: level * 200 + 100
        let maxHpAllowed : Nat = character.level * 200 + 100;
        if (character.stats.hp > maxHpAllowed) {
            return #err("validation failed: hp exceeds maximum " # maxHpAllowed.toText() # " for level " # character.level.toText());
        };
        if (character.stats.ap > 20) {
            return #err("validation failed: ap cannot exceed 20");
        };
        if (character.stats.mp > 20) {
            return #err("validation failed: mp cannot exceed 20");
        };
        // Level and killCount can only go up — check against existing character.
        let existingSlots = switch (characterSlots.get(caller)) {
            case null { return #err("No characters found for user") };
            case (?slots) { slots };
        };
        let existingChar = switch (slot) {
            case 1 { existingSlots.slot1 };
            case 2 { existingSlots.slot2 };
            case 3 { existingSlots.slot3 };
            case _ { null };
        };
        switch (existingChar) {
            case null { return #err("Slot " # slot.toText() # " is empty") };
            case (?ec) {
                if (character.level < ec.level) {
                    return #err("validation failed: level cannot decrease");
                };
                if (character.stats.killCount < ec.stats.killCount) {
                    return #err("validation failed: killCount cannot decrease");
                };
            };
        };

        let updatedSlots = switch (slot) {
            case 1 { { existingSlots with slot1 = ?character } };
            case 2 { { existingSlots with slot2 = ?character } };
            case 3 { { existingSlots with slot3 = ?character } };
            case _ { return #err("Invalid slot number") };
        };

        characterSlots.add(caller, updatedSlots);
        #ok;
    };

    public shared ({ caller }) func deleteCharacter(slot : Nat) : async { #ok; #err : Text } {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            return #err("Unauthorized: Only users can delete characters");
        };

        if (slot < 1 or slot > 3) {
            return #err("Invalid slot number");
        };

        let existingSlots = switch (characterSlots.get(caller)) {
            case null { return #err("No characters found for user") };
            case (?slots) { slots };
        };

        let updatedSlots = switch (slot) {
            case 1 {
                if (existingSlots.slot1 == null) {
                    return #err("Slot 1 is already empty");
                };
                { existingSlots with slot1 = null };
            };
            case 2 {
                if (existingSlots.slot2 == null) {
                    return #err("Slot 2 is already empty");
                };
                { existingSlots with slot2 = null };
            };
            case 3 {
                if (existingSlots.slot3 == null) {
                    return #err("Slot 3 is already empty");
                };
                { existingSlots with slot3 = null };
            };
            case _ { return #err("Invalid slot number") };
        };

        characterSlots.add(caller, updatedSlots);
        #ok;
    };

    public query ({ caller }) func getCharacterSlots() : async CharacterSlots {
        switch (characterSlots.get(caller)) {
            case null {
                {
                    slot1 = null;
                    slot2 = null;
                    slot3 = null;
                };
            };
            case (?slots) { slots };
        };
    };

    public query ({ caller }) func getCharacter(slot : Nat) : async CharacterSlot {
        if (slot < 1 or slot > 3) {
            Runtime.trap("Invalid slot number");
        };

        let slots = switch (characterSlots.get(caller)) {
            case null {
                {
                    slot1 = null;
                    slot2 = null;
                    slot3 = null;
                };
            };
            case (?s) { s };
        };

        switch (slot) {
            case 1 { slots.slot1 };
            case 2 { slots.slot2 };
            case 3 { slots.slot3 };
            case _ { null };
        };
    };

    public query ({ caller }) func getAllCharacters() : async { #ok : [(Principal, CharacterSlots)]; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        #ok(characterSlots.entries().toArray());
    };

    // ─── Admin types ────────────────────────────────────────────────────

    type BattleEffect = {
        id          : Text;
        name        : Text;
        description : Text;
        effectType  : { #damage; #buff; #debuff };
        value       : Int;
    };

    type EnemyConfig = {
        id        : Text;
        name      : Text;
        hp        : Nat;
        ap        : Nat;
        mp        : Nat;
        initStat  : Nat;
        levelMin  : Nat;
        levelMax  : Nat;
        regions   : [Text];
        spriteUrl : ?Text;
    };

    type RegionConfig = {
        id              : Text;
        name            : Text;
        levelMin        : Nat;
        levelMax        : Nat;
        battleEffects   : [BattleEffect];
        backgroundColor : Text;
    };

    type PlayerSpriteConfig = {
        id                 : Text;
        name               : Text;
        characterPieceType : Text;
        frontUrl           : ?Text;
        rightUrl           : ?Text;
        leftUrl            : ?Text;
        backUrl            : ?Text;
        frontWalkFrames    : [Text];
        rightWalkFrames    : [Text];
        leftWalkFrames     : [Text];
        backWalkFrames     : [Text];
    };

    // ─── Admin stores ────────────────────────────────────────────────────

    let enemyConfigs        = Map.empty<Text, EnemyConfig>();
    let regionConfigs       = Map.empty<Text, RegionConfig>();
    let playerSpriteConfigs = Map.empty<Text, PlayerSpriteConfig>();

    // ─── Level-up config (singleton, admin-editable) ────────────────────

    var levelUpConfig : AdminTypes.LevelUpConfig = {
        statGrowthPercent           = 5;
        apMpLevelThreshold          = 25;
        spellLevelingBaseCost       = 10;
        spellLevelingCostMultiplier = 2.0;
        spellDmgGrowthPercent       = 3;
        maxSpellRange               = 5;
        spellRangeGrowthLevels      = 10;
        spellFailBaseChance         = 20.0;
        spellFailReductionPerLevel  = 0.1;
    };

    public shared ({ caller }) func adminSetLevelUpConfig(config : AdminTypes.LevelUpConfig) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        levelUpConfig := config;
        #ok;
    };

    public query func getLevelUpConfig() : async AdminTypes.LevelUpConfig {
        levelUpConfig;
    };

    // ─── Spell configs ───────────────────────────────────────────────────
    let spellConfigs = Map.empty<Text, AdminTypes.SpellConfig>();

    // Seed defaults on first run (store is empty on a fresh canister)
    do {
        if (spellConfigs.size() == 0) {
            for (spell in AdminLib.defaultSpells().values()) {
                spellConfigs.add(spell.id, spell);
            };
        };
    };



    // Purge old spell IDs that are no longer part of the registry.
    // This runs on every canister start / upgrade so stale entries are always removed.
    do {
        let OLD_SPELL_IDS : [Text] = [
            "blood_nova", "crimson_heal", "cursed_gust", "drain_life",
            "entangle", "fireball", "frost_nova", "heal",
            "ice_shard", "inferno", "meteor_strike", "mist_form",
            "obliterate", "physical_attack", "plague_wave", "poison_dart",
        ];
        for (id in OLD_SPELL_IDS.values()) {
            spellConfigs.remove(id);
        };
    };

    // ─── Map modifier configs ────────────────────────────────────────────
    let mapModifierConfigs = Map.empty<Text, AdminTypes.MapModifierConfig>();

    // Seed default map modifiers on first run.
    do {
        if (mapModifierConfigs.size() == 0) {
            for (mod in AdminLib.defaultMapModifiers().values()) {
                mapModifierConfigs.add(mod.id, mod);
            };
        };
    };

    // ─── First-login-becomes-admin + rate-limited role assignment ───────
    //
    // The password-based admin system has been removed.
    // AccessControl.initialize() promotes the very first non-anonymous caller
    // to admin and registers all subsequent callers as #user.
    // We call it on every endpoint so the first real player who logs in via
    // Internet Identity automatically becomes admin.
    //
    // M1: role-change timestamps prevent rapid cycling via assignUserRole.
    let roleChangeTimestamps = Map.empty<Text, Int>();
    let ROLE_CHANGE_MIN_NS : Int = 30_000_000_000; // 30 seconds in nanoseconds

    /// Ensure the caller is registered in AccessControl.
    /// The first non-anonymous caller becomes admin; all others become #user.
    func _ensureRegistered(caller : Principal) {
        if (not caller.isAnonymous()) {
            AccessControl.initialize(accessControlState, caller);
        };
    };

    // ─── Enemy config API ────────────────────────────────────────────────

    public shared ({ caller }) func adminSetEnemyConfig(config : EnemyConfig) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        enemyConfigs.add(config.id, config);
        #ok;
    };

    public shared ({ caller }) func adminDeleteEnemyConfig(id : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        enemyConfigs.remove(id);
        #ok;
    };

    public query func getEnemyConfigs() : async [EnemyConfig] {
        enemyConfigs.values().toArray();
    };

    // ─── Region config API ───────────────────────────────────────────────

    public shared ({ caller }) func adminSetRegionConfig(config : RegionConfig) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        regionConfigs.add(config.id, config);
        #ok;
    };

    public shared ({ caller }) func adminDeleteRegionConfig(id : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        regionConfigs.remove(id);
        #ok;
    };

    public query func getRegionConfigs() : async [RegionConfig] {
        regionConfigs.values().toArray();
    };

    // ─── Player sprite config API ────────────────────────────────────────

    public shared ({ caller }) func adminSetPlayerSpriteConfig(config : PlayerSpriteConfig) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        playerSpriteConfigs.add(config.id, config);
        #ok;
    };

    public shared ({ caller }) func adminDeletePlayerSpriteConfig(id : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        playerSpriteConfigs.remove(id);
        #ok;
    };

    public query func getPlayerSpriteConfigs() : async [PlayerSpriteConfig] {
        playerSpriteConfigs.values().toArray();
    };

    // ─── Spell config API ────────────────────────────────────────────────

    public shared ({ caller }) func adminSetSpellConfig(config : AdminTypes.SpellConfig) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        // B3 / C6 / L2: validate spell config fields before saving.
        if (config.id == "") {
            return #err("Spell id cannot be empty");
        };
        if (config.name == "") {
            return #err("Spell name cannot be empty");
        };
        if (config.name.size() > 100) {
            return #err("Spell name exceeds maximum of 100 characters");
        };
        if (config.apCost < 1 or config.apCost > 12) {
            return #err("apCost must be between 1 and 12");
        };
        if (config.cooldown > 10) {
            return #err("cooldown must be between 0 and 10");
        };
        if (config.minRange > 20 or config.maxRange > 20) {
            return #err("minRange and maxRange must be at most 20 (never negative)");
        };
        if (config.damage > 9999) {
            return #err("damage must be at most 9999");
        };
        if (config.healAmount > 1000) {
            return #err("healAmount must be at most 1000");
        };
        spellConfigs.add(config.id, config);
        #ok;
    };

    public shared ({ caller }) func adminDeleteSpellConfig(id : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        spellConfigs.remove(id);
        #ok;
    };

    public query func getSpellConfigs() : async [AdminTypes.SpellConfig] {
        spellConfigs.values().toArray();
    };

    // ─── Map modifier config API ─────────────────────────────────────────

    public shared ({ caller }) func adminSetMapModifier(config : AdminTypes.MapModifierConfig) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        // B4: Validate triggerChance BEFORE storing — reject invalid values upfront.
        if (config.triggerChance > 100) {
            return #err("Invalid chance value: triggerChance must be between 0 and 100");
        };
        mapModifierConfigs.add(config.id, config);
        #ok;
    };

    public shared ({ caller }) func adminDeleteMapModifier(id : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        mapModifierConfigs.remove(id);
        #ok;
    };

    public query func getMapModifiers() : async [AdminTypes.MapModifierConfig] {
        mapModifierConfigs.values().toArray();
    };

    /// Convenience endpoint: update only the triggerChance of an existing map modifier.
    /// Validates that chance is in the range 0–100.
    public shared ({ caller }) func adminSetMapModifierChance(id : Text, chance : Nat) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        if (chance > 100) {
            return #err("chance must be between 0 and 100");
        };
        AdminLib.setMapModifierChance(mapModifierConfigs, id, chance);
    };

    // ─── Spell upgrade (per character) ──────────────────────────────────

    /// Upgrade a spell for the character in the given slot.
    /// Cost = baseCost * 2^currentSpellLevel (all in Doka from character's dokaBalance).
    /// Returns the new spell level on success.
    public shared ({ caller }) func upgradeSpell(slot : Nat, spellId : Text) : async { #ok : Nat; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            return #err("Unauthorized: must be logged in");
        };
        if (spellId == "") {
            return #err("spellId cannot be empty");
        };
        // Validate spellId references an existing spell config.
        switch (spellConfigs.get(spellId)) {
            case null { return #err("Spell not found: " # spellId) };
            case (?_) {};
        };
        if (slot < 1 or slot > 3) {
            return #err("Invalid slot number");
        };

        let existingSlots = switch (characterSlots.get(caller)) {
            case null { return #err("No characters found") };
            case (?s) { s };
        };

        let character = switch (slot) {
            case 1 { switch (existingSlots.slot1) { case null { return #err("Slot 1 is empty") }; case (?c) { c } } };
            case 2 { switch (existingSlots.slot2) { case null { return #err("Slot 2 is empty") }; case (?c) { c } } };
            case 3 { switch (existingSlots.slot3) { case null { return #err("Slot 3 is empty") }; case (?c) { c } } };
            case _ { return #err("Invalid slot") };
        };

        var currentLevel : Nat = 0;
        var found = false;
        var idx : Nat = 0;
        for (k in character.spellLevelKeys.values()) {
            if (k == spellId) {
                currentLevel := character.spellLevelValues[idx];
                found := true;
            };
            idx += 1;
        };

        let baseCost = levelUpConfig.spellLevelingBaseCost;
        var cost = baseCost;
        var expCount = currentLevel;
        while (expCount > 0) {
            cost := cost * 2;
            expCount -= 1;
        };

        // H10: Doka balance is per-principal, not per-character.
        let callerDokaUpgrade = switch (dokaBalances.get(caller)) {
            case null { 0 };
            case (?b) { b };
        };
        if (callerDokaUpgrade < cost) {
            return #err("Not enough Doka. Need " # debug_show(cost) # ", have " # debug_show(callerDokaUpgrade));
        };

        let newLevel = currentLevel + 1;

        let newKeys : [Text] = if (found) {
            character.spellLevelKeys
        } else {
            character.spellLevelKeys.concat([spellId])
        };
        let newValues : [Nat] = if (found) {
            var vi : Nat = 0;
            character.spellLevelValues.map(func(v : Nat) : Nat {
                let result = if (vi < character.spellLevelKeys.size() and character.spellLevelKeys[vi] == spellId) { newLevel } else { v };
                vi += 1;
                result
            })
        } else {
            character.spellLevelValues.concat([newLevel])
        };

        let updatedCharacter : Character = {
            character with
            spellLevelKeys   = newKeys;
            spellLevelValues = newValues;
        };

        let updatedSlots = switch (slot) {
            case 1 { { existingSlots with slot1 = ?updatedCharacter } };
            case 2 { { existingSlots with slot2 = ?updatedCharacter } };
            case 3 { { existingSlots with slot3 = ?updatedCharacter } };
            case _ { existingSlots };
        };
        characterSlots.add(caller, updatedSlots);
        // Deduct from per-principal Doka balance.
        dokaBalances.add(caller, callerDokaUpgrade - cost);
        #ok(newLevel);
    };

    // ─── Shop packages ─────────────────────────────────────────────────
    let shopPackages = Map.empty<Text, AdminTypes.ShopPackage>();

    // Seed default packages on first run.
    do {
        if (shopPackages.size() == 0) {
            for (pkg in AdminLib.defaultShopPackages().values()) {
                shopPackages.add(pkg.id, pkg);
            };
        };
    };

    /// Admin: create or update a shop package (set payment link etc.).
    public shared ({ caller }) func adminSetShopPackage(pkg : AdminTypes.ShopPackage) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        shopPackages.add(pkg.id, pkg);
        #ok;
    };

    /// Admin: delete a shop package.
    public shared ({ caller }) func adminDeleteShopPackage(id : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        shopPackages.remove(id);
        #ok;
    };

    /// Public: list all shop packages sorted by displayOrder.
    public query func getShopPackages() : async [AdminTypes.ShopPackage] {
        let arr = shopPackages.values().toArray();
        arr.sort(func(a : AdminTypes.ShopPackage, b : AdminTypes.ShopPackage) : { #less; #equal; #greater } {
            Nat.compare(a.displayOrder, b.displayOrder)
        })
    };

    // ─── Achievement configs ────────────────────────────────────────────
    let achievementConfigs = Map.empty<Text, AdminTypes.AchievementConfig>();

    // Seed default achievements on first run.
    do {
        if (achievementConfigs.size() == 0) {
            for (ach in AdminLib.defaultAchievements().values()) {
                achievementConfigs.add(ach.id, ach);
            };
        };
    };

    /// Per-player progress keyed by "principalText#achievementId".
    let achievementProgress = Map.empty<Text, AdminTypes.AchievementProgress>();

    // ─── Purchase records ──────────────────────────────────────────────
    // M7: purchaseRecords is a Map<Text, PurchaseRecord> — O(log n) lookup by id.
    // L3: nextPurchaseId is Nat (unbounded in Motoko); overflow is theoretical at
    //     2^128+ iterations; no practical cap needed but documented here.
    let purchaseRecords = Map.empty<Text, AdminTypes.PurchaseRecord>();
    var nextPurchaseId  : Nat = 0;

    /// Banned principals cannot play until unbanned.
    let bannedPrincipals = Map.empty<Text, Bool>();

    /// Player initiates a purchase — creates a pending record.
    /// Returns the purchase id so the frontend can track it.
    /// H5: Accepts all customer fields including proofFileUrl.
    public shared ({ caller }) func initiatePurchase(
        packageId       : Text,
        customerName    : Text,
        customerSurname : Text,
        customerEmail   : Text,
        customerAddress : Text,
        customerCity    : Text,
        customerCountry : Text,
        customerPostal  : Text,
        proofFileUrl    : Text,
    ) : async { #ok : Text; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            return #err("Unauthorized: must be logged in");
        };
        if (bannedPrincipals.containsKey(caller.toText())) {
            return #err("Account banned for non-payment");
        };
        let pkg = switch (shopPackages.get(packageId)) {
            case null { return #err("Unknown package: " # packageId) };
            case (?p) { p };
        };
        // B4: rollover guard — wrap counter at 999_999_999 to prevent integer overflow
        //     on long-running canisters.
        nextPurchaseId += 1;
        if (nextPurchaseId > 999_999_999) {
            nextPurchaseId := 1;
        };
        let id = "pur_" # nextPurchaseId.toText();
        let record : AdminTypes.PurchaseRecord = {
            id;
            userPrincipal   = caller;
            dokaAmount      = pkg.dokaAmount;
            packageId;
            customerName;
            customerSurname;
            customerEmail;
            customerAddress;
            customerCity;
            customerCountry;
            customerPostal;
            proofFileUrl;
            timestamp       = Time.now();
            status          = "pending";
        };
        purchaseRecords.add(id, record);
        #ok(id);
    };

    /// Returns the caller's purchase history.
    public query ({ caller }) func getMyPurchaseHistory() : async [AdminTypes.PurchaseRecord] {
        purchaseRecords.values().filter(func(r : AdminTypes.PurchaseRecord) : Bool {
            r.userPrincipal == caller
        }).toArray()
    };
    /// Public: returns all purchase records (admin-only; use adminGetPurchaseRecords for filtered access).
    public query ({ caller }) func getPurchases() : async { #ok : [AdminTypes.PurchaseRecord]; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        #ok(purchaseRecords.values().toArray());
    };


    /// Returns whether the caller's account is banned.
    public query ({ caller }) func checkAccountStatus() : async { isBanned : Bool } {
        { isBanned = bannedPrincipals.containsKey(caller.toText()) };
    };

    /// Admin: get all purchase records, optionally filtered by principal text.
    public shared ({ caller }) func adminGetPurchaseRecords(filterPrincipal : ?Text) : async { #ok : [AdminTypes.PurchaseRecord]; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        let records = switch (filterPrincipal) {
            case null { purchaseRecords.values().toArray() };
            case (?pt) {
                purchaseRecords.values().filter(func(r : AdminTypes.PurchaseRecord) : Bool {
                    r.userPrincipal.toText() == pt
                }).toArray()
            };
        };
        #ok(records);
    };

    /// Admin: manually credit Doka to a principal and optionally mark a purchase as completed.
    public shared ({ caller }) func adminAddDokaToUser(
        userPrincipal : Principal,
        dokaAmount    : Nat,
        purchaseId    : ?Text,
    ) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        let current = switch (dokaBalances.get(userPrincipal)) {
            case null { 0 };
            case (?b) { b };
        };
        dokaBalances.add(userPrincipal, current + dokaAmount);
        switch (purchaseId) {
            case null {};
            case (?pid) {
                switch (purchaseRecords.get(pid)) {
                    case null {};
                    case (?rec) {
                        purchaseRecords.add(pid, { rec with status = "completed" });
                    };
                };
            };
        };
        #ok;
    };

    /// Admin: ban a principal for non-payment.
    /// M2: also clears achievement progress so banned players cannot double-claim
    ///     Doka rewards after being unbanned.
    public shared ({ caller }) func adminBanAccount(userPrincipal : Principal) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        bannedPrincipals.add(userPrincipal.toText(), true);
        // Clear achievement progress to prevent double-claiming on unban.
        let prefix = userPrincipal.toText() # "#";
        let toRemove = achievementProgress.keys().filter(func(k : Text) : Bool {
            k.startsWith(#text prefix)
        }).toArray();
        for (k in toRemove.values()) {
            achievementProgress.remove(k);
        };
        #ok;
    };

    /// Admin: grant Doka to a principal by text ID (used by shop admin panel).
    /// Alias for adminAddDoka; named adminGrantDoka to match the frontend's expected method name.
    public shared ({ caller }) func adminGrantDoka(targetPrincipal : Principal, amount : Nat) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        let current = switch (dokaBalances.get(targetPrincipal)) {
            case null { 0 };
            case (?b) { b };
        };
        dokaBalances.add(targetPrincipal, current + amount);
        #ok;
    };

    /// Admin: ban a principal (simple alias matching the frontend's expected method name).
    public shared ({ caller }) func banPrincipal(targetPrincipal : Principal) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        bannedPrincipals.add(targetPrincipal.toText(), true);
        #ok;
    };

    /// Admin: unban a principal (simple alias matching the frontend's expected method name).
    public shared ({ caller }) func unbanPrincipal(targetPrincipal : Principal) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        bannedPrincipals.remove(targetPrincipal.toText());
        #ok;
    };

    /// Admin query: returns the list of all currently banned principals.
    public query ({ caller }) func getBannedPrincipals() : async { #ok : [Principal]; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        let texts = bannedPrincipals.keys().toArray();
        let principals = texts.map(func(t) {
            Principal.fromText(t)
        });
        #ok(principals);
    };

    /// Admin: unban a principal.
    public shared ({ caller }) func adminUnbanAccount(userPrincipal : Principal) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        bannedPrincipals.remove(userPrincipal.toText());
        #ok;
    };

    /// Auto-complete any pending purchases older than 60 seconds and credit Doka.
    func _autoCompletePendingPurchases(forPrincipal : Principal) {
        let sixtySecondsNs : Int = 60_000_000_000;
        let now = Time.now();
        let pending = purchaseRecords.values().filter(func(r : AdminTypes.PurchaseRecord) : Bool {
            r.userPrincipal == forPrincipal and
            r.status == "pending" and
            (now - r.timestamp) >= sixtySecondsNs
        }).toArray();
        for (rec in pending.values()) {
            purchaseRecords.add(rec.id, { rec with status = "completed" });
            let current = switch (dokaBalances.get(rec.userPrincipal)) {
                case null { 0 };
                case (?b) { b };
            };
            dokaBalances.add(rec.userPrincipal, current + rec.dokaAmount);
        };
    };

    /// Player calls this to trigger auto-completion of their pending purchases.
    public shared ({ caller }) func processPendingPurchases() : async Nat {
        if (bannedPrincipals.containsKey(caller.toText())) {
            return 0;
        };
        _autoCompletePendingPurchases(caller);
        purchaseRecords.values().filter(func(r : AdminTypes.PurchaseRecord) : Bool {
            r.userPrincipal == caller and r.status == "completed"
        }).toArray().size()
    };


    // ─── Game config (singleton, admin-editable) ──────────────────────

    var gameConfig : AdminTypes.AdminGameConfig = AdminLib.defaultGameConfig();

    public shared ({ caller }) func adminSetGameConfig(config : AdminTypes.AdminGameConfig) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        if (config.dokaSpawnChance > 100) {
            return #err("dokaSpawnChance must be between 0 and 100");
        };
        gameConfig := config;
        #ok;
    };

    public query func getGameConfig() : async AdminTypes.AdminGameConfig {
        gameConfig;
    };

    // ─── Tier spawn config (singleton, admin-editable) ──────────────────

    var tierSpawnConfig : AdminTypes.TierSpawnConfig = {
        tierSize            = 10;
        sameTierPercent     = 60.0;
        adjacentTierPercent = 20.0;
        twoAwayPercent      = 10.0;
        threeOrMorePercent  = 5.0;
    };

    public shared ({ caller }) func adminSetTierSpawnConfig(config : AdminTypes.TierSpawnConfig) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        tierSpawnConfig := config;
        #ok;
    };

    public query func getTierSpawnConfig() : async AdminTypes.TierSpawnConfig {
        tierSpawnConfig;
    };

    // ─── Color palette config (singleton, admin-editable) ───────────────
    // Stored as a JSON string for full flexibility — frontend serialises/
    // deserialises the palette object. Empty string = no admin override.

    var colorPaletteStore : Text = "";

    public shared ({ caller }) func adminSetColorPalette(palettes : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        colorPaletteStore := palettes;
        #ok;
    };

    public query func getColorPalette() : async Text {
        colorPaletteStore;
    };

    // ─── Boss Rush admin config (singleton, admin-editable) ──────────────
    // Stored as a JSON string mirroring the frontend BossRushConfig shape.
    // Empty string = use frontend defaults.

    var bossRushConfigStore : Text = "";

    public shared ({ caller }) func adminSetBossRushConfig(config : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        bossRushConfigStore := config;
        #ok;
    };

    public query func getBossRushConfig() : async Text {
        bossRushConfigStore;
    };

    /// Rename a character in the given slot. Costs 100 Doka from the character's balance.
    public shared ({ caller }) func renameCharacter(slot : Nat, newName : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            return #err("Unauthorized: must be logged in");
        };
        if (slot < 1 or slot > 3) {
            return #err("Invalid slot number");
        };
        if (newName.size() == 0 or newName.size() > 20) {
            return #err("Name must be 1-20 characters");
        };

        let existingSlots = switch (characterSlots.get(caller)) {
            case null { return #err("No characters found") };
            case (?s) { s };
        };

        // B3: Duplicate name check — no two characters in the same account can share a name.
        let nameLower = newName;
        switch (existingSlots.slot1) {
            case (?c) { if (c.name == nameLower) { return #err("Name already in use") } };
            case null {};
        };
        switch (existingSlots.slot2) {
            case (?c) { if (c.name == nameLower) { return #err("Name already in use") } };
            case null {};
        };
        switch (existingSlots.slot3) {
            case (?c) { if (c.name == nameLower) { return #err("Name already in use") } };
            case null {};
        };

        let character = switch (slot) {
            case 1 { switch (existingSlots.slot1) { case null { return #err("Slot 1 is empty") }; case (?c) { c } } };
            case 2 { switch (existingSlots.slot2) { case null { return #err("Slot 2 is empty") }; case (?c) { c } } };
            case 3 { switch (existingSlots.slot3) { case null { return #err("Slot 3 is empty") }; case (?c) { c } } };
            case _ { return #err("Invalid slot") };
        };

        let renameCost : Nat = 100;
        // H10: Doka balance is per-principal, not per-character.
        let callerDokaRename = switch (dokaBalances.get(caller)) {
            case null { 0 };
            case (?b) { b };
        };
        if (callerDokaRename < renameCost) {
            return #err("Not enough Doka. Need 100, have " # callerDokaRename.toText());
        };

        let updatedCharacter : Character = { character with name = newName };

        let updatedSlots = switch (slot) {
            case 1 { { existingSlots with slot1 = ?updatedCharacter } };
            case 2 { { existingSlots with slot2 = ?updatedCharacter } };
            case 3 { { existingSlots with slot3 = ?updatedCharacter } };
            case _ { existingSlots };
        };
        characterSlots.add(caller, updatedSlots);
        // Deduct from per-principal Doka balance.
        dokaBalances.add(caller, callerDokaRename - renameCost);
        #ok;
    };

    /// Set the player-arranged spell bar order for the character in the given slot.
    /// FILTERS out any id not owned by the character (not in spellLevelKeys) and
    /// persists the remaining ids into spellBarOrder. The spell bar is a UI
    /// preference, not an authorization surface, so unknown ids are dropped
    /// rather than rejecting the whole save. Keeps the slot 1-3 guard and the
    /// max-8 cap as structural validation.
    public shared ({ caller }) func setSpellBarOrder(slot : Nat, spellIds : [Text]) : async { #ok; #err : Text } {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            return #err("Unauthorized: must be logged in");
        };
        if (slot < 1 or slot > 3) {
            return #err("Invalid slot number");
        };
        if (spellIds.size() > 8) {
            return #err("spellIds exceeds maximum of 8 entries");
        };

        let existingSlots = switch (characterSlots.get(caller)) {
            case null { return #err("No characters found") };
            case (?s) { s };
        };

        let character = switch (slot) {
            case 1 { switch (existingSlots.slot1) { case null { return #err("Slot 1 is empty") }; case (?c) { c } } };
            case 2 { switch (existingSlots.slot2) { case null { return #err("Slot 2 is empty") }; case (?c) { c } } };
            case 3 { switch (existingSlots.slot3) { case null { return #err("Slot 3 is empty") }; case (?c) { c } } };
            case _ { return #err("Invalid slot") };
        };

        // FILTER unknown ids and save the rest. The spell bar is a UI
        // preference, not an authorization surface — strict rejection belongs
        // to gameplay actions (casting/learning), not bar layout. spellLevelKeys
        // is only populated at upgradeSpell/createCharacter/saveBattleStats, so
        // for characters whose frontend never seeded the starter/spell catalog
        // ids, an unfiltered save would reject the whole bar. Filtering fixes
        // this for all existing characters without a migration.
        let filtered : [Text] = spellIds.filter(
            func(id : Text) : Bool { character.spellLevelKeys.contains(id) },
        );

        let updatedCharacter : Character = { character with spellBarOrder = ?filtered };

        let updatedSlots = switch (slot) {
            case 1 { { existingSlots with slot1 = ?updatedCharacter } };
            case 2 { { existingSlots with slot2 = ?updatedCharacter } };
            case 3 { { existingSlots with slot3 = ?updatedCharacter } };
            case _ { existingSlots };
        };
        characterSlots.add(caller, updatedSlots);
        #ok;
    };

    /// Debug query: returns raw slot data as text for diagnosing serialization issues.
    public query ({ caller }) func diagnoseCharacterSlots() : async Text {
        switch (characterSlots.get(caller)) {
            case null { "No slots found for caller" };
            case (?slots) {
                let s1 = switch (slots.slot1) {
                    case null { "slot1=empty" };
                    case (?c) { "slot1=" # c.name # " lvl:" # c.level.toText() # " colors:" # debug_show(c.colors) };
                };
                let s2 = switch (slots.slot2) {
                    case null { "slot2=empty" };
                    case (?c) { "slot2=" # c.name # " lvl:" # c.level.toText() # " colors:" # debug_show(c.colors) };
                };
                let s3 = switch (slots.slot3) {
                    case null { "slot3=empty" };
                    case (?c) { "slot3=" # c.name # " lvl:" # c.level.toText() # " colors:" # debug_show(c.colors) };
                };
                s1 # " | " # s2 # " | " # s3
            };
        };
    };

    // ─── Battle stats persistence ──────────────────────────────────────

    /// Save all battle-relevant stats back to a character slot after a battle.
    /// hp may arrive as negative (character was knocked out); it is clamped to 0 before storage.
    /// C1: dokaBalance parameter is intentionally ignored — Doka is tracked in the
    ///     per-principal dokaBalances Map only. The dokaBalance field no longer exists
    ///     on the Character type.
    public shared ({ caller }) func saveBattleStats(
        slot             : Nat,
        level            : Nat,
        xp               : Nat,
        hp               : Int,
        _maxHp           : Nat,
        _ap              : Nat,
        maxAp            : Nat,
        _mp              : Nat,
        maxMp            : Nat,
        attack           : Nat,
        defense          : Nat,
        initiative       : Nat,
        dokaBalance      : Nat,   // kept in signature for frontend compat; stored in dokaBalances map
        spellLevelKeys   : [Text],
        spellLevelValues : [Nat],
    ) : async { #ok; #err : Text } {
        if (bannedPrincipals.containsKey(caller.toText())) {
            return #err("Account banned for non-payment");
        };
        if (slot < 1 or slot > 3) {
            return #err("Invalid slot number");
        };

        let existingSlots = switch (characterSlots.get(caller)) {
            case null { return #err("No characters found for user") };
            case (?s) { s };
        };

        let character = switch (slot) {
            case 1 { switch (existingSlots.slot1) { case null { return #err("Slot 1 is empty") }; case (?c) { c } } };
            case 2 { switch (existingSlots.slot2) { case null { return #err("Slot 2 is empty") }; case (?c) { c } } };
            case 3 { switch (existingSlots.slot3) { case null { return #err("Slot 3 is empty") }; case (?c) { c } } };
            case _ { return #err("Invalid slot") };
        };

        // Clamp hp to 0 — CharacterStats.hp is Nat.
        let safeHp : Nat = if (hp <= 0) { 0 } else { hp.toNat() };

        let updatedStats : CharacterStats = {
            character.stats with
            hp   = safeHp;
            ap   = maxAp;
            mp   = maxMp;
            atk  = attack;
            res  = defense;
            init = initiative;
        };

        let updatedCharacter : Character = {
            character with
            level            = level;
            experience       = xp;
            stats            = updatedStats;
            spellLevelKeys   = spellLevelKeys;
            spellLevelValues = spellLevelValues;
        };

        let updatedSlots = switch (slot) {
            case 1 { { existingSlots with slot1 = ?updatedCharacter } };
            case 2 { { existingSlots with slot2 = ?updatedCharacter } };
            case 3 { { existingSlots with slot3 = ?updatedCharacter } };
            case _ { existingSlots };
        };
        characterSlots.add(caller, updatedSlots);
        // C1: persist dokaBalance to per-principal store (single source of truth).
        dokaBalances.add(caller, dokaBalance);
        #ok;
    };

    public shared ({ caller }) func applyRewards(slot : Nat, dokaDelta : Nat, xpDelta : Nat) : async { #ok : { newDoka : Nat; newXp : Nat; newLevel : Nat }; #err : Text } {
      if (caller.isAnonymous()) { return #err "Anonymous caller" };
      if (bannedPrincipals.containsKey(caller.toText())) { return #err "Account banned" };
      let charSlots = switch (characterSlots.get(caller)) { case (?cs) { cs }; case null { return #err "No characters" } };
      let characterOpt = switch (slot) { case 1 { charSlots.slot1 }; case 2 { charSlots.slot2 }; case 3 { charSlots.slot3 }; case _ { return #err "Invalid slot" } };
      let character = switch (characterOpt) { case (?c) { c }; case null { return #err "Empty slot" } };
      var newXp = character.experience + xpDelta;
      var newLevel = character.level;
      func pow2(n : Nat) : Nat { var r = 1; var i = 0; while (i < n) { r *= 2; i += 1 }; r };
      label lvlLoop while (true) {
        let xpToNext = 100 * pow2(newLevel);
        if (newXp < xpToNext) { break lvlLoop };
        newXp -= xpToNext;
        newLevel += 1;
      };
      let updatedChar = { character with experience = newXp; level = newLevel };
      let newSlots = switch (slot) {
        case 1 { { charSlots with slot1 = ?updatedChar } };
        case 2 { { charSlots with slot2 = ?updatedChar } };
        case 3 { { charSlots with slot3 = ?updatedChar } };
        case _ { charSlots };
      };
      characterSlots.add(caller, newSlots);
      let currentDoka = switch (dokaBalances.get(caller)) { case (?d) { d }; case null { 0 } };
      let newDoka = currentDoka + dokaDelta;
      dokaBalances.add(caller, newDoka);
      #ok({ newDoka = newDoka; newXp = newXp; newLevel = newLevel })
    };

    /// Retrieve the full Character record for a given slot.
    public query ({ caller }) func getCharacterStats(slot : Nat) : async { #ok : Character; #err : Text } {
        if (slot < 1 or slot > 3) {
            return #err("Invalid slot number");
        };

        let slots = switch (characterSlots.get(caller)) {
            case null { return #err("No characters found for user") };
            case (?s) { s };
        };

        let character = switch (slot) {
            case 1 { slots.slot1 };
            case 2 { slots.slot2 };
            case 3 { slots.slot3 };
            case _ { null };
        };

        switch (character) {
            case null { #err("Slot " # debug_show(slot) # " is empty") };
            case (?c) { #ok(c) };
        };
    };

    // ─── App version tracking ──────────────────────────────────────────

    /// Current app version string, set by admin (e.g. "v161").
    var appVersion : Text = "v163";

    /// Changelog entries keyed by version string.
    let changelogs = Map.empty<Text, Text>();

    /// Per-user record of the last changelog version they have already seen.
    let changelogShownVersions = Map.empty<Principal, Text>();

    // Seed the initial changelog for v163.
    do {
        if (changelogs.size() == 0) {
            changelogs.add(
                "v163",
                "v163 - Security: Internet Identity first-login admin system (first principal to log in becomes admin); " #
                "Doka unified into single per-principal store; " #
                "shop purchases record proof-of-address URL; " #
                "setShopPaymentLink / getShopPaymentLinks endpoints; " #
                "isPlayerBanned query; adminAddDoka convenience function."
            );
        };
    };

    // ─── Payment link convenience endpoints ──────────────────────────────────

    /// Admin: set the payment URL for a specific shop package by dokaAmount.
    public shared ({ caller }) func setShopPaymentLink(dokaAmount : Nat, url : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        var found = false;
        for ((id, pkg) in shopPackages.entries()) {
            if (pkg.dokaAmount == dokaAmount) {
                shopPackages.add(id, { pkg with paymentLink = url });
                found := true;
            };
        };
        if (not found) {
            return #err("No package found with dokaAmount = " # dokaAmount.toText());
        };
        #ok;
    };

    /// Public: returns all (dokaAmount, paymentLink) pairs.
    public query func getShopPaymentLinks() : async [(Nat, Text)] {
        shopPackages.values().map(func(pkg) {
            (pkg.dokaAmount, pkg.paymentLink)
        }).toArray()
    };

    // ─── Ban / unban player ───────────────────────────────────────────────────

    /// Admin: ban a player with a reason (convenience alias for adminBanAccount with reason).
    /// M2: also clears achievement progress so banned players cannot double-claim on unban.
    public shared ({ caller }) func banPlayer(userPrincipal : Principal, reason : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        bannedPrincipals.add(userPrincipal.toText(), true);
        // Store the ban reason in the changelogs map reusing as a reason store.
        changelogs.add("ban#" # userPrincipal.toText(), reason);
        // Clear achievement progress to prevent double-claiming on unban.
        let prefix2 = userPrincipal.toText() # "#";
        let toRemove2 = achievementProgress.keys().filter(func(k : Text) : Bool {
            k.startsWith(#text prefix2)
        }).toArray();
        for (k in toRemove2.values()) {
            achievementProgress.remove(k);
        };
        #ok;
    };

    /// Admin: unban a player account.
    public shared ({ caller }) func unbanPlayer(userPrincipal : Principal) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        bannedPrincipals.remove(userPrincipal.toText());
        changelogs.remove("ban#" # userPrincipal.toText());
        #ok;
    };

    /// Public query: returns whether a given principal is banned.
    public query func isPlayerBanned(userPrincipal : Principal) : async Bool {
        bannedPrincipals.containsKey(userPrincipal.toText());
    };

    /// Admin: add Doka to any account (used by shop admin panel to manually credit Doka).
    public shared ({ caller }) func adminAddDoka(userPrincipal : Principal, amount : Nat) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        let current = switch (dokaBalances.get(userPrincipal)) {
            case null { 0 };
            case (?b) { b };
        };
        dokaBalances.add(userPrincipal, current + amount);
        #ok;
    };
    /// Admin: get the Doka balance of any account.
    public query ({ caller }) func adminGetDoka(userPrincipal : Principal) : async { #ok : Nat; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        let bal = switch (dokaBalances.get(userPrincipal)) {
            case null { 0 };
            case (?b) { b };
        };
        #ok(bal);
    };


    /// Returns the current app version string.
    public query func getAppVersion() : async Text {
        appVersion;
    };

    /// Admin-only: sets the current app version string.
    public shared ({ caller }) func setAppVersion(version : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        appVersion := version;
        #ok;
    };

    /// Returns the changelog text for a given version (null if not set).
    public query func getChangelog(version : Text) : async ?Text {
        changelogs.get(version);
    };

    /// Admin-only: sets the changelog text for a given version.
    public shared ({ caller }) func setChangelog(version : Text, text : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        changelogs.add(version, text);
        #ok;
    };

    /// Returns the version string of the changelog the given user has already seen.
    /// Empty string means the user has not seen any changelog yet.
    public query func getChangelogShownVersion(user : Principal) : async Text {
        switch (changelogShownVersions.get(user)) {
            case null { "" };
            case (?v) { v };
        };
    };

    /// Called by the frontend after the player dismisses the changelog popup.
    /// Records that the caller has seen the changelog for the given version.
    public shared ({ caller }) func markChangelogShown(version : Text) : async () {
        changelogShownVersions.add(caller, version);
    };

    // ─── Achievement API ─────────────────────────────────────────────────

    /// Admin: create or update an achievement configuration.
    public shared ({ caller }) func adminSetAchievementConfig(config : AdminTypes.AchievementConfig) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        achievementConfigs.add(config.id, config);
        #ok;
    };

    /// Admin: delete an achievement configuration.
    public shared ({ caller }) func adminDeleteAchievementConfig(id : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        achievementConfigs.remove(id);
        #ok;
    };

    /// Public: list all achievement configs (used by frontend to render the achievements panel).
    public query func getAchievementConfigs() : async [AdminTypes.AchievementConfig] {
        achievementConfigs.values().toArray();
    };

    /// Public: return the achievement progress records for the given principal.
    public query ({ caller }) func getPlayerAchievements(player : Principal) : async [AdminTypes.AchievementProgress] {
        if (caller != player) {
            return [];
        };
        let principalText = player.toText();
        achievementProgress.values()
          .filter(func(v : AdminTypes.AchievementProgress) : Bool { v.principalId == principalText })
          .toArray();
    };

    /// Player: mark an achievement as unlocked (called by the frontend when the condition is met).
    /// Idempotent — calling again on an already-unlocked achievement is a no-op.
    public shared ({ caller }) func markAchievementUnlocked(achievementId : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            return #err("Unauthorized: must be logged in");
        };
        if (bannedPrincipals.containsKey(caller.toText())) {
            return #err("Account banned for non-payment");
        };
        switch (achievementConfigs.get(achievementId)) {
            case null { return #err("Unknown achievement: " # achievementId) };
            case (?_) {};
        };
        let key = caller.toText() # "#" # achievementId;
        switch (achievementProgress.get(key)) {
            case (?existing) {
                if (existing.unlocked) { return #ok }; // already unlocked, idempotent
                achievementProgress.add(key, { existing with unlocked = true; unlockedAt = Time.now() });
            };
            case null {
                achievementProgress.add(key, {
                    principalId   = caller.toText();
                    achievementId;
                    unlocked      = true;
                    unlockedAt    = Time.now();
                    claimed       = false;
                });
            };
        };
        #ok;
    };

    /// Player: claim the Doka reward for a completed achievement.
    /// Checks: achievement must be unlocked for this player AND not already claimed.
    /// On success, adds dokaReward to the caller's dokaBalances entry and marks as claimed.
    public shared ({ caller }) func claimAchievementReward(achievementId : Text) : async { #ok : Nat; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            return #err("Unauthorized: must be logged in");
        };
        if (bannedPrincipals.containsKey(caller.toText())) {
            return #err("Account banned for non-payment");
        };
        let config = switch (achievementConfigs.get(achievementId)) {
            case null { return #err("Unknown achievement: " # achievementId) };
            case (?c) { c };
        };
        let key = caller.toText() # "#" # achievementId;
        let progress = switch (achievementProgress.get(key)) {
            case null { return #err("Achievement not yet unlocked") };
            case (?p) { p };
        };
        if (not progress.unlocked) {
            return #err("Achievement not yet unlocked");
        };
        if (progress.claimed) {
            return #err("Reward already claimed");
        };
        // Mark as claimed.
        achievementProgress.add(key, { progress with claimed = true });
        // Credit Doka to the principal-level balance.
        let current = switch (dokaBalances.get(caller)) {
            case null { 0 };
            case (?b) { b };
        };
        dokaBalances.add(caller, current + config.dokaReward);
        #ok(config.dokaReward);
    };

    // ─── Role check / first-login-becomes-admin ─────────────────────────

    /// Returns "admin" if the caller has admin permission, otherwise "user".
    /// Triggers first-login admin auto-assignment: the very first principal
    /// to call this becomes admin.
    public shared ({ caller }) func getUserRole() : async Text {
        _ensureRegistered(caller);
        if (AccessControl.isAdmin(accessControlState, caller)) {
            "admin"
        } else {
            "user"
        };
    };

    /// Admin-only: assign a role to another principal.
    /// M1: rate-limited — the same caller cannot change roles more than once per 30 s.
    public shared ({ caller }) func assignUserRole(target : Principal, role : Text) : async { #ok; #err : Text } {
        _ensureRegistered(caller);
        if (not AccessControl.isAdmin(accessControlState, caller)) {
            return #err("Unauthorized: admin only");
        };
        // M1: rate limit
        let callerKey = caller.toText();
        let now = Time.now();
        switch (roleChangeTimestamps.get(callerKey)) {
            case (?last) {
                if (now - last < ROLE_CHANGE_MIN_NS) {
                    return #err("Rate limit: wait 30 seconds between role changes");
                };
            };
            case null {};
        };
        roleChangeTimestamps.add(callerKey, now);
        let resolvedRole : AccessControl.UserRole = if (role == "admin") { #admin } else { #user };
        AccessControl.assignRole(accessControlState, caller, target, resolvedRole);
        #ok;
    };

    /// Public query: returns the Doka balance for the caller (H1, H5).
    public query ({ caller }) func getCallerDokaBalance() : async Nat {
        switch (dokaBalances.get(caller)) {
            case null { 0 };
            case (?b) { b };
        };
    };



    type ChatMessage = {
        id          : Nat;
        playerName  : Text;
        text        : Text;
        timestampMs : Int;
        colorHex    : Text;
    };

    /// In-memory only — intentionally clears on canister upgrade.
    var chatMessages : List.List<ChatMessage> = List.empty();
    var nextChatId   : Nat = 0;

    /// Append a new message; trims list to at most 200 entries (oldest dropped).
    public shared func sendMessage(playerName : Text, text : Text, colorHex : Text) : async () {
        let msg : ChatMessage = {
            id          = nextChatId;
            playerName;
            text;
            timestampMs = Time.now() / 1_000_000;  // ns → ms
            colorHex;
        };
        nextChatId += 1;
        chatMessages.add(msg);
        // Trim to the newest 200 messages when over the cap.
        let sz = chatMessages.size();
        if (sz > 200) {
            let kept = chatMessages.sliceToArray(sz - 200, sz);
            chatMessages := List.fromArray(kept);
        };
    };

    /// Returns all current chat messages (oldest first).
    public query func getMessages() : async [ChatMessage] {
        chatMessages.toArray();
    };

    // ─── Enemy names pool ─────────────────────────────────────────────────────

    /// Admin-managed pool of ancient names used for enemy naming.
    /// Each enemy on a map gets at most one unique name drawn from this list.
    var enemyNames : List.List<Text> = List.empty();
    var enemyNamesInitialised : Bool = false;

    /// Pre-filled list of 90 ancient names from various cultures.
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

    /// Seed the names list on first call if it is empty.
    public shared func initDefaultNames() : async () {
        // Upsert: add each default name only if not already present.
        // Does NOT use the flag guard so new names are always seeded on upgraded canisters.
        for (n in DEFAULT_ENEMY_NAMES.values()) {
            let alreadyExists = switch (enemyNames.find(func(existing : Text) : Bool { existing == n })) {
                case (?_) { true };
                case (null) { false };
            };
            if (not alreadyExists) {
                enemyNames.add(n);
            };
        };
    };

    /// Returns the current list of admin-managed enemy names.
    /// When the stored list is empty the canonical ancient names default list
    /// is returned so enemies are never named “AncientOne” by fallback.
    public query func getEnemyNames() : async [Text] {
        if (enemyNames.size() == 0) {
            // Return the curated ancient names default list.
            return [
                "Malachar", "Vorenth", "Aethys", "Zarvok", "Kethara",
                "Duskwyn", "Voraxis", "Nythera", "Valdrek", "Seramis",
                "Thornvex", "Golvak", "Draveth", "Sythion", "Kaelthar",
                "Norrax", "Veluun", "Drathis", "Xarveth", "Orvael",
                "Tyranos", "Belkoth", "Senvaris",
                "Dusk Warden", "Grim Noctis", "Pale Archon", "Shade Counsel",
                "Void Scion", "Ebon Rift", "Ashen Crown",
                "Mal Arath", "Vel Sharas", "Keth Dorn", "Nox Verath",
                "Drak Solun", "Vael Morn", "Sar Thax", "Zyth Vel",
                "Kor Nael", "Dusk Vareth",
            ];
        };
        enemyNames.toArray();
    };

    /// Adds a new name to the pool (admin only).
    public shared ({ caller }) func addEnemyName(name : Text) : async () {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            Runtime.trap("Unauthorized: admin only");
        };
        if (name == "") { Runtime.trap("Name cannot be empty") };
        enemyNames.add(name);
    };

    /// Removes a name from the pool by value (admin only).
    public shared ({ caller }) func deleteEnemyName(name : Text) : async () {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            Runtime.trap("Unauthorized: admin only");
        };
        let filtered = enemyNames.toArray().filter(func(n) { n != name });
        enemyNames := List.fromArray(filtered);
    };

    // ─── Buff shop inventory ───────────────────────────────────────────────

    /// Per-principal buff inventories (keyed by principal, stores array of items per slot).
    /// Layout: principalText#slot → BuffInventory
    let buffInventories = Map.empty<Text, AdminTypes.BuffInventory>();

    /// Hardcoded buff item catalog.
    /// itemId → (name, dokaCost)
    let BUFF_CATALOG : [(Text, Text, Nat)] = [
        ("health_potion",   "Health Potion",   50),
        ("greater_potion",  "Greater Potion",  120),
        ("battle_elixir",   "Battle Elixir",   200),
        ("swift_boots",     "Swift Boots",     80),
        ("shield_charm",    "Shield Charm",    150),
        ("fury_potion",     "Fury Potion",     100),
    ];

    /// Returns the cost of a buff item, or null if unknown.
    func _buffItemCost(itemId : Text) : ?Nat {
        var found : ?Nat = null;
        for ((id, _name, cost) in BUFF_CATALOG.values()) {
            if (id == itemId) { found := ?cost };
        };
        found;
    };

    /// Returns the buff inventory key for a caller + slot.
    func _buffKey(caller : Principal, slot : Nat) : Text {
        caller.toText() # "#" # slot.toText()
    };

    /// Public: list all available buff items (itemId, name, dokaCost).
    public query func getBuffCatalog() : async [(Text, Text, Nat)] {
        BUFF_CATALOG;
    };

    /// Retrieve a character slot's buff inventory.
    public query ({ caller }) func getBuffInventory(slot : Nat) : async { #ok : AdminTypes.BuffInventory; #err : Text } {
        if (slot < 1 or slot > 3) { return #err("Invalid slot") };
        let inv = switch (buffInventories.get(_buffKey(caller, slot))) {
            case null { [] };
            case (?i) { i };
        };
        #ok(inv);
    };

    /// Purchase a buff item. Deducts Doka from caller's per-principal balance.
    public shared ({ caller }) func purchaseBuff(slot : Nat, itemId : Text) : async { #ok : AdminTypes.BuffInventory; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            return #err("Unauthorized: must be logged in");
        };
        if (bannedPrincipals.containsKey(caller.toText())) {
            return #err("Account banned for non-payment");
        };
        if (slot < 1 or slot > 3) { return #err("Invalid slot") };

        let cost = switch (_buffItemCost(itemId)) {
            case null { return #err("Unknown item: " # itemId) };
            case (?c) { c };
        };

        let callerDoka = switch (dokaBalances.get(caller)) {
            case null { 0 };
            case (?b) { b };
        };
        if (callerDoka < cost) {
            return #err("Not enough Doka. Need " # cost.toText() # ", have " # callerDoka.toText());
        };

        // Deduct Doka.
        dokaBalances.add(caller, callerDoka - cost);

        // Update inventory.
        let key = _buffKey(caller, slot);
        let existing : AdminTypes.BuffInventory = switch (buffInventories.get(key)) {
            case null { [] };
            case (?i) { i };
        };
        // Find existing entry for this itemId and increment quantity, or append a new entry.
        let existingEntry = existing.find(func(item : AdminTypes.BuffInventoryItem) : Bool {
            item.itemId == itemId
        });
        let newInv : AdminTypes.BuffInventory = switch (existingEntry) {
            case (?_) {
                existing.map(func(item) {
                    if (item.itemId == itemId) { { item with quantity = item.quantity + 1 } } else { item }
                })
            };
            case null {
                existing.concat([{ itemId; quantity = 1 }])
            };
        };
        buffInventories.add(key, newInv);
        #ok(newInv);
    };

    /// Use one of a buff item (removes one from inventory).
    public shared ({ caller }) func useBuffItem(slot : Nat, itemId : Text) : async { #ok : AdminTypes.BuffInventory; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            return #err("Unauthorized: must be logged in");
        };
        if (slot < 1 or slot > 3) { return #err("Invalid slot") };
        let key = _buffKey(caller, slot);
        let existing : AdminTypes.BuffInventory = switch (buffInventories.get(key)) {
            case null { return #err("Inventory empty") };
            case (?i) { i };
        };
        // Check that item exists before proceeding.
        let entry = existing.find(func(item : AdminTypes.BuffInventoryItem) : Bool {
            item.itemId == itemId
        });
        switch (entry) {
            case null { return #err("Item not in inventory: " # itemId) };
            case (?_) {};
        };
        // Decrement quantity; remove entry if it reaches 0.
        let newInv : AdminTypes.BuffInventory = existing.filterMap(func(item) {
            if (item.itemId == itemId) {
                if (item.quantity <= 1) { null } else { ?{ item with quantity = item.quantity - 1 } }
            } else { ?item }
        });
        buffInventories.add(key, newInv);
        #ok(newInv);
    };

    // ─── Dungeon chain records ────────────────────────────────────────────────

    let dungeonRecords = Map.empty<Principal, AdminTypes.DungeonRecord>();

    /// Returns a player's current dungeon chain record (null if never entered a dungeon).
    public query ({ caller }) func getDungeonRecord(principal : Principal) : async ?AdminTypes.DungeonRecord {
        if (caller != principal) {
            return null;
        };
        dungeonRecords.get(principal);
    };

    /// Update a player's dungeon progress (called by the frontend on each map completion).
    public shared ({ caller }) func updateDungeonProgress(principal : Principal, depth : Nat) : async () {
        // Only the principal themselves or admin may update.
        if (caller != principal and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            Runtime.trap("Unauthorized");
        };
        let existing = switch (dungeonRecords.get(principal)) {
            case null { { chainDepth = 0; totalMapsCompleted = 0; bestRewardMultiplier = 1.0 } };
            case (?r) { r };
        };
        let multiplier : Float = 1.0 + (depth.toFloat() * 0.25);
        let best = if (multiplier > existing.bestRewardMultiplier) { multiplier } else { existing.bestRewardMultiplier };
        dungeonRecords.add(principal, {
            chainDepth           = depth;
            totalMapsCompleted   = existing.totalMapsCompleted + 1;
            bestRewardMultiplier = best;
        });
    };

    /// Reset a player's dungeon chain (called on death or chain completion).
    public shared ({ caller }) func resetDungeonChain(principal : Principal) : async () {
        if (caller != principal and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            Runtime.trap("Unauthorized");
        };
        switch (dungeonRecords.get(principal)) {
            case null {};
            case (?r) {
                dungeonRecords.add(principal, { r with chainDepth = 0 });
            };
        };
    };

    // ─── Enemy HP formula helper ───────────────────────────────────────────

    /// Compute the base HP for an enemy of the given tier at the given player level,
    /// using the admin-configurable stat growth percent as the scaling factor.
    /// Formula: baseHP * (1 + (level * scalingFactor))
    /// where scalingFactor = levelUpConfig.statGrowthPercent / 100.0
    /// and baseHP is determined by tier: tier 1 = 30, +20 per additional tier.
    public query func getEnemyHPForLevel(enemyTier : Nat, level : Nat) : async Nat {
        let baseTierHP : Nat = 30 + (if (enemyTier > 1) { (enemyTier - 1) * 20 } else { 0 });
        let scalingFactor : Float = levelUpConfig.statGrowthPercent.toFloat() / 100.0;
        let scaled : Float = baseTierHP.toFloat() * (1.0 + (level.toFloat() * scalingFactor));
        // Convert back to Nat, truncating fractional part.
        let result : Int = scaled.toInt();
        if (result < 0) { 0 } else { result.toNat() }
    };

    // ─── Boss config system ─────────────────────────────────────────────────────────

    /// Stable store of boss configurations, keyed by boss id.
    let bossConfigs = Map.empty<Text, AdminTypes.BossConfig>();

    // Seed all 12 default bosses on the first initialization.
    do {
        if (bossConfigs.size() == 0) {
            for (boss in AdminLib.defaultBossConfigs().values()) {
                bossConfigs.add(boss.id, boss);
            };
        };
    };

    /// Stable store for boss portal assignments, keyed by portalId.
    let bossPortalAssignments = Map.empty<Text, Text>();  // portalId → bossId

    /// Admin: create or update a boss configuration.
    public shared ({ caller }) func setBossConfig(config : AdminTypes.BossConfig) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        if (config.id == "") {
            return #err("Boss id cannot be empty");
        };
        if (config.name == "") {
            return #err("Boss name cannot be empty");
        };
        if (config.baseStats.ap > 20) {
            return #err("baseStats.ap cannot exceed 20");
        };
        bossConfigs.add(config.id, config);
        #ok;
    };

    /// Admin: delete a boss configuration by id.
    public shared ({ caller }) func deleteBossConfig(id : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        bossConfigs.remove(id);
        #ok;
    };

    /// Public: returns all boss configs.
    public query func getAllBossConfigs() : async [AdminTypes.BossConfig] {
        bossConfigs.values().toArray();
    };

    /// Public: returns a single boss config by id (null if not found).
    public query func getBossConfig(id : Text) : async ?AdminTypes.BossConfig {
        bossConfigs.get(id);
    };

    /// Public: returns all (portalId, bossId) pairs for active boss portal assignments.
    public query func getBossPortalAssignments() : async [(Text, Text)] {
        bossPortalAssignments.entries().toArray();
    };

    /// Admin: assign a boss to a portal (or overwrite an existing assignment).
    public shared ({ caller }) func setBossPortalAssignment(portalId : Text, bossId : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        if (portalId == "") {
            return #err("portalId cannot be empty");
        };
        switch (bossConfigs.get(bossId)) {
            case null { return #err("Boss not found: " # bossId) };
            case (?_) {};
        };
        bossPortalAssignments.add(portalId, bossId);
        #ok;
    };

    /// Admin: remove a boss portal assignment.
    public shared ({ caller }) func deleteBossPortalAssignment(portalId : Text) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        bossPortalAssignments.remove(portalId);
        #ok;
    };

    // ─── Doka (currency) drop system ────────────────────────────────────────────────────

    /// Separate stable storage for Doka balances, keyed by Principal.
    let dokaBalances = Map.empty<Principal, Nat>();

    /// Returns the caller's current Doka balance.
    public query ({ caller }) func getDokaBalance() : async Nat {
        switch (dokaBalances.get(caller)) {
            case null { 0 };
            case (?bal) { bal };
        };
    };

    /// For each enemy in the list, computes a Doka drop using true IC randomness,
    /// sums the drops, adds to the caller's balance, and returns the total earned.
    ///
    /// Tier probabilities (out of 10_000 units):
    ///   9000 / 10000 = 90%   → 1–3
    ///    500 / 10000 =  5%   → 1–10
    ///    300 / 10000 =  3%   → 1–50
    ///    100 / 10000 =  1%   → 55–100
    ///     50 / 10000 = 0.5%  → 1–1000
    ///     40 / 10000 = 0.4%  → 1–5000
    ///      5 / 10000 = 0.05% → 1–1_000_000
    ///      1 / 10000 = 0.01% (≈ 0.0001%) → 1–1_000_000_000
    ///      4 remaining → 1–50  (lumped with 3% tier)
    public shared ({ caller }) func calculateAndAwardDoka(enemies : [{ level : Nat }]) : async Nat {
        if (bannedPrincipals.containsKey(caller.toText())) {
            return 0;
        };
        // Fetch a single random blob from the IC management canister.
        let rawBlob = await (actor "aaaaa-aa" : actor { raw_rand : () -> async Blob }).raw_rand();
        let bytes = rawBlob.toArray();
        let byteCount = bytes.size();

        // Helper: consume 2 bytes at offset to get a Nat in [0, 65535].
        // Falls back to 0 if we run out of bytes.
        func readU16(offset : Nat) : Nat {
            if (offset + 1 < byteCount) {
                bytes[offset].toNat() * 256 + bytes[offset + 1].toNat()
            } else if (offset < byteCount) {
                bytes[offset].toNat() * 256
            } else {
                0
            }
        };

        // Helper: consume 4 bytes at offset to get a Nat in [0, 2^32-1].
        func readU32(offset : Nat) : Nat {
            let hi = readU16(offset);
            let lo = readU16(offset + 2);
            hi * 65536 + lo
        };

        // Map a raw Nat to a range [lo, hi] inclusive.
        func inRange(raw : Nat, lo : Nat, hi : Nat) : Nat {
            let span = hi - lo + 1;
            lo + (raw % span)
        };

        var totalDoka : Nat = 0;
        var byteIndex : Nat = 0;

        for (enemy in enemies.values()) {
            // 2 bytes for tier selection (range 0..9999)
            let tierRaw = readU16(byteIndex) % 10_000;
            byteIndex += 2;

            // 4 bytes for value selection within the tier
            let valueRaw = readU32(byteIndex);
            byteIndex += 4;

            let multiplier : Nat = if (tierRaw < 9000) {
                // 90% → 1..3
                inRange(valueRaw, 1, 3)
            } else if (tierRaw < 9500) {
                // 5% → 1..10
                inRange(valueRaw, 1, 10)
            } else if (tierRaw < 9800) {
                // 3% → 1..50
                inRange(valueRaw, 1, 50)
            } else if (tierRaw < 9900) {
                // 1% → 55..100
                inRange(valueRaw, 55, 100)
            } else if (tierRaw < 9950) {
                // 0.5% → 1..1000
                inRange(valueRaw, 1, 1_000)
            } else if (tierRaw < 9990) {
                // 0.4% → 1..5000
                inRange(valueRaw, 1, 5_000)
            } else if (tierRaw < 9999) {
                // 0.09% → 1..1_000_000
                inRange(valueRaw, 1, 1_000_000)
            } else {
                // 0.01% → 1..1_000_000_000
                inRange(valueRaw, 1, 1_000_000_000)
            };

            totalDoka += enemy.level * multiplier;
        };

        // Update caller's balance.
        let current = switch (dokaBalances.get(caller)) {
            case null { 0 };
            case (?b) { b };
        };
        dokaBalances.add(caller, current + totalDoka);
        totalDoka;
    };

    public shared(msg) func saveKillCount(slot: Nat, kills: Nat) : async {#ok; #err: Text} {
      let caller = msg.caller;
      switch (characterSlots.get(caller)) {
        case null { #err("no character slots found") };
        case (?slots) {
          let charOpt = switch(slot) {
            case 1 { slots.slot1 };
            case 2 { slots.slot2 };
            case 3 { slots.slot3 };
            case _ { null };
          };
          switch(charOpt) {
            case null { #err("slot not found") };
            case (?char) {
              let updatedChar = { char with stats = { char.stats with killCount = char.stats.killCount + kills } };
              let updatedSlots = switch(slot) {
                case 1 { { slots with slot1 = ?updatedChar } };
                case 2 { { slots with slot2 = ?updatedChar } };
                case 3 { { slots with slot3 = ?updatedChar } };
                case _ { slots };
              };
              characterSlots.add(caller, updatedSlots);
              #ok
            };
          };
        };
      };
    };

    // ─── Session state API ──────────────────────────────────────────────────

    /// Update the session state fields (bloodBalance, covenantBuff, shrineCount)
    /// for a character slot. Replaces localStorage for cross-device persistence.
    public shared ({ caller }) func updateSessionState(
        slot         : Nat,
        bloodBalance : Nat,
        covenantBuff : Text,
        shrineCount  : Nat,
    ) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            return #err("Unauthorized: must be logged in");
        };
        if (slot < 1 or slot > 3) {
            return #err("Invalid slot number");
        };
        if (bloodBalance > 100) {
            return #err("bloodBalance must be 0-100");
        };
        let existingSlots = switch (characterSlots.get(caller)) {
            case null { return #err("No characters found for user") };
            case (?s) { s };
        };
        let character = switch (slot) {
            case 1 { switch (existingSlots.slot1) { case null { return #err("Slot 1 is empty") }; case (?c) { c } } };
            case 2 { switch (existingSlots.slot2) { case null { return #err("Slot 2 is empty") }; case (?c) { c } } };
            case 3 { switch (existingSlots.slot3) { case null { return #err("Slot 3 is empty") }; case (?c) { c } } };
            case _ { return #err("Invalid slot") };
        };
        let updatedCharacter : Character = {
            character with
            bloodBalance = ?bloodBalance;
            covenantBuff = ?covenantBuff;
            shrineCount  = ?shrineCount;
        };
        let updatedSlots = switch (slot) {
            case 1 { { existingSlots with slot1 = ?updatedCharacter } };
            case 2 { { existingSlots with slot2 = ?updatedCharacter } };
            case 3 { { existingSlots with slot3 = ?updatedCharacter } };
            case _ { existingSlots };
        };
        characterSlots.add(caller, updatedSlots);
        #ok;
    };

    /// Save the active spell loadout (up to 8 spell IDs) for a character slot.
    /// Replaces localStorage so spell loadouts persist across devices and browser clears.
    public shared ({ caller }) func saveActiveSpells(
        slot   : Nat,
        spells : [Nat],
    ) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            return #err("Unauthorized: must be logged in");
        };
        if (slot < 1 or slot > 3) {
            return #err("Invalid slot number");
        };
        if (spells.size() > 8) {
            return #err("Cannot equip more than 8 spells");
        };
        let existingSlots = switch (characterSlots.get(caller)) {
            case null { return #err("No characters found for user") };
            case (?s) { s };
        };
        let character = switch (slot) {
            case 1 { switch (existingSlots.slot1) { case null { return #err("Slot 1 is empty") }; case (?c) { c } } };
            case 2 { switch (existingSlots.slot2) { case null { return #err("Slot 2 is empty") }; case (?c) { c } } };
            case 3 { switch (existingSlots.slot3) { case null { return #err("Slot 3 is empty") }; case (?c) { c } } };
            case _ { return #err("Invalid slot") };
        };
        let updatedCharacter : Character = { character with activeSpells = ?spells };
        let updatedSlots = switch (slot) {
            case 1 { { existingSlots with slot1 = ?updatedCharacter } };
            case 2 { { existingSlots with slot2 = ?updatedCharacter } };
            case 3 { { existingSlots with slot3 = ?updatedCharacter } };
            case _ { existingSlots };
        };
        characterSlots.add(caller, updatedSlots);
        #ok;
    };

    /// Query the persisted session state for a character slot.
    /// Returns null values for any field not yet set (legacy characters).
    public query ({ caller }) func getSessionState(slot : Nat) : async {
        #ok : { bloodBalance : Nat; covenantBuff : Text; shrineCount : Nat; activeSpells : [Nat] };
        #err : Text
    } {
        if (slot < 1 or slot > 3) {
            return #err("Invalid slot number");
        };
        let slots = switch (characterSlots.get(caller)) {
            case null { return #err("No characters found for user") };
            case (?s) { s };
        };
        let charOpt = switch (slot) {
            case 1 { slots.slot1 };
            case 2 { slots.slot2 };
            case 3 { slots.slot3 };
            case _ { null };
        };
        switch (charOpt) {
            case null { #err("Slot " # slot.toText() # " is empty") };
            case (?c) {
                #ok({
                    bloodBalance = switch (c.bloodBalance) { case (?v) v; case null 50 };
                    covenantBuff = switch (c.covenantBuff) { case (?v) v; case null "" };
                    shrineCount  = switch (c.shrineCount)  { case (?v) v; case null 0  };
                    activeSpells = switch (c.activeSpells) { case (?v) v; case null [] };
                });
            };
        };
    };

    // ─── Boss Rush state ────────────────────────────────────────────────────

    /// Per-player boss rush state keyed by "principalText#slot".
    /// Fields: (currentRoom, highestRoomCompleted, totalBossRushRuns)
    type BossRushState = {
        currentRoom            : Nat;   // 0-9, which room they are on
        highestRoomCompleted   : Nat;   // best room ever completed (0-10)
        totalBossRushRuns      : Nat;   // how many full 10-room runs completed
    };

    let bossRushStates = Map.empty<Text, BossRushState>();

    func _bossRushKey(caller : Principal, slot : Nat) : Text {
        caller.toText() # "#" # slot.toText()
    };

    /// Returns (currentRoom, highestRoomCompleted, totalBossRushRuns) for any player+slot.
    public query ({ caller }) func getBossRushState(userId : Principal, slot : Nat) : async (Nat, Nat, Nat) {
        if (caller != userId) {
            return (0, 0, 0);
        };
        switch (bossRushStates.get(_bossRushKey(userId, slot))) {
            case null { (0, 0, 0) };
            case (?s) { (s.currentRoom, s.highestRoomCompleted, s.totalBossRushRuns) };
        };
    };

    /// Called when the player enters a boss rush room. Records the current room index.
    public shared ({ caller }) func setBossRushProgress(slot : Nat, currentRoom : Nat) : async () {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            Runtime.trap("Unauthorized: must be logged in");
        };
        if (slot < 1 or slot > 3) { Runtime.trap("Invalid slot number") };
        if (currentRoom > 9) { Runtime.trap("currentRoom must be 0-9") };
        let key = _bossRushKey(caller, slot);
        let existing = switch (bossRushStates.get(key)) {
            case null { { currentRoom = 0; highestRoomCompleted = 0; totalBossRushRuns = 0 } };
            case (?s) { s };
        };
        bossRushStates.add(key, { existing with currentRoom });
    };

    /// Called when a boss rush room is cleared. Awards Doka and XP to the character.
    /// Room 10 (roomIndex = 9 completed → highestRoomCompleted reaches 10) sets bossRushMasterComplete.
    public shared ({ caller }) func completeBossRushRoom(
        slot        : Nat,
        roomIndex   : Nat,
        dokaReward  : Nat,
        xpReward    : Nat,
    ) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            return #err("Unauthorized: must be logged in");
        };
        if (bannedPrincipals.containsKey(caller.toText())) {
            return #err("Account banned for non-payment");
        };
        if (slot < 1 or slot > 3) { return #err("Invalid slot number") };
        if (roomIndex > 9) { return #err("roomIndex must be 0-9") };

        // Update boss rush state.
        let key = _bossRushKey(caller, slot);
        let existing = switch (bossRushStates.get(key)) {
            case null { { currentRoom = 0; highestRoomCompleted = 0; totalBossRushRuns = 0 } };
            case (?s) { s };
        };
        let completedRoom = roomIndex + 1; // 1-indexed room completed
        let newHighest = if (completedRoom > existing.highestRoomCompleted) { completedRoom } else { existing.highestRoomCompleted };
        // A full run = all 10 rooms completed (roomIndex 9 = room 10).
        let newTotalRuns = if (roomIndex == 9) { existing.totalBossRushRuns + 1 } else { existing.totalBossRushRuns };
        bossRushStates.add(key, {
            currentRoom            = existing.currentRoom;
            highestRoomCompleted   = newHighest;
            totalBossRushRuns      = newTotalRuns;
        });

        // Award Doka to the per-principal balance.
        if (dokaReward > 0) {
            let currentDoka = switch (dokaBalances.get(caller)) {
                case null { 0 };
                case (?b) { b };
            };
            dokaBalances.add(caller, currentDoka + dokaReward);
        };

        // Award XP to the character and set bossRushMasterComplete on full run.
        let existingSlots = switch (characterSlots.get(caller)) {
            case null { return #err("No characters found for user") };
            case (?s) { s };
        };
        let character = switch (slot) {
            case 1 { switch (existingSlots.slot1) { case null { return #err("Slot 1 is empty") }; case (?c) { c } } };
            case 2 { switch (existingSlots.slot2) { case null { return #err("Slot 2 is empty") }; case (?c) { c } } };
            case 3 { switch (existingSlots.slot3) { case null { return #err("Slot 3 is empty") }; case (?c) { c } } };
            case _ { return #err("Invalid slot") };
        };
        let isMasterRun = roomIndex == 9;
        let updatedCharacter : Character = {
            character with
            experience = character.experience + xpReward;
            bossRushMasterComplete = if (isMasterRun) { ?true } else { character.bossRushMasterComplete };
        };
        let updatedSlots = switch (slot) {
            case 1 { { existingSlots with slot1 = ?updatedCharacter } };
            case 2 { { existingSlots with slot2 = ?updatedCharacter } };
            case 3 { { existingSlots with slot3 = ?updatedCharacter } };
            case _ { existingSlots };
        };
        characterSlots.add(caller, updatedSlots);
        #ok;
    };

    /// Called on player death or boss rush abort. Resets currentRoom to 0.
    public shared ({ caller }) func resetBossRush(slot : Nat) : async () {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
            Runtime.trap("Unauthorized: must be logged in");
        };
        if (slot < 1 or slot > 3) { Runtime.trap("Invalid slot number") };
        let key = _bossRushKey(caller, slot);
        switch (bossRushStates.get(key)) {
            case null {}; // nothing to reset
            case (?s) {
                bossRushStates.add(key, { s with currentRoom = 0 });
            };
        };
    };

    public query func getLeaderboard() : async [{principalId: Text; playerName: Text; level: Nat; killCount: Nat; achievementsCompleted: Nat}] {
      var entries : [{principalId: Text; playerName: Text; level: Nat; killCount: Nat; achievementsCompleted: Nat}] = [];
      for ((principal, slots) in characterSlots.entries()) {
        var bestLevel : Nat = 0;
        var bestName : Text = "Unknown";
        var bestKills : Nat = 0;
        let checkChar = func(cOpt: ?Character) {
          switch(cOpt) {
            case null {};
            case (?c) {
              if (c.level > bestLevel) {
                bestLevel := c.level;
                bestName := c.name;
                bestKills := c.stats.killCount;
              };
            };
          };
        };
        checkChar(slots.slot1);
        checkChar(slots.slot2);
        checkChar(slots.slot3);
        if (bestLevel > 0) {
          let principalText = principal.toText();
          var achCount : Nat = 0;
          for ((key, prog) in achievementProgress.entries()) {
            if (prog.principalId == principalText and prog.claimed) {
              achCount += 1;
            };
          };
          entries := entries.concat([{
            principalId = principalText;
            playerName = bestName;
            level = bestLevel;
            killCount = bestKills;
            achievementsCompleted = achCount;
          }]);
        };
      };
      let sorted = entries.sort(func(a, b) {
        if (a.level > b.level) { #less }
        else if (a.level < b.level) { #greater }
        else { #equal }
      });
      if (sorted.size() > 50) { sorted.sliceToArray(0, 50) } else { sorted }
    };

    // ─── Ad boxes (login page, admin-managed) ───────────────────────────────
    // Three fixed slots; stored as a plain array of tuples for shared-type
    // compatibility.  Each entry is (imageUrl, linkUrl, isActive).
    var adBoxes : [(Text, Text, Bool)] = [
        ("", "", false),
        ("", "", false),
        ("", "", false),
    ];

    /// Returns all three ad box slots.  Empty/inactive slots have isActive=false.
    public query func getAdBoxes() : async [(Text, Text, Bool)] {
        adBoxes
    };

    /// Admin: set the image URL and link URL for a specific ad box slot.
    /// index must be 0, 1, or 2; the slot is immediately marked active.
    public shared ({ caller }) func adminSetAdBox(
        index    : Nat,
        imageUrl : Text,
        linkUrl  : Text,
    ) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        if (index >= 3) {
            return #err("index out of range: must be 0, 1, or 2");
        };
        adBoxes := Array.tabulate(3, func i {
            if (i == index) { (imageUrl, linkUrl, true) }
            else { adBoxes[i] }
        });
        #ok
    };

    /// Admin: clear a specific ad box slot (sets it back to empty/inactive).
    public shared ({ caller }) func adminClearAdBox(
        index : Nat,
    ) : async { #ok; #err : Text } {
        if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
            return #err("Unauthorized: admin only");
        };
        if (index >= 3) {
            return #err("index out of range: must be 0, 1, or 2");
        };
        adBoxes := Array.tabulate(3, func i {
            if (i == index) { ("", "", false) }
            else { adBoxes[i] }
        });
        #ok
    };

    // ─── OQL (Data Intelligence) ─────────────────────────────────────────
    // Expose persisted collections as queryable entities. The Expose mixin adds
    // only the OQL schema()/execute() query methods; existing state, types, and
    // shared methods are untouched. This block sits at the END of the actor so
    // every persisted `let` field it references is already declared above.
    include Expose({
        entities = [
            // ── Player-owned persisted collections (per-Principal) ───────────
            // characterSlots : Map<Principal, CharacterSlots> — row identity is the
            // Map key (Principal), so iterate .entries() in manual mode and promote
            // the key as the primary key column. Each slot is flattened into its own
            // row so the agent can query individual characters.
            (func () : OQL.Entity.Decl {
                let cs0 = OQL.Entity.manual<(Principal, CharacterSlots)>(
                    "characterSlots",
                    func () = characterSlots.entries(),
                    "CharacterSlotRow",
                    "rowId",
                );
                let cs1 = OQL.Entity.payload(cs0, "rowId", func ((p, _slots)) = p.toText() # "#" # "slots", OQL.TextValue._toRow);
                let cs2 = OQL.Entity.payload(cs1, "owner", func ((p, _)) = p.toText(), OQL.TextValue._toRow);
                let cs3 = OQL.Entity.payload(cs2, "slot1Name", func ((_, s)) =
                    switch (s.slot1) { case null ""; case (?c) c.name }, OQL.TextValue._toRow);
                let cs4 = OQL.Entity.payload(cs3, "slot1PieceType", func ((_, s)) =
                    switch (s.slot1) { case null ""; case (?c) c.pieceType }, OQL.TextValue._toRow);
                let cs5 = OQL.Entity.payload(cs4, "slot1Level", func ((_, s)) =
                    switch (s.slot1) { case null 0; case (?c) c.level }, OQL.NatValue._toRow);
                let cs6 = OQL.Entity.payload(cs5, "slot1Experience", func ((_, s)) =
                    switch (s.slot1) { case null 0; case (?c) c.experience }, OQL.NatValue._toRow);
                let cs7 = OQL.Entity.payload(cs6, "slot1Hp", func ((_, s)) =
                    switch (s.slot1) { case null 0; case (?c) c.stats.hp }, OQL.NatValue._toRow);
                let cs8 = OQL.Entity.payload(cs7, "slot1KillCount", func ((_, s)) =
                    switch (s.slot1) { case null 0; case (?c) c.stats.killCount }, OQL.NatValue._toRow);
                let cs9 = OQL.Entity.payload(cs8, "slot2Name", func ((_, s)) =
                    switch (s.slot2) { case null ""; case (?c) c.name }, OQL.TextValue._toRow);
                let cs10 = OQL.Entity.payload(cs9, "slot2PieceType", func ((_, s)) =
                    switch (s.slot2) { case null ""; case (?c) c.pieceType }, OQL.TextValue._toRow);
                let cs11 = OQL.Entity.payload(cs10, "slot2Level", func ((_, s)) =
                    switch (s.slot2) { case null 0; case (?c) c.level }, OQL.NatValue._toRow);
                let cs12 = OQL.Entity.payload(cs11, "slot2Experience", func ((_, s)) =
                    switch (s.slot2) { case null 0; case (?c) c.experience }, OQL.NatValue._toRow);
                let cs13 = OQL.Entity.payload(cs12, "slot2Hp", func ((_, s)) =
                    switch (s.slot2) { case null 0; case (?c) c.stats.hp }, OQL.NatValue._toRow);
                let cs14 = OQL.Entity.payload(cs13, "slot2KillCount", func ((_, s)) =
                    switch (s.slot2) { case null 0; case (?c) c.stats.killCount }, OQL.NatValue._toRow);
                let cs15 = OQL.Entity.payload(cs14, "slot3Name", func ((_, s)) =
                    switch (s.slot3) { case null ""; case (?c) c.name }, OQL.TextValue._toRow);
                let cs16 = OQL.Entity.payload(cs15, "slot3PieceType", func ((_, s)) =
                    switch (s.slot3) { case null ""; case (?c) c.pieceType }, OQL.TextValue._toRow);
                let cs17 = OQL.Entity.payload(cs16, "slot3Level", func ((_, s)) =
                    switch (s.slot3) { case null 0; case (?c) c.level }, OQL.NatValue._toRow);
                let cs18 = OQL.Entity.payload(cs17, "slot3Experience", func ((_, s)) =
                    switch (s.slot3) { case null 0; case (?c) c.experience }, OQL.NatValue._toRow);
                let cs19 = OQL.Entity.payload(cs18, "slot3Hp", func ((_, s)) =
                    switch (s.slot3) { case null 0; case (?c) c.stats.hp }, OQL.NatValue._toRow);
                let cs20 = OQL.Entity.payload(cs19, "slot3KillCount", func ((_, s)) =
                    switch (s.slot3) { case null 0; case (?c) c.stats.killCount }, OQL.NatValue._toRow);
                let cs21 = OQL.Entity.ownedBy(cs20, "owner");
                let cs22 = OQL.Entity.controllerOrScoped(cs21);
                OQL.Entity.build(cs22)
            })(),
            // dokaBalances : Map<Principal, Nat> — per-player currency.
            (func () : OQL.Entity.Decl {
                let db0 = OQL.Entity.manual<(Principal, Nat)>(
                    "dokaBalances",
                    func () = dokaBalances.entries(),
                    "DokaBalance",
                    "owner",
                );
                let db1 = OQL.Entity.payload(db0, "owner",   func ((p, _)) = p.toText(), OQL.TextValue._toRow);
                let db2 = OQL.Entity.payload(db1, "balance", func ((_, n)) = n, OQL.NatValue._toRow);
                let db3 = OQL.Entity.ownedBy(db2, "owner");
                let db4 = OQL.Entity.controllerOrScoped(db3);
                OQL.Entity.build(db4)
            })(),
            // userProfiles : Map<Principal, UserProfile> — per-player display name.
            (func () : OQL.Entity.Decl {
                let up0 = OQL.Entity.manual<(Principal, UserProfile)>(
                    "userProfiles",
                    func () = userProfiles.entries(),
                    "UserProfile",
                    "owner",
                );
                let up1 = OQL.Entity.payload(up0, "owner", func ((p, _)) = p.toText(), OQL.TextValue._toRow);
                let up2 = OQL.Entity.payload(up1, "name",  func ((_, u)) = u.name, OQL.TextValue._toRow);
                let up3 = OQL.Entity.ownedBy(up2, "owner");
                let up4 = OQL.Entity.controllerOrScoped(up3);
                OQL.Entity.build(up4)
            })(),
            // changelogShownVersions : Map<Principal, Text> — per-player last-seen version.
            (func () : OQL.Entity.Decl {
                let cl0 = OQL.Entity.manual<(Principal, Text)>(
                    "changelogShownVersions",
                    func () = changelogShownVersions.entries(),
                    "ChangelogShownVersion",
                    "owner",
                );
                let cl1 = OQL.Entity.payload(cl0, "owner",   func ((p, _)) = p.toText(), OQL.TextValue._toRow);
                let cl2 = OQL.Entity.payload(cl1, "version", func ((_, v)) = v, OQL.TextValue._toRow);
                let cl3 = OQL.Entity.ownedBy(cl2, "owner");
                let cl4 = OQL.Entity.controllerOrScoped(cl3);
                OQL.Entity.build(cl4)
            })(),
            // dungeonRecords : Map<Principal, AdminTypes.DungeonRecord> — per-player chain progress.
            (func () : OQL.Entity.Decl {
                let dr0 = OQL.Entity.manual<(Principal, AdminTypes.DungeonRecord)>(
                    "dungeonRecords",
                    func () = dungeonRecords.entries(),
                    "DungeonRecord",
                    "owner",
                );
                let dr1 = OQL.Entity.payload(dr0, "owner", func ((p, _)) = p.toText(), OQL.TextValue._toRow);
                let dr2 = OQL.Entity.payload(dr1, "chainDepth", func ((_, r)) = r.chainDepth, OQL.NatValue._toRow);
                let dr3 = OQL.Entity.payload(dr2, "totalMapsCompleted", func ((_, r)) = r.totalMapsCompleted, OQL.NatValue._toRow);
                let dr4 = OQL.Entity.payload(dr3, "bestRewardMultiplier", func ((_, r)) = r.bestRewardMultiplier, OQL.FloatValue._toRow);
                let dr5 = OQL.Entity.ownedBy(dr4, "owner");
                let dr6 = OQL.Entity.controllerOrScoped(dr5);
                OQL.Entity.build(dr6)
            })(),
            // ── Admin-managed config collections (controllerOnly) ─────────────
            // enemyConfigs : Map<Text, EnemyConfig> — admin enemy templates.
            (func () : OQL.Entity.Decl {
                let ec0 = OQL.Entity.manual<(Text, EnemyConfig)>(
                    "enemyConfigs",
                    func () = enemyConfigs.entries(),
                    "EnemyConfig",
                    "id",
                );
                let ec1 = OQL.Entity.payload(ec0, "id",       func ((k, _)) = k, OQL.TextValue._toRow);
                let ec2 = OQL.Entity.payload(ec1, "name",      func ((_, c)) = c.name, OQL.TextValue._toRow);
                let ec3 = OQL.Entity.payload(ec2, "hp",        func ((_, c)) = c.hp, OQL.NatValue._toRow);
                let ec4 = OQL.Entity.payload(ec3, "ap",        func ((_, c)) = c.ap, OQL.NatValue._toRow);
                let ec5 = OQL.Entity.payload(ec4, "mp",        func ((_, c)) = c.mp, OQL.NatValue._toRow);
                let ec6 = OQL.Entity.payload(ec5, "initStat",  func ((_, c)) = c.initStat, OQL.NatValue._toRow);
                let ec7 = OQL.Entity.payload(ec6, "levelMin",  func ((_, c)) = c.levelMin, OQL.NatValue._toRow);
                let ec8 = OQL.Entity.payload(ec7, "levelMax",  func ((_, c)) = c.levelMax, OQL.NatValue._toRow);
                let ec9 = OQL.Entity.payload(ec8, "regions",   func ((_, c)) = c.regions.vals().join(", "), OQL.TextValue._toRow);
                let ec10 = OQL.Entity.payload(ec9, "spriteUrl", func ((_, c)) =
                    switch (c.spriteUrl) { case null ""; case (?u) u }, OQL.TextValue._toRow);
                let ec11 = OQL.Entity.controllerOnly(ec10);
                OQL.Entity.build(ec11)
            })(),
            // regionConfigs : Map<Text, RegionConfig> — admin region templates.
            (func () : OQL.Entity.Decl {
                let rc0 = OQL.Entity.manual<(Text, RegionConfig)>(
                    "regionConfigs",
                    func () = regionConfigs.entries(),
                    "RegionConfig",
                    "id",
                );
                let rc1 = OQL.Entity.payload(rc0, "id",              func ((k, _)) = k, OQL.TextValue._toRow);
                let rc2 = OQL.Entity.payload(rc1, "name",            func ((_, c)) = c.name, OQL.TextValue._toRow);
                let rc3 = OQL.Entity.payload(rc2, "levelMin",        func ((_, c)) = c.levelMin, OQL.NatValue._toRow);
                let rc4 = OQL.Entity.payload(rc3, "levelMax",        func ((_, c)) = c.levelMax, OQL.NatValue._toRow);
                let rc5 = OQL.Entity.payload(rc4, "backgroundColor",func ((_, c)) = c.backgroundColor, OQL.TextValue._toRow);
                let rc6 = OQL.Entity.payload(rc5, "battleEffectCount", func ((_, c)) = c.battleEffects.size(), OQL.NatValue._toRow);
                let rc7 = OQL.Entity.controllerOnly(rc6);
                OQL.Entity.build(rc7)
            })(),
            // playerSpriteConfigs : Map<Text, PlayerSpriteConfig> — admin sprite templates.
            (func () : OQL.Entity.Decl {
                let psc0 = OQL.Entity.manual<(Text, PlayerSpriteConfig)>(
                    "playerSpriteConfigs",
                    func () = playerSpriteConfigs.entries(),
                    "PlayerSpriteConfig",
                    "id",
                );
                let psc1 = OQL.Entity.payload(psc0, "id",                 func ((k, _)) = k, OQL.TextValue._toRow);
                let psc2 = OQL.Entity.payload(psc1, "name",               func ((_, c)) = c.name, OQL.TextValue._toRow);
                let psc3 = OQL.Entity.payload(psc2, "characterPieceType", func ((_, c)) = c.characterPieceType, OQL.TextValue._toRow);
                let psc4 = OQL.Entity.payload(psc3, "frontUrl", func ((_, c)) =
                    switch (c.frontUrl) { case null ""; case (?u) u }, OQL.TextValue._toRow);
                let psc5 = OQL.Entity.payload(psc4, "rightUrl", func ((_, c)) =
                    switch (c.rightUrl) { case null ""; case (?u) u }, OQL.TextValue._toRow);
                let psc6 = OQL.Entity.payload(psc5, "leftUrl", func ((_, c)) =
                    switch (c.leftUrl) { case null ""; case (?u) u }, OQL.TextValue._toRow);
                let psc7 = OQL.Entity.payload(psc6, "backUrl", func ((_, c)) =
                    switch (c.backUrl) { case null ""; case (?u) u }, OQL.TextValue._toRow);
                let psc8 = OQL.Entity.controllerOnly(psc7);
                OQL.Entity.build(psc8)
            })(),
            // spellConfigs : Map<Text, AdminTypes.SpellConfig> — admin spell definitions.
            (func () : OQL.Entity.Decl {
                let sc0 = OQL.Entity.manual<(Text, AdminTypes.SpellConfig)>(
                    "spellConfigs",
                    func () = spellConfigs.entries(),
                    "SpellConfig",
                    "id",
                );
                let sc1  = OQL.Entity.payload(sc0, "id",             func ((k, _)) = k, OQL.TextValue._toRow);
                let sc2  = OQL.Entity.payload(sc1, "name",           func ((_, c)) = c.name, OQL.TextValue._toRow);
                let sc3  = OQL.Entity.payload(sc2, "description",    func ((_, c)) = c.description, OQL.TextValue._toRow);
                let sc4  = OQL.Entity.payload(sc3, "iconEmoji",      func ((_, c)) = c.iconEmoji, OQL.TextValue._toRow);
                let sc5  = OQL.Entity.payload(sc4, "apCost",         func ((_, c)) = c.apCost, OQL.NatValue._toRow);
                let sc6  = OQL.Entity.payload(sc5, "mpCost",         func ((_, c)) = c.mpCost, OQL.NatValue._toRow);
                let sc7  = OQL.Entity.payload(sc6, "damage",         func ((_, c)) = c.damage, OQL.NatValue._toRow);
                let sc8  = OQL.Entity.payload(sc7, "healAmount",     func ((_, c)) = c.healAmount, OQL.NatValue._toRow);
                let sc9  = OQL.Entity.payload(sc8, "effectType",     func ((_, c)) = c.effectType, OQL.TextValue._toRow);
                let sc10 = OQL.Entity.payload(sc9, "spellType",      func ((_, c)) = c.spellType, OQL.TextValue._toRow);
                let sc11 = OQL.Entity.payload(sc10, "isPhysical",     func ((_, c)) = c.isPhysical, OQL.BoolValue._toRow);
                let sc12 = OQL.Entity.payload(sc11, "range",          func ((_, c)) = c.range, OQL.NatValue._toRow);
                let sc13 = OQL.Entity.payload(sc12, "minRange",       func ((_, c)) = c.minRange, OQL.NatValue._toRow);
                let sc14 = OQL.Entity.payload(sc13, "maxRange",       func ((_, c)) = c.maxRange, OQL.NatValue._toRow);
                let sc15 = OQL.Entity.payload(sc14, "modifiableRange",func ((_, c)) = c.modifiableRange, OQL.BoolValue._toRow);
                let sc16 = OQL.Entity.payload(sc15, "lineOfSight",    func ((_, c)) = c.lineOfSight, OQL.BoolValue._toRow);
                let sc17 = OQL.Entity.payload(sc16, "linear",         func ((_, c)) = c.linear, OQL.BoolValue._toRow);
                let sc18 = OQL.Entity.payload(sc17, "diagonal",      func ((_, c)) = c.diagonal, OQL.BoolValue._toRow);
                let sc19 = OQL.Entity.payload(sc18, "freeCells",      func ((_, c)) = c.freeCells, OQL.BoolValue._toRow);
                let sc20 = OQL.Entity.payload(sc19, "aoe",            func ((_, c)) = c.aoe, OQL.BoolValue._toRow);
                let sc21 = OQL.Entity.payload(sc20, "multiTarget",    func ((_, c)) = c.multiTarget, OQL.BoolValue._toRow);
                let sc22 = OQL.Entity.payload(sc21, "hitsAllies",     func ((_, c)) = c.hitsAllies, OQL.BoolValue._toRow);
                let sc23 = OQL.Entity.payload(sc22, "effectCategory", func ((_, c)) = c.effectCategory, OQL.TextValue._toRow);
                let sc24 = OQL.Entity.payload(sc23, "usableByPlayer", func ((_, c)) = c.usableByPlayer, OQL.BoolValue._toRow);
                let sc25 = OQL.Entity.payload(sc24, "usableByEnemy",  func ((_, c)) = c.usableByEnemy, OQL.BoolValue._toRow);
                let sc26 = OQL.Entity.payload(sc25, "minLevel",       func ((_, c)) = c.minLevel, OQL.NatValue._toRow);
                let sc27 = OQL.Entity.payload(sc26, "effectParams", func ((_, c)) =
                    switch (c.effectParams) { case null ""; case (?p) p }, OQL.TextValue._toRow);
                let sc28 = OQL.Entity.payload(sc27, "cooldown",       func ((_, c)) = c.cooldown, OQL.NatValue._toRow);
                let sc29 = OQL.Entity.controllerOnly(sc28);
                OQL.Entity.build(sc29)
            })(),
            // mapModifierConfigs : Map<Text, AdminTypes.MapModifierConfig>.
            (func () : OQL.Entity.Decl {
                let mmc0 = OQL.Entity.manual<(Text, AdminTypes.MapModifierConfig)>(
                    "mapModifierConfigs",
                    func () = mapModifierConfigs.entries(),
                    "MapModifierConfig",
                    "id",
                );
                let mmc1 = OQL.Entity.payload(mmc0, "id",            func ((k, _)) = k, OQL.TextValue._toRow);
                let mmc2 = OQL.Entity.payload(mmc1, "name",          func ((_, c)) = c.name, OQL.TextValue._toRow);
                let mmc3 = OQL.Entity.payload(mmc2, "description",   func ((_, c)) = c.description, OQL.TextValue._toRow);
                let mmc4 = OQL.Entity.payload(mmc3, "modifierType",  func ((_, c)) = c.modifierType, OQL.TextValue._toRow);
                let mmc5 = OQL.Entity.payload(mmc4, "active",        func ((_, c)) = c.active, OQL.BoolValue._toRow);
                let mmc6 = OQL.Entity.payload(mmc5, "triggerChance", func ((_, c)) = c.triggerChance, OQL.NatValue._toRow);
                let mmc7 = OQL.Entity.controllerOnly(mmc6);
                OQL.Entity.build(mmc7)
            })(),
            // shopPackages : Map<Text, AdminTypes.ShopPackage>.
            (func () : OQL.Entity.Decl {
                let sp0 = OQL.Entity.manual<(Text, AdminTypes.ShopPackage)>(
                    "shopPackages",
                    func () = shopPackages.entries(),
                    "ShopPackage",
                    "id",
                );
                let sp1 = OQL.Entity.payload(sp0, "id",            func ((k, _)) = k, OQL.TextValue._toRow);
                let sp2 = OQL.Entity.payload(sp1, "dokaAmount",    func ((_, c)) = c.dokaAmount, OQL.NatValue._toRow);
                let sp3 = OQL.Entity.payload(sp2, "priceEuroCents",func ((_, c)) = c.priceEuroCents, OQL.NatValue._toRow);
                let sp4 = OQL.Entity.payload(sp3, "paymentLink",   func ((_, c)) = c.paymentLink, OQL.TextValue._toRow);
                let sp5 = OQL.Entity.payload(sp4, "displayOrder", func ((_, c)) = c.displayOrder, OQL.NatValue._toRow);
                let sp6 = OQL.Entity.controllerOnly(sp5);
                OQL.Entity.build(sp6)
            })(),
            // achievementConfigs : Map<Text, AdminTypes.AchievementConfig>.
            (func () : OQL.Entity.Decl {
                let ac0 = OQL.Entity.manual<(Text, AdminTypes.AchievementConfig)>(
                    "achievementConfigs",
                    func () = achievementConfigs.entries(),
                    "AchievementConfig",
                    "id",
                );
                let ac1 = OQL.Entity.payload(ac0, "id",          func ((k, _)) = k, OQL.TextValue._toRow);
                let ac2 = OQL.Entity.payload(ac1, "name",        func ((_, c)) = c.name, OQL.TextValue._toRow);
                let ac3 = OQL.Entity.payload(ac2, "description", func ((_, c)) = c.description, OQL.TextValue._toRow);
                let ac4 = OQL.Entity.payload(ac3, "dokaReward",  func ((_, c)) = c.dokaReward, OQL.NatValue._toRow);
                let ac5 = OQL.Entity.payload(ac4, "condition",   func ((_, c)) = c.condition, OQL.TextValue._toRow);
                let ac6 = OQL.Entity.payload(ac5, "active",      func ((_, c)) = c.active, OQL.BoolValue._toRow);
                let ac7 = OQL.Entity.controllerOnly(ac6);
                OQL.Entity.build(ac7)
            })(),
            // achievementProgress : Map<Text, AdminTypes.AchievementProgress> — keyed by
            // "principalText#achievementId". Per-player rows: each signed-in user reads
            // only their own progress; the controller (Data Intelligence agent) reads all.
            (func () : OQL.Entity.Decl {
                let ap0 = OQL.Entity.manual<(Text, AdminTypes.AchievementProgress)>(
                    "achievementProgress",
                    func () = achievementProgress.entries(),
                    "AchievementProgress",
                    "key",
                );
                let ap1 = OQL.Entity.payload(ap0, "key", func ((k, _)) = k, OQL.TextValue._toRow);
                let ap2 = OQL.Entity.payload(ap1, "principalId",   func ((_, p)) = p.principalId, OQL.TextValue._toRow);
                let ap3 = OQL.Entity.payload(ap2, "achievementId", func ((_, p)) = p.achievementId, OQL.TextValue._toRow);
                let ap4 = OQL.Entity.payload(ap3, "unlocked",       func ((_, p)) = p.unlocked, OQL.BoolValue._toRow);
                let ap5 = OQL.Entity.payload(ap4, "unlockedAt",     func ((_, p)) = p.unlockedAt, OQL.IntValue._toRow);
                let ap6 = OQL.Entity.payload(ap5, "claimed",        func ((_, p)) = p.claimed, OQL.BoolValue._toRow);
                let ap7 = OQL.Entity.ownedBy(ap6, "principalId");
                let ap8 = OQL.Entity.controllerOrScoped(ap7);
                OQL.Entity.build(ap8)
            })(),
            // purchaseRecords : Map<Text, AdminTypes.PurchaseRecord> — keyed by purchase id.
            // Per-player rows: each signed-in user reads only their own purchases.
            (func () : OQL.Entity.Decl {
                let pr0 = OQL.Entity.manual<(Text, AdminTypes.PurchaseRecord)>(
                    "purchaseRecords",
                    func () = purchaseRecords.entries(),
                    "PurchaseRecord",
                    "id",
                );
                let pr1 = OQL.Entity.payload(pr0, "id", func ((k, _)) = k, OQL.TextValue._toRow);
                let pr2 = OQL.Entity.payload(pr1, "userPrincipal", func ((_, r)) = r.userPrincipal.toText(), OQL.TextValue._toRow);
                let pr3 = OQL.Entity.payload(pr2, "dokaAmount",     func ((_, r)) = r.dokaAmount, OQL.NatValue._toRow);
                let pr4 = OQL.Entity.payload(pr3, "packageId",      func ((_, r)) = r.packageId, OQL.TextValue._toRow);
                let pr5 = OQL.Entity.payload(pr4, "customerName",    func ((_, r)) = r.customerName, OQL.TextValue._toRow);
                let pr6 = OQL.Entity.payload(pr5, "customerSurname", func ((_, r)) = r.customerSurname, OQL.TextValue._toRow);
                let pr7 = OQL.Entity.payload(pr6, "customerEmail",   func ((_, r)) = r.customerEmail, OQL.TextValue._toRow);
                let pr8 = OQL.Entity.payload(pr7, "customerCity",    func ((_, r)) = r.customerCity, OQL.TextValue._toRow);
                let pr9 = OQL.Entity.payload(pr8, "customerCountry", func ((_, r)) = r.customerCountry, OQL.TextValue._toRow);
                let pr10 = OQL.Entity.payload(pr9, "timestamp",       func ((_, r)) = r.timestamp, OQL.IntValue._toRow);
                let pr11 = OQL.Entity.payload(pr10, "status",          func ((_, r)) = r.status, OQL.TextValue._toRow);
                let pr12 = OQL.Entity.ownedBy(pr11, "userPrincipal");
                let pr13 = OQL.Entity.controllerOrScoped(pr12);
                OQL.Entity.build(pr13)
            })(),
            // bannedPrincipals : Map<Text, Bool> — admin-only ban registry.
            (func () : OQL.Entity.Decl {
                let bp0 = OQL.Entity.manual<(Text, Bool)>(
                    "bannedPrincipals",
                    func () = bannedPrincipals.entries(),
                    "BannedPrincipal",
                    "principalText",
                );
                let bp1 = OQL.Entity.payload(bp0, "principalText", func ((k, _)) = k, OQL.TextValue._toRow);
                let bp2 = OQL.Entity.payload(bp1, "banned",         func ((_, b)) = b, OQL.BoolValue._toRow);
                let bp3 = OQL.Entity.controllerOnly(bp2);
                OQL.Entity.build(bp3)
            })(),
            // changelogs : Map<Text, Text> — admin-managed version changelog text.
            (func () : OQL.Entity.Decl {
                let cl0 = OQL.Entity.manual<(Text, Text)>(
                    "changelogs",
                    func () = changelogs.entries(),
                    "Changelog",
                    "version",
                );
                let cl1 = OQL.Entity.payload(cl0, "version", func ((k, _)) = k, OQL.TextValue._toRow);
                let cl2 = OQL.Entity.payload(cl1, "text",    func ((_, v)) = v, OQL.TextValue._toRow);
                let cl3 = OQL.Entity.controllerOnly(cl2);
                OQL.Entity.build(cl3)
            })(),
            // buffInventories : Map<Text, AdminTypes.BuffInventory> — keyed by
            // "principalText#slot". Per-player rows: each signed-in user reads only
            // their own inventories.
            (func () : OQL.Entity.Decl {
                let bi0 = OQL.Entity.manual<(Text, AdminTypes.BuffInventory)>(
                    "buffInventories",
                    func () = buffInventories.entries(),
                    "BuffInventory",
                    "key",
                );
                let bi1 = OQL.Entity.payload(bi0, "key", func ((k, _)) = k, OQL.TextValue._toRow);
                let bi2 = OQL.Entity.payload(bi1, "owner", func ((k, _)) =
                    // Extract the principalText portion (before the first "#").
                    switch (k.split(#char '#').next()) {
                        case null "";
                        case (?s) s;
                    }, OQL.TextValue._toRow);
                let bi3 = OQL.Entity.payload(bi2, "itemCount", func ((_, inv)) = inv.size(), OQL.NatValue._toRow);
                let bi4 = OQL.Entity.payload(bi3, "totalQuantity", func ((_, inv)) {
                    var total : Nat = 0;
                    for (item in inv.vals()) { total += item.quantity };
                    total
                }, OQL.NatValue._toRow);
                let bi5 = OQL.Entity.ownedBy(bi4, "owner");
                let bi6 = OQL.Entity.controllerOrScoped(bi5);
                OQL.Entity.build(bi6)
            })(),
            // bossConfigs : Map<Text, AdminTypes.BossConfig> — admin boss templates.
            (func () : OQL.Entity.Decl {
                let bc0 = OQL.Entity.manual<(Text, AdminTypes.BossConfig)>(
                    "bossConfigs",
                    func () = bossConfigs.entries(),
                    "BossConfig",
                    "id",
                );
                let bc1 = OQL.Entity.payload(bc0, "id",   func ((k, _)) = k, OQL.TextValue._toRow);
                let bc2 = OQL.Entity.payload(bc1, "name", func ((_, c)) = c.name, OQL.TextValue._toRow);
                let bc3 = OQL.Entity.payload(bc2, "pieceType", func ((_, c)) = c.pieceType, OQL.TextValue._toRow);
                let bc4 = OQL.Entity.payload(bc3, "baseHp",  func ((_, c)) = c.baseStats.hp, OQL.NatValue._toRow);
                let bc5 = OQL.Entity.payload(bc4, "baseAp",  func ((_, c)) = c.baseStats.ap, OQL.NatValue._toRow);
                let bc6 = OQL.Entity.payload(bc5, "baseMp",  func ((_, c)) = c.baseStats.mp, OQL.NatValue._toRow);
                let bc7 = OQL.Entity.payload(bc6, "baseAtk", func ((_, c)) = c.baseStats.atk, OQL.NatValue._toRow);
                let bc8 = OQL.Entity.payload(bc7, "baseRes", func ((_, c)) = c.baseStats.res, OQL.NatValue._toRow);
                let bc9 = OQL.Entity.payload(bc8, "baseInit",func ((_, c)) = c.baseStats.init, OQL.NatValue._toRow);
                let bc10 = OQL.Entity.payload(bc9, "baseSp",  func ((_, c)) = c.baseStats.sp, OQL.NatValue._toRow);
                let bc11 = OQL.Entity.payload(bc10, "bossMapColor", func ((_, c)) = c.bossMapColor, OQL.TextValue._toRow);
                let bc12 = OQL.Entity.payload(bc11, "portalColor",   func ((_, c)) = c.portalColor, OQL.TextValue._toRow);
                let bc13 = OQL.Entity.payload(bc12, "rewardDokaMultiplier", func ((_, c)) = c.rewardDokaMultiplier, OQL.FloatValue._toRow);
                let bc14 = OQL.Entity.payload(bc13, "rewardXpMultiplier",   func ((_, c)) = c.rewardXpMultiplier, OQL.FloatValue._toRow);
                let bc15 = OQL.Entity.payload(bc14, "defeated",   func ((_, c)) = c.defeated, OQL.BoolValue._toRow);
                let bc16 = OQL.Entity.payload(bc15, "adminNotes", func ((_, c)) = c.adminNotes, OQL.TextValue._toRow);
                let bc17 = OQL.Entity.controllerOnly(bc16);
                OQL.Entity.build(bc17)
            })(),
            // bossPortalAssignments : Map<Text, Text> — portalId → bossId.
            (func () : OQL.Entity.Decl {
                let bpa0 = OQL.Entity.manual<(Text, Text)>(
                    "bossPortalAssignments",
                    func () = bossPortalAssignments.entries(),
                    "BossPortalAssignment",
                    "portalId",
                );
                let bpa1 = OQL.Entity.payload(bpa0, "portalId", func ((k, _)) = k, OQL.TextValue._toRow);
                let bpa2 = OQL.Entity.payload(bpa1, "bossId",    func ((_, v)) = v, OQL.TextValue._toRow);
                let bpa3 = OQL.Entity.controllerOnly(bpa2);
                OQL.Entity.build(bpa3)
            })(),
            // bossRushStates : Map<Text, BossRushState> — keyed by "principalText#slot".
            // Per-player rows: each signed-in user reads only their own boss-rush state.
            (func () : OQL.Entity.Decl {
                let brs0 = OQL.Entity.manual<(Text, BossRushState)>(
                    "bossRushStates",
                    func () = bossRushStates.entries(),
                    "BossRushState",
                    "key",
                );
                let brs1 = OQL.Entity.payload(brs0, "key", func ((k, _)) = k, OQL.TextValue._toRow);
                let brs2 = OQL.Entity.payload(brs1, "owner", func ((k, _)) =
                    switch (k.split(#char '#').next()) {
                        case null "";
                        case (?s) s;
                    }, OQL.TextValue._toRow);
                let brs3 = OQL.Entity.payload(brs2, "currentRoom",          func ((_, s)) = s.currentRoom, OQL.NatValue._toRow);
                let brs4 = OQL.Entity.payload(brs3, "highestRoomCompleted",  func ((_, s)) = s.highestRoomCompleted, OQL.NatValue._toRow);
                let brs5 = OQL.Entity.payload(brs4, "totalBossRushRuns",     func ((_, s)) = s.totalBossRushRuns, OQL.NatValue._toRow);
                let brs6 = OQL.Entity.ownedBy(brs5, "owner");
                let brs7 = OQL.Entity.controllerOrScoped(brs6);
                OQL.Entity.build(brs7)
            })(),
        ];
    });
    // ─── end OQL block ───────────────────────────────────────────────────

};
