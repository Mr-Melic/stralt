// Migration: passthrough for `characterSlots`.
// The previously deployed canister already added `spellBarOrder : ?[Text]` to
// each Character record, so the deployed stable signature includes it. This
// migration's OldActor mirrors that deployed signature (OldCharacter includes
// spellBarOrder) and passes characterSlots through unchanged on upgrade.
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

  // Old Character — already includes spellBarOrder (the previously deployed
  // canister added this field, so the deployed stable signature has it).
  // The migration's OldActor must match the deployed signature exactly.
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
    spellBarOrder : ?[Text];
    bossRushMasterComplete : ?Bool;
  };

  // New Character — identical shape to Old (spellBarOrder already present).
  type NewCharacter = OldCharacter;

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

  // Pass characterSlots through unchanged (spellBarOrder already present).
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

  // spellBarOrder already exists in the deployed Character; pass through unchanged.
  func migrateSlot(slot : OldCharacterSlot) : NewCharacterSlot {
    slot;
  };
};
