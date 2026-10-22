import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

describe("shadcn touch targets", () => {
  it("keeps Button default, lg, and icon at the DESIGN.md 44px floor", () => {
    const src = readFileSync(
      fileURLToPath(new URL("../components/ui/button.tsx", import.meta.url)),
      "utf8",
    );
    const sizeBlock = src.slice(
      src.indexOf("size: {"),
      src.indexOf("defaultVariants"),
    );
    assert.match(
      sizeBlock,
      /default:[\s\S]*min-h-\[44px\][\s\S]*min-w-\[44px\]/,
    );
    assert.match(sizeBlock, /lg:[\s\S]*min-h-\[44px\][\s\S]*min-w-\[44px\]/);
    assert.match(sizeBlock, /icon:[\s\S]*min-h-\[44px\][\s\S]*min-w-\[44px\]/);
    assert.match(src, /cn\(buttonVariants\(\{ variant, size \}\), className\)/);
  });

  it("keeps carousel previous/next above the 32px size-8 override", () => {
    const src = readFileSync(
      fileURLToPath(new URL("../components/ui/carousel.tsx", import.meta.url)),
      "utf8",
    );
    const prev = src.slice(
      src.indexOf("function CarouselPrevious"),
      src.indexOf("function CarouselNext"),
    );
    const next = src.slice(src.indexOf("function CarouselNext"));
    assert.match(prev, /min-h-\[44px\]/);
    assert.match(prev, /min-w-\[44px\]/);
    assert.equal(prev.includes("size-8"), false);
    assert.match(next, /min-h-\[44px\]/);
    assert.match(next, /min-w-\[44px\]/);
    assert.equal(next.includes("size-8"), false);
  });

  it("keeps pagination links at the DESIGN.md 44px floor", () => {
    const src = readFileSync(
      fileURLToPath(
        new URL("../components/ui/pagination.tsx", import.meta.url),
      ),
      "utf8",
    );
    const link = src.slice(src.indexOf("function PaginationLink"));
    assert.match(link, /min-h-\[44px\]/);
    assert.match(link, /min-w-\[44px\]/);
  });
});
