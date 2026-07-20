// Migration: add `uiLayout : Text` to UserProfile.
//
// The previous UserProfile was `{ name : Text }`; the new one adds a required
// `uiLayout : Text` field (compact JSON blob for the caller's full panel
// layout, default empty string). This is a non-breaking migration: every
// existing userProfiles entry is rewritten with uiLayout = "".
//
// Only `userProfiles` is consumed/produced here — every other stable field of
// the actor is neither consumed nor produced, so it is inherited unchanged
// from the previous canister version (per the migrating-motoko-actors skill).
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // Old UserProfile shape (copied inline from the previous version — do NOT
  // import from .old/ paths, which are not resolvable in the sandboxed build).
  type OldUserProfile = {
    name : Text;
  };

  // New UserProfile shape — matches the `public type UserProfile` in main.mo.
  type NewUserProfile = {
    name : Text;
    uiLayout : Text;
  };

  // Only the stable field whose type changed is listed; all other stable
  // fields are inherited automatically.
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let userProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, profile) {
        { profile with uiLayout = "" };
      }
    );
    { userProfiles };
  };
};
