/**
 * What's New dismiss chrome. Display only — not wired into App.tsx.
 *
 * UX-CHANGELOG-PLAY-PREMATURE: dismiss CTA says "let me play" even when the
 * next screen is still ProfileSetup or champion forge.
 */

export const CHANGELOG_TITLE = (version: string): string =>
  `What changed in ${version}`;

export const CHANGELOG_LEAD =
  "Game updated — review these notes, then continue.";

/** Honest next-step CTA; host still owns ProfileSetup / selection routing. */
export const CHANGELOG_DISMISS_LABEL = "Got it — continue";
