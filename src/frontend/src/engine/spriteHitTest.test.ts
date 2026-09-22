import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHARACTER_Y_OFFSET } from "../data/gameConstants.ts";
import {
  PLAYER_SPRITE_DRAW_ORDER,
  SPRITE_HIT_BOX_HEIGHT_MULT,
  SPRITE_HIT_PADDING_MOUSE,
  SPRITE_HIT_PADDING_TOUCH,
  type SpriteHitRect,
  hitTestSprite,
  makeSpriteHitRect,
  pointHitsSpriteRect,
} from "./spriteHitTest.ts";

function rect(
  partial: Partial<SpriteHitRect> & Pick<SpriteHitRect, "id">,
): SpriteHitRect {
  return {
    x: 0,
    y: 0,
    w: 40,
    h: 40,
    drawOrder: 1,
    kind: "enemy",
    logicalX: 0,
    logicalY: 0,
    isAlive: true,
    drawAnchor: { x: 0, y: 0 },
    drawSize: { w: 40, h: 40 },
    ...partial,
  };
}

describe("sprite hit padding constants", () => {
  it("keeps mouse 10px and touch 14px (do not unify)", () => {
    assert.equal(SPRITE_HIT_PADDING_MOUSE, 10);
    assert.equal(SPRITE_HIT_PADDING_TOUCH, 14);
    assert.ok(SPRITE_HIT_PADDING_TOUCH > SPRITE_HIT_PADDING_MOUSE);
  });

  it("keeps the player overlap order above ordinary depths", () => {
    assert.equal(PLAYER_SPRITE_DRAW_ORDER, 99999);
  });
});

describe("pointHitsSpriteRect", () => {
  const box = { x: 100, y: 50, w: 20, h: 10 };

  it("includes the raw edges at padding 0 (geometry overlay)", () => {
    assert.equal(pointHitsSpriteRect(box, 100, 50, 0), true);
    assert.equal(pointHitsSpriteRect(box, 120, 60, 0), true);
    assert.equal(pointHitsSpriteRect(box, 99, 50, 0), false);
    assert.equal(pointHitsSpriteRect(box, 121, 55, 0), false);
  });

  it("expands by padding so a near-miss still hits", () => {
    assert.equal(
      pointHitsSpriteRect(box, 90, 50, SPRITE_HIT_PADDING_MOUSE),
      true,
    );
    assert.equal(
      pointHitsSpriteRect(box, 89, 50, SPRITE_HIT_PADDING_MOUSE),
      false,
    );
  });
});

