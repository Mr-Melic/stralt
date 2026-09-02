module {

  // Name-only step. PR #259 (main from 2026-09-02 06:15 UTC to 06:59 UTC) shipped
  // a `20260901_000000` migration that introduced the GameKey maps on top of a
  // 20260831 tail *without* them. On the live Caffeine canister
  // (zh6cg-aaaaa-aaaad-aar2q-cai) the applied 20260831 already carried GameKey
  // (PR #258 build), so that step collided and every deploy trapped. GameKey now
  // lives on 20260831_000000 again, matching the deployed shape.
  //
  // This no-op keeps the name in the chain so a canister that fresh-installed a
  // #259..#309 build (latest applied = 20260901_000000, same field set) can
  // still be upgraded: the loader finds the name and loads the identical chain
  // state at this position. Do not add fields here.

  public func migration(_ : {}) : {} {
    {};
  };
};
