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

describe("shadcn overlay scroll contain", () => {
  it("caps HoverCard height at 100dvh and contains overscroll", () => {
    const src = readUi("hover-card.tsx");
    const content = src.slice(src.indexOf("function HoverCardContent"));
    assert.match(content, /max-h-\[min\(80vh,100dvh\)\]/);
    assert.match(content, /overflow-y-auto/);
    assert.match(content, /overscroll-contain/);
  });

  it("contains DropdownMenuContent overscroll without raising dense rows", () => {
    const src = readUi("dropdown-menu.tsx");
    const content = src.slice(
      src.indexOf("function DropdownMenuContent"),
      src.indexOf("function DropdownMenuGroup"),
    );
    assert.match(content, /overflow-y-auto/);
    assert.match(content, /overscroll-contain/);
    assert.doesNotMatch(src, /min-h-\[44px\]/);
  });

  it("contains ContextMenuContent overscroll without raising dense rows", () => {
    const src = readUi("context-menu.tsx");
    const content = src.slice(
      src.indexOf("function ContextMenuContent"),
      src.indexOf("function ContextMenuItem"),
    );
    assert.match(content, /overflow-y-auto/);
    assert.match(content, /overscroll-contain/);
    assert.doesNotMatch(src, /min-h-\[44px\]/);
  });

  it("caps Tooltip content at 100dvh and contains overscroll", () => {
    const src = readUi("tooltip.tsx");
    const content = src.slice(src.indexOf("function TooltipContent"));
    assert.match(content, /max-h-\[min\(80vh,100dvh\)\]/);
    assert.match(content, /overflow-y-auto/);
    assert.match(content, /overscroll-contain/);
  });
});
