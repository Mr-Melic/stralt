/**
 * Live canister publishes that still used a one-click gold Btn after #470.
 * Intercepted in AdminDashboard Btn (PREFIX did not touch Btn) so Tiers /
 * LevelUp / Palette / GameConfig confirms restack without overlapping #470 hunks.
 */
import {
  adminGameConfigSaveConfirmBody,
  adminLevelUpSaveConfirmBody,
  adminPaletteSaveConfirmBody,
  adminTierSaveConfirmBody,
} from "./adminOwnerUx.livePublish.ts";

export type AdminLivePublishSpec = {
  title: string;
  body: string;
  confirmLabel: string;
  ocidPrefix: string;
};

const LIVE_PUBLISH: Record<string, AdminLivePublishSpec> = {
  "admin.tier.save_button": {
    title: "Publish live tier spawn mix?",
    body: adminTierSaveConfirmBody(),
    confirmLabel: "Publish live",
    ocidPrefix: "admin.tier.publish",
  },
  "admin.levelup.save_button": {
    title: "Publish live level-up config?",
    body: adminLevelUpSaveConfirmBody(),
    confirmLabel: "Publish live",
    ocidPrefix: "admin.levelup.publish",
  },
  "admin.visuals.save_button": {
    title: "Publish live palette?",
    body: adminPaletteSaveConfirmBody(),
    confirmLabel: "Publish live",
    ocidPrefix: "admin.visuals.publish",
  },
  "admin.doka.save_config_button": {
    title: "Publish live ground Doka config?",
    body: adminGameConfigSaveConfirmBody(),
    confirmLabel: "Publish live",
    ocidPrefix: "admin.doka.publish",
  },
};

export function adminLivePublishSpec(
  ocid: string | undefined,
): AdminLivePublishSpec | null {
  if (!ocid) return null;
  return LIVE_PUBLISH[ocid] ?? null;
}
