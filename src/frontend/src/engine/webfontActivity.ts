/**
 * Landing HTML Google Fonts. JetBrains Mono is already self-hosted
 * (`index.css` @font-face). Share Tech Mono was requested from Google but
 * never referenced (`--font-mono` is JetBrains). PERF-2026-09-29-133.
 *
 * Distinct from decorative canvas/CSS pause (058/074/121/126) and from
 * unused-weight trimming (134).
 */

export const GOOGLE_FONTS_CSS_ORIGIN = "https://fonts.googleapis.com";
export const GOOGLE_FONTS_FILE_ORIGIN = "https://fonts.gstatic.com";

/** Canonical stylesheet (no unused Share Tech Mono). */
export const GOOGLE_FONTS_STYLESHEET_HREF =
  "https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Saira:wght@300;400;500;600;700&display=swap";

export function shouldLoadShareTechMono(): boolean {
  return false;
}

export function googleFontsStylesheetIncludesFamily(
  href: string,
  familyQuery: string,
): boolean {
  return href.includes(familyQuery);
}

export function googleFontsPreconnectOrigins(): readonly string[] {
  return [GOOGLE_FONTS_CSS_ORIGIN, GOOGLE_FONTS_FILE_ORIGIN];
}
