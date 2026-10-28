/**
 * HUD layout persist after APP_VERSION wipe (SDEG-2026-10-28-001).
 *
 * `userProfiles.uiLayout` is the canister blob (`saveUserUiLayout` /
 * `getUserUiLayout`). The live cache is `pbv_panel_layout_${userId}`
 * (`DraggablePanel.tsx` 23 / 45–68 / 80–86). `shouldPreserveVersionGateKey`
 * keeps only spawn / level-up / `*_inventory`, so `App.tsx` 297–317
 * `localStorage.clear()` drops the HUD cache.
 *
 * `saveLayoutToBackend` JSON.stringifies whatever is currently in that
 * cache (full replace, no schemaVersion, no merge with the canister blob).
 * After a wipe the cache is `{}`. The first fold/drag (`handleFoldToggle`
 * / drag end, 1.5s debounce) writes a one-panel object and overwrites a
 * newer full layout on the principal.
 *
 * Distinct from 10-25-003 (display-name cache poison while a blob exists)
 * and 09-29-003 (ProfileSetup `uiLayout:""` full-replace). Challenge panel
 * uses a separate local-only key (`pbv_panel_layout_challenge_`) that is
 * also dropped; it cannot clobber the canister blob. Sound / chat prefs
 * are the same keep-list gap without a canister SoT.
 *
 * Wire DraggablePanel / versionGate on later vehicles (#429 / #508). Do
 * not add a required Character HUD field. Do not edit those files here.
 */

export const HEAD_UI_LAYOUT_PREFIX = "pbv_panel_layout_";
export const HEAD_CHALLENGE_LAYOUT_PREFIX = "pbv_panel_layout_challenge_";
export const HEAD_SOUND_VOLUME_KEY = "pbv_sound_volume";
export const HEAD_SOUND_MUTE_KEY = "pbv_sound_muted";
export const HEAD_CHAT_WIDTH_KEY = "aestralto-chat-width";
export const HEAD_CHAT_CHANNELS_KEY = "aestralto-chat-channels";
export const UI_LAYOUT_SCHEMA_VERSION = 1;

export type UiLayoutPanelState = {
  x: number;
  y: number;
  folded: boolean;
};

export type UiLayoutMap = Record<string, UiLayoutPanelState>;

export type UiLayoutBlobV1 = {
  schemaVersion: typeof UI_LAYOUT_SCHEMA_VERSION;
  panels: UiLayoutMap;
};

/** HEAD keep-list does not preserve HUD / sound / chat keys. */
export function headVersionGateDropsUiLayoutCache(key: string): boolean {
  return (
    key.startsWith(HEAD_UI_LAYOUT_PREFIX) ||
    key === HEAD_SOUND_VOLUME_KEY ||
    key === HEAD_SOUND_MUTE_KEY ||
    key === HEAD_CHAT_WIDTH_KEY ||
    key === HEAD_CHAT_CHANNELS_KEY
  );
}

export function shouldPreserveUiLayoutVersionGateKey(key: string): boolean {
  return headVersionGateDropsUiLayoutCache(key);
}

/**
 * A local cache that has not been reconciled with getUserUiLayout must
 * not call saveUserUiLayout. Empty and one-panel post-wipe caches are
 * both unsafe replacements of a newer blob.
 */
export function shouldSaveLocalUiLayoutToBackend(args: {
  localPanelCount: number;
  backendBlobPresent: boolean;
  hydratedFromBackend: boolean;
}): boolean {
  if (!args.hydratedFromBackend && args.backendBlobPresent) return false;
  if (args.localPanelCount <= 0) return false;
  return true;
}

/**
 * Union local writes onto the last known backend map. Keep panel ids the
 * current client does not mount so a stale frontend cannot drop newer
 * keys. Local wins on ids it actually wrote.
 */
export function mergeUiLayoutForBackendSave(
  local: UiLayoutMap,
  backend: UiLayoutMap,
): UiLayoutMap {
  const out: UiLayoutMap = { ...backend };
  for (const [id, state] of Object.entries(local)) {
    if (!id) continue;
    out[id] = state;
  }
  return out;
}

export function serializeUiLayoutBlob(panels: UiLayoutMap): string {
  const blob: UiLayoutBlobV1 = {
    schemaVersion: UI_LAYOUT_SCHEMA_VERSION,
    panels,
  };
  return JSON.stringify(blob);
}

/**
 * Accept HEAD compact `{id:{x,y,folded}}` and v1 `{schemaVersion,panels}`.
 * Unknown extra keys on a panel are ignored; missing folded drops that
 * panel only, not the rest of the blob.
 */
export function parseUiLayoutBlob(raw: string): UiLayoutMap | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    const rec = parsed as Record<string, unknown>;
    const source =
      rec.schemaVersion === UI_LAYOUT_SCHEMA_VERSION &&
      rec.panels != null &&
      typeof rec.panels === "object" &&
      !Array.isArray(rec.panels)
        ? (rec.panels as Record<string, unknown>)
        : rec;
    const out: UiLayoutMap = {};
    for (const [id, entry] of Object.entries(source)) {
      if (id === "schemaVersion" || id === "panels") continue;
      if (entry == null || typeof entry !== "object" || Array.isArray(entry)) {
        continue;
      }
      const e = entry as Record<string, unknown>;
      if (
        typeof e.x !== "number" ||
        typeof e.y !== "number" ||
        typeof e.folded !== "boolean"
      ) {
        continue;
      }
      out[id] = { x: e.x, y: e.y, folded: e.folded };
    }
    return Object.keys(out).length > 0 ? out : null;
  } catch {
    return null;
  }
}

export function emptyLocalLayoutWouldClobberBackendBlob(): boolean {
  return true;
}