describe("hitTestSprite", () => {
  it("returns null when nothing is registered", () => {
    assert.equal(hitTestSprite([], 10, 10, SPRITE_HIT_PADDING_MOUSE), null);
  });

  it("skips dead sprites even when the point is inside", () => {
    const dead = rect({
      id: "corpse",
      x: 0,
      y: 0,
      w: 40,
      h: 40,
      isAlive: false,
    });
    assert.equal(hitTestSprite([dead], 10, 10, SPRITE_HIT_PADDING_MOUSE), null);
  });

  it("returns the living sprite that contains the point", () => {
    const a = rect({ id: "a", x: 0, y: 0, w: 20, h: 20, drawOrder: 1 });
    const b = rect({ id: "b", x: 100, y: 100, w: 20, h: 20, drawOrder: 9 });
    const hit = hitTestSprite([a, b], 5, 5, 0);
    assert.equal(hit?.id, "a");
  });

  it("lets touch padding hit a miss that mouse padding rejects", () => {
    const body = rect({ id: "goblin", x: 0, y: 0, w: 20, h: 20 });
    // 12px past the right edge: inside 14, outside 10.
    const canvasX = 20 + 12;
    const canvasY = 10;
    assert.equal(
      hitTestSprite([body], canvasX, canvasY, SPRITE_HIT_PADDING_MOUSE),
      null,
    );
    assert.equal(
      hitTestSprite([body], canvasX, canvasY, SPRITE_HIT_PADDING_TOUCH)?.id,
      "goblin",
    );
  });

  it("picks the highest drawOrder on overlap", () => {
    const back = rect({
      id: "back",
      x: 0,
      y: 0,
      w: 40,
      h: 40,
      drawOrder: 2,
    });
    const front = rect({
      id: "front",
      x: 0,
      y: 10,
      w: 40,
      h: 40,
      drawOrder: 5,
    });
    assert.equal(hitTestSprite([back, front], 10, 15, 0)?.id, "front");
    assert.equal(hitTestSprite([front, back], 10, 15, 0)?.id, "front");
  });

  it("tiebreaks equal drawOrder with the lower y (topmost on screen)", () => {
    const lower = rect({
      id: "lower",
      x: 0,
      y: 20,
      w: 40,
      h: 40,
      drawOrder: 3,
    });
    const upper = rect({
      id: "upper",
      x: 0,
      y: 5,
      w: 40,
      h: 40,
      drawOrder: 3,
    });
    assert.equal(hitTestSprite([lower, upper], 10, 22, 0)?.id, "upper");
  });

  it("keeps the first iterated entry when drawOrder and y both tie", () => {
    const first = rect({
      id: "first",
      x: 0,
      y: 8,
      w: 40,
      h: 40,
      drawOrder: 4,
    });
    const second = rect({
      id: "second",
      x: 0,
      y: 8,
      w: 40,
      h: 40,
      drawOrder: 4,
    });
    assert.equal(hitTestSprite([first, second], 10, 10, 0)?.id, "first");
  });

  it("returns the same object reference the caller registered", () => {
    const goblin = rect({ id: "goblin", x: 0, y: 0, w: 20, h: 20 });
    assert.equal(hitTestSprite([goblin], 5, 5, 0), goblin);
  });
});

describe("makeSpriteHitRect", () => {
  it("matches the WX player/enemy recording formula", () => {
    const made = makeSpriteHitRect({
      screenX: 100,
      screenY: 200,
      tileW: 80,
      tileH: 40,
      characterYOffset: CHARACTER_Y_OFFSET,
      drawOrder: PLAYER_SPRITE_DRAW_ORDER,
      id: "player",
      kind: "player",
      logicalX: 8,
      logicalY: 8,
      isAlive: true,
    });
    const srW = 80;
    const srH = 40 * SPRITE_HIT_BOX_HEIGHT_MULT;
    assert.equal(CHARACTER_Y_OFFSET, -9);
    assert.equal(srH, 60);
    assert.equal(made.x, 100 - srW / 2);
    assert.equal(made.y, 200 - CHARACTER_Y_OFFSET - srH / 2);
    assert.equal(made.w, srW);
    assert.equal(made.h, 40 / 2 + CHARACTER_Y_OFFSET + srH / 2);
    assert.deepEqual(made.drawAnchor, {
      x: 100,
      y: 200 - CHARACTER_Y_OFFSET,
    });
    assert.deepEqual(made.drawSize, { w: 80, h: srH });
    assert.equal(made.drawOrder, PLAYER_SPRITE_DRAW_ORDER);
    assert.equal(made.logicalX, 8);
    assert.equal(made.logicalY, 8);
  });

  it("uses the same box for an enemy as for the player at the same screen pos", () => {
    const shared = {
      screenX: 40,
      screenY: 80,
      tileW: 80,
      tileH: 40,
      characterYOffset: CHARACTER_Y_OFFSET,
      logicalX: 3,
      logicalY: 4,
      isAlive: true,
    };
    const player = makeSpriteHitRect({
      ...shared,
      drawOrder: PLAYER_SPRITE_DRAW_ORDER,
      id: "player",
      kind: "player",
    });
    const enemy = makeSpriteHitRect({
      ...shared,
      drawOrder: 12,
      id: "enemy-1",
      kind: "enemy",
    });
    assert.equal(player.x, enemy.x);
    assert.equal(player.y, enemy.y);
    assert.equal(player.w, enemy.w);
    assert.equal(player.h, enemy.h);
    assert.deepEqual(player.drawAnchor, enemy.drawAnchor);
    assert.deepEqual(player.drawSize, enemy.drawSize);
    assert.notEqual(player.drawOrder, enemy.drawOrder);
  });
});
