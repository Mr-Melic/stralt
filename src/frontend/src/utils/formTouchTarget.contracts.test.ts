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

describe("shadcn form touch targets", () => {
  it("keeps Input at the DESIGN.md 44px floor", () => {
    const src = readUi("input.tsx");
    assert.match(src, /min-h-\[44px\]/);
    assert.match(src, /text-base/);
  });

  it("keeps Select default trigger, items, and scroll affordances at 44px", () => {
    const src = readUi("select.tsx");
    const trigger = src.slice(
      src.indexOf("function SelectTrigger"),
      src.indexOf("function SelectContent"),
    );
    const item = src.slice(
      src.indexOf("function SelectItem"),
      src.indexOf("function SelectSeparator"),
    );
    const scrollUp = src.slice(
      src.indexOf("function SelectScrollUpButton"),
      src.indexOf("function SelectScrollDownButton"),
    );
    const scrollDown = src.slice(
      src.indexOf("function SelectScrollDownButton"),
    );
    assert.match(trigger, /data-\[size=default\]:min-h-\[44px\]/);
    assert.match(trigger, /data-\[size=default\]:min-w-\[44px\]/);
    assert.match(item, /min-h-\[44px\]/);
    assert.match(scrollUp, /min-h-\[44px\]/);
    assert.match(scrollDown, /min-h-\[44px\]/);
  });

  it("keeps Tabs list and triggers at the DESIGN.md 44px floor", () => {
    const src = readUi("tabs.tsx");
    const list = src.slice(
      src.indexOf("function TabsList"),
      src.indexOf("function TabsTrigger"),
    );
    const trigger = src.slice(
      src.indexOf("function TabsTrigger"),
      src.indexOf("function TabsContent"),
    );
    assert.match(list, /min-h-\[44px\]/);
    assert.match(trigger, /min-h-\[44px\]/);
    assert.match(trigger, /min-w-\[44px\]/);
  });

  it("keeps InputOTP slots at the DESIGN.md 44px floor", () => {
    const src = readUi("input-otp.tsx");
    const slot = src.slice(src.indexOf("function InputOTPSlot"));
    assert.match(slot, /min-h-\[44px\]/);
    assert.match(slot, /min-w-\[44px\]/);
  });
});
