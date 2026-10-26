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

describe("shadcn kit touch targets and overscroll", () => {
  it("keeps CollapsibleTrigger at the DESIGN.md 44px floor", () => {
    const src = readUi("collapsible.tsx");
    const trigger = src.slice(
      src.indexOf("function CollapsibleTrigger"),
      src.indexOf("function CollapsibleContent"),
    );
    assert.match(trigger, /min-h-\[44px\]/);
    assert.match(trigger, /min-w-\[44px\]/);
  });

  it("keeps ScrollBar hit slop at 44px and contains viewport overscroll", () => {
    const src = readUi("scroll-area.tsx");
    const viewport = src.slice(
      src.indexOf("ScrollAreaPrimitive.Viewport"),
      src.indexOf("<ScrollBar"),
    );
    const bar = src.slice(src.indexOf("function ScrollBar"));
    assert.match(viewport, /overscroll-contain/);
    assert.match(bar, /touch-none/);
    assert.match(bar, /w-11/);
    assert.match(bar, /h-11/);
    assert.match(bar, /p-\[17px\]/);
    assert.doesNotMatch(bar, /w-2\.5/);
    assert.doesNotMatch(bar, /h-2\.5/);
  });

  it("caps Popover height at 100dvh and contains overscroll", () => {
    const src = readUi("popover.tsx");
    const content = src.slice(
      src.indexOf("function PopoverContent"),
      src.indexOf("function PopoverAnchor"),
    );
    assert.match(content, /max-h-\[min\(80vh,100dvh\)\]/);
    assert.match(content, /overflow-y-auto/);
    assert.match(content, /overscroll-contain/);
  });

  it("contains Table horizontal overscroll without raising dense rows", () => {
    const src = readUi("table.tsx");
    const table = src.slice(
      src.indexOf("function Table("),
      src.indexOf("function TableHeader"),
    );
    assert.match(table, /overflow-x-auto/);
    assert.match(table, /overscroll-x-contain/);
    assert.doesNotMatch(src, /min-h-\[44px\]/);
  });

  it("keeps SidebarRail hit slop at 44px without thickening the 2px rule", () => {
    const src = readUi("sidebar.tsx");
    const rail = src.slice(
      src.indexOf("function SidebarRail"),
      src.indexOf("function SidebarInset"),
    );
    assert.match(rail, /hidden w-11 /);
    assert.match(rail, /after:w-\[2px\]/);
    assert.doesNotMatch(rail, /hidden w-4 /);
  });
});
