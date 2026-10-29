/**
 * Several owner readers swallow actor failures and keep looking live:
 * - `useGetGameConfig` catch returns hardcoded 10/40/5 as query success
 *   (`useAdminQueries.ts` ~239–244). Save Config then publishes those.
 * - LevelUpConfigPanel `getLevelUpConfig` catch keeps pbv_levelup_config
 *   with no banner (`AdminDashboard.tsx` ~4391–4392).
 * - Boss Rush `getBossRushConfig` catch console.errors and keeps
 *   bossRushConfig localStorage (`AdminDashboard.tsx` ~5451–5453).
 *
 * Distinct from Tiers/Visuals never calling the canister
 * (AUX-TIER-NO-CANISTER-HYDRATE / AUX-VISUALS-NO-CANISTER-HYDRATE, #945)
 * and from ad empty-after-ok (valid hidden default, #1223).
 *
 * Unique 2026-10-29 file — do not merge into adminOwnerUx.configHydrate.ts
 * (#945) or adminOwnerUx.adHydrate.ts (#1223). Not wired (stack).
 */

export type OwnerSwallowedHydrateKind = "live" | "load-failed";

export function ownerSwallowedHydrateKind(args: {
  fetchOk: boolean;
}): OwnerSwallowedHydrateKind {
  return args.fetchOk ? "live" : "load-failed";
}

export function ownerSwallowedHydrateCopy(
  kind: OwnerSwallowedHydrateKind,
  surface: string,
): string {
  if (kind === "load-failed") {
    return `Failed to load live ${surface} — values below are not canister-live. Do not Save.`;
  }
  return `Live canister ${surface}`;
}

export function shouldDisableOwnerSwallowedPublish(
  kind: OwnerSwallowedHydrateKind,
): boolean {
  return kind === "load-failed";
}

export function ownerGameConfigCatchLooksLiveOnMain(): true {
  return true;
}
