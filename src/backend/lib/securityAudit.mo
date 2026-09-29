/// Unique 2026-09-29 security-audit clamps. Lives in its own module so
/// overlapping adminGuard.mo edits from older open PRs do not add/add.
module {
    /// Official UI never sends C0 / DEL / Unicode bidi overrides. A raw
    /// client used these to spoof chat names against the previous message.
    public func containsDisallowedControls(text : Text) : Bool {
        for (c in text.chars()) {
            let n = c.toNat32();
            if (n < (32 : Nat32)) {
                return true;
            };
            if (n == (0x7F : Nat32)) { return true };
            if (n == (0x202A : Nat32) or n == (0x202B : Nat32) or n == (0x202C : Nat32)
                or n == (0x202D : Nat32) or n == (0x202E : Nat32)
                or n == (0x2066 : Nat32) or n == (0x2067 : Nat32)
                or n == (0x2068 : Nat32) or n == (0x2069 : Nat32)) {
                return true;
            };
        };
        false
    };

    public func chatTextRejected(text : Text) : ?Text {
        if (containsDisallowedControls(text)) {
            ?"Message contains control characters"
        } else { null }
    };

    public func displayNameRejected(name : Text) : ?Text {
        if (containsDisallowedControls(name)) {
            ?"Name contains control characters"
        } else { null }
    };

    /// upgradeSpell cost doubles each level. Official play cannot afford
    /// level 99; the cap stops a minted-Doka raw client from growing Nat
    /// multipliers without changing intended grind.
    public let MAX_SPELL_LEVEL : Nat = 99;

    public func spellLevelCapRejected(currentLevel : Nat) : ?Text {
        if (currentLevel >= MAX_SPELL_LEVEL) {
            ?"Spell is already at maximum level"
        } else { null }
    };

    /// purchaseBuff used to increment without a bound. Official shop buys
    /// one stack at a time; 99 is above any intended loadout.
    public let MAX_BUFF_STACK : Nat = 99;

    public func buffStackRejected(quantity : Nat) : ?Text {
        if (quantity >= MAX_BUFF_STACK) {
            ?"Inventory stack is full"
        } else { null }
    };
};
