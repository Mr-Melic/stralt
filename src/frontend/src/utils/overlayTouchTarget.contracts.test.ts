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

describe("shadcn overlay and chrome touch targets", () => {
  it("keeps ToggleGroup default and lg items at the DESIGN.md 44px floor", () => {
    const src = readUi("toggle-group.tsx");
    const item = src.slice(
      src.indexOf("function ToggleGroupItem"),
      src.indexOf("export { ToggleGroup"),
    );
    assert.match(item, /itemSize === "sm"/);
    assert.match(item, /min-h-\[44px\]/);
    assert.match(item, /min-w-\[44px\]/);
    assert.doesNotMatch(item, /itemSize === "sm" \? "min-h-\[44px\]/);
  });

  it("keeps BreadcrumbLink and BreadcrumbEllipsis at the DESIGN.md 44px floor", () => {
    const src = readUi("breadcrumb.tsx");
    const link = src.slice(
      src.indexOf("function BreadcrumbLink"),
      src.indexOf("function BreadcrumbPage"),
    );
    const ellipsis = src.slice(src.indexOf("function BreadcrumbEllipsis"));
    assert.match(link, /min-h-\[44px\]/);
    assert.match(link, /min-w-\[44px\]/);
    assert.match(ellipsis, /min-h-\[44px\]/);
    assert.match(ellipsis, /min-w-\[44px\]/);
  });

  it("keeps ResizableHandle hit slop at 44px without thickening the visible rule", () => {
    const src = readUi("resizable.tsx");
    const handle = src.slice(src.indexOf("function ResizableHandle"));
    assert.match(handle, /after:w-11/);
    assert.match(handle, /after:h-11/);
    assert.match(handle, /flex w-px /);
    assert.doesNotMatch(handle, /after:w-1[^-1]/);
  });

  it("caps Drawer height at 100dvh and pads the inset safe-area edge", () => {
    const src = readUi("drawer.tsx");
    const content = src.slice(
      src.indexOf("function DrawerContent"),
      src.indexOf("function DrawerHeader"),
    );
    assert.match(content, /max-h-\[min\(80vh,100dvh\)\]/);
    assert.match(content, /pt-\[env\(safe-area-inset-top,0px\)\]/);
    assert.match(content, /pb-\[env\(safe-area-inset-bottom,0px\)\]/);
    assert.match(content, /pr-\[env\(safe-area-inset-right,0px\)\]/);
    assert.match(content, /pl-\[env\(safe-area-inset-left,0px\)\]/);
  });
});
