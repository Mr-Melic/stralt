import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

function readUi(name: string): string {
  return readFileSync(
    fileURLToPath(new URL(`../components/ui/${name}`, import.meta.url)),
    "utf8",
  );
}

const HIT_SLOP = /after:size-11/;
const HIT_SLOP_CONTENT = /after:content-\[''\]/;

describe("shadcn glyph 44px hit slop", () => {
  it("keeps Checkbox at size-4 and expands the hit area to 44px", () => {
    const src = readUi("checkbox.tsx");
    const root = src.slice(
      src.indexOf("CheckboxPrimitive.Root"),
      src.indexOf("CheckboxPrimitive.Indicator"),
    );
    assert.match(root, /size-4/);
    assert.match(root, HIT_SLOP);
    assert.match(root, HIT_SLOP_CONTENT);
    assert.match(root, /touch-manipulation/);
    assert.doesNotMatch(root, /min-h-\[44px\]/);
  });

  it("keeps Switch track compact and expands the hit area to 44px", () => {
    const src = readUi("switch.tsx");
    const root = src.slice(
      src.indexOf("SwitchPrimitive.Root"),
      src.indexOf("SwitchPrimitive.Thumb"),
    );
    assert.match(root, /h-\[1\.15rem\]/);
    assert.match(root, /w-8\b/);
    assert.match(root, HIT_SLOP);
    assert.match(root, HIT_SLOP_CONTENT);
    assert.match(root, /touch-manipulation/);
    assert.doesNotMatch(root, /h-11\b/);
    assert.doesNotMatch(root, /min-h-\[44px\]/);
  });

  it("keeps RadioGroupItem at size-4 and expands the hit area to 44px", () => {
    const src = readUi("radio-group.tsx");
    const item = src.slice(
      src.indexOf("function RadioGroupItem"),
      src.indexOf("RadioGroupPrimitive.Indicator"),
    );
    assert.match(item, /size-4/);
    assert.match(item, HIT_SLOP);
    assert.match(item, HIT_SLOP_CONTENT);
    assert.match(item, /touch-manipulation/);
    assert.doesNotMatch(item, /min-h-\[44px\]/);
  });

  it("keeps Slider thumb at size-4 and expands the hit area to 44px", () => {
    const src = readUi("slider.tsx");
    const thumb = src.slice(src.indexOf("SliderPrimitive.Thumb"));
    assert.match(thumb, /size-4/);
    assert.match(thumb, HIT_SLOP);
    assert.match(thumb, HIT_SLOP_CONTENT);
    assert.doesNotMatch(thumb, /min-h-\[44px\]/);
    assert.match(src, /touch-none/);
  });

  it("raises Badge only when it is an interactive link or button", () => {
    const src = readUi("badge.tsx");
    const variants = src.slice(
      src.indexOf("const badgeVariants"),
      src.indexOf("function Badge"),
    );
    assert.match(variants, /\[a&\]:min-h-11/);
    assert.match(variants, /\[a&\]:min-w-11/);
    assert.match(variants, /\[button&\]:min-h-11/);
    assert.match(variants, /\[button&\]:min-w-11/);
    assert.match(variants, /\[a&\]:touch-manipulation/);
    assert.doesNotMatch(variants, /min-h-\[44px\]/);
  });
});
