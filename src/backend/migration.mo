// Migration: add `spellBarOrder : ?[Text]` to each Character record.
// Old characters (saved before this field existed) get spellBarOrder = null,
// which the load path treats as "derive default order once and persist".
//
// Only `characterSlots` is consumed/produced here; all other actor fields are
// inherited from the previous actor version (see migrating-motoko-actors skill:
// "If it is neither consumed nor produced, it is inherited").
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // CharacterStats is unchanged across this migration.
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

  // Old Character — no spellBarOrder.
  type OldCharacter = {
    name : Text;
    pieceType : Text;
    level : Nat;
    experience : Nat;
    stats : CharacterStats;
    pixelPattern : Text;
    colors : [Text];
    rotation : Nat;
    spellLevelKeys : [Text];
    spellLevelValues : [Nat];
    bloodBalance : ?Nat;
    covenantBuff : ?Text;
    shrineCount : ?Nat;
    activeSpells : ?[Nat];
    bossRushMasterComplete : ?Bool;
  };

  // New Character — adds spellBarOrder : ?[Text].
  type NewCharacter = OldCharacter and { spellBarOrder : ?[Text] };

  type OldCharacterSlot = ?OldCharacter;
  type NewCharacterSlot = ?NewCharacter;

  type OldCharacterSlots = {
    slot1 : OldCharacterSlot;
    slot2 : OldCharacterSlot;
    slot3 : OldCharacterSlot;
  };

  type NewCharacterSlots = {
    slot1 : NewCharacterSlot;
    slot2 : NewCharacterSlot;
    slot3 : NewCharacterSlot;
  };

  type OldActor = {
    characterSlots : Map.Map<Principal, OldCharacterSlots>;
  };

  type NewActor = {
    characterSlots : Map.Map<Principal, NewCharacterSlots>;
  };

  // Add spellBarOrder = null to each present Character in each slot.
  public func run(old : OldActor) : NewActor {
    let characterSlots = old.characterSlots.map<Principal, OldCharacterSlots, NewCharacterSlots>(
      func(_p, slots) {
        {
          slot1 = migrateSlot(slots.slot1);
          slot2 = migrateSlot(slots.slot2);
          slot3 = migrateSlot(slots.slot3);
        };
      }
    );
    { characterSlots };
  };

  func migrateSlot(slot : OldCharacterSlot) : NewCharacterSlot {
    switch (slot) {
      case null null;
      case (?c) ?({ c with spellBarOrder = null : ?[Text] });
    };
  };
};
