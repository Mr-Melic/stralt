import Map "mo:core/Map";

module {

  // Seed explicit summon metadata onto persisted admin SpellConfig rows.
  // Inlined types stay frozen if project types change later.

  type OldSpellConfig = {
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
    cooldown : Nat;
  };

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

  type OldActor = {
    spellConfigs : Map.Map<Text, OldSpellConfig>;
  };

  type NewActor = {
    spellConfigs : Map.Map<Text, SpellConfig>;
  };

  public func migration(old : OldActor) : NewActor {
    {
      spellConfigs = old.spellConfigs.map(
        func(_, s : OldSpellConfig) : SpellConfig {
          {
            s with
            isSummon = false;
            summonAI = "";
            summonLifespan = 0;
            summonUnitDef = {
              pieceType = "";
              level = 0;
              hpScale = 0.0;
              damageScale = 0.0;
            };
          }
        }
      );
    };
  };
};
