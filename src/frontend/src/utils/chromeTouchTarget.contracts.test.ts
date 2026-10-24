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

describe("shadcn chrome touch targets", () => {
  it("keeps Toggle default and lg at the DESIGN.md 44px floor", () => {
    const src = readUi("toggle.tsx");
    const sizes = src.slice(
      src.indexOf("size: {"),
      src.indexOf("defaultVariants"),
    );
    assert.match(sizes, /default: "h-9 px-2 min-h-\[44px\] min-w-\[44px\]"/);
    assert.match(sizes, /lg: "h-10 px-2.5 min-h-\[44px\] min-w-\[44px\]"/);
    assert.match(sizes, /sm: "h-8 px-1.5 min-w-8"/);
    assert.doesNotMatch(sizes, /sm:.*min-h-\[44px\]/);
  });

  it("keeps AccordionTrigger at the DESIGN.md 44px floor", () => {
    const src = readUi("accordion.tsx");
    const trigger = src.slice(
      src.indexOf("function AccordionTrigger"),
      src.indexOf("function AccordionContent"),
    );
    assert.match(trigger, /min-h-\[44px\]/);
    assert.match(trigger, /min-w-\[44px\]/);
  });

  it("keeps CommandInput wrapper at the DESIGN.md 44px floor", () => {
    const src = readUi("command.tsx");
    const input = src.slice(
      src.indexOf("function CommandInput"),
      src.indexOf("function CommandList"),
    );
    assert.match(input, /min-h-\[44px\]/);
  });

  it("keeps NavigationMenu trigger at the DESIGN.md 44px floor", () => {
    const src = readUi("navigation-menu.tsx");
    const triggerStyle = src.slice(
      src.indexOf("const navigationMenuTriggerStyle"),
      src.indexOf("function NavigationMenuTrigger"),
    );
    assert.match(triggerStyle, /min-h-\[44px\]/);
    assert.match(triggerStyle, /min-w-\[44px\]/);
  });

  it("keeps Menubar bar and triggers at the DESIGN.md 44px floor", () => {
    const src = readUi("menubar.tsx");
    const bar = src.slice(
      src.indexOf("function Menubar("),
      src.indexOf("function MenubarMenu"),
    );
    const trigger = src.slice(
      src.indexOf("function MenubarTrigger"),
      src.indexOf("function MenubarContent"),
    );
    assert.match(bar, /min-h-\[44px\]/);
    assert.match(trigger, /min-h-\[44px\]/);
    assert.match(trigger, /min-w-\[44px\]/);
  });
});
