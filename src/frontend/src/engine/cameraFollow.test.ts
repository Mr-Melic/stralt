import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CAMERA_SMOOTHING_FACTOR } from "../data/gameConstants.ts";
import { cameraMaxVelocity, stepCameraFollow } from "./cameraFollow.ts";
import { getCameraFollowSpeed } from "./worldHelpers.ts";

describe("getCameraFollowSpeed", () => {
  it("is 0.35 on mobile regardless of width", () => {
    assert.equal(getCameraFollowSpeed(400, true), 0.35);
    assert.equal(getCameraFollowSpeed(1920, true), 0.35);
  });

  it("is 0.12 on medium non-mobile screens", () => {
    assert.equal(getCameraFollowSpeed(1199, false), 0.12);
    assert.equal(getCameraFollowSpeed(800, false), 0.12);
  });

  it("is 0.08 on large non-mobile screens", () => {
    assert.equal(getCameraFollowSpeed(1200, false), 0.08);
    assert.equal(getCameraFollowSpeed(1920, false), 0.08);
  });
});

describe("cameraMaxVelocity", () => {
  it("uses the WX canvas-width breakpoints", () => {
    assert.equal(cameraMaxVelocity(767), 8);
    assert.equal(cameraMaxVelocity(768), 6);
    assert.equal(cameraMaxVelocity(1199), 6);
    assert.equal(cameraMaxVelocity(1200), 4);
  });
});

describe("stepCameraFollow", () => {
  it("leaves the target unchanged inside the deadzone and does not rewrite velocity", () => {
    const next = stepCameraFollow({
      camera: { x: 10, y: -4 },
      velocity: { x: 1.5, y: -0.25 },
      playerScreen: { x: 403, y: 302 },
      canvasWidth: 800,
      canvasHeight: 600,
      deadzone: 8,
      maxOffset: 600,
      followSpeed: 0.35,
    });
    assert.equal(next.target, null);
    assert.deepEqual(next.velocity, { x: 1.5, y: -0.25 });
  });

  it("characterizes one mobile follow step from rest at canvas 800×600", () => {
    // Center (400, 300). Player 200px below. Distance 200 > deadzone 8.
    // desiredOffset = (0, -200). Speed 0.35. Smoothed target (0, -70).
    // Velocity from rest: (0, -10.5) then capped at 6 → (0, -6). Target (0, -6).
    const next = stepCameraFollow({
      camera: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      playerScreen: { x: 400, y: 500 },
      canvasWidth: 800,
      canvasHeight: 600,
      deadzone: 8,
      maxOffset: 600,
      followSpeed: 0.35,
    });
    assert.deepEqual(next.velocity, { x: 0, y: -6 });
    assert.deepEqual(next.target, { x: 0, y: -6 });
  });

  it("does not snap the target all the way to the desired offset in one step", () => {
    const next = stepCameraFollow({
      camera: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      playerScreen: { x: 400, y: 500 },
      canvasWidth: 800,
      canvasHeight: 600,
      deadzone: 8,
      maxOffset: 600,
      followSpeed: 0.35,
    });
    assert.ok(next.target);
    assert.ok(Math.abs(next.target.y) < 200);
  });

  it("clamps the resulting offset to maxOffset", () => {
    // Camera already near the cap; velocity cap 6 would pass -600 without clamp.
    const next = stepCameraFollow({
      camera: { x: 0, y: -598 },
      velocity: { x: 0, y: -6 },
      playerScreen: { x: 400, y: 900 },
      canvasWidth: 800,
      canvasHeight: 600,
      deadzone: 8,
      maxOffset: 600,
      followSpeed: 0.35,
    });
    assert.ok(next.target);
    assert.equal(next.target.y, -600);
    assert.ok(next.target.x <= 600 && next.target.x >= -600);
  });

  it("uses the 8-px velocity cap on narrow canvases", () => {
    const next = stepCameraFollow({
      camera: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      playerScreen: { x: 200, y: 400 },
      canvasWidth: 400,
      canvasHeight: 400,
      deadzone: 8,
      maxOffset: 600,
      followSpeed: 0.35,
    });
    assert.ok(next.target);
    assert.ok(Math.abs(next.velocity.x) <= 8);
    assert.ok(Math.abs(next.velocity.y) <= 8);
    assert.equal(cameraMaxVelocity(400), 8);
  });

  it("uses the 4-px velocity cap on wide canvases", () => {
    const next = stepCameraFollow({
      camera: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      playerScreen: { x: 960, y: 800 },
      canvasWidth: 1920,
      canvasHeight: 1080,
      deadzone: 8,
      maxOffset: 600,
      followSpeed: 0.35,
    });
    assert.ok(next.target);
    assert.ok(Math.abs(next.velocity.x) <= 4);
    assert.ok(Math.abs(next.velocity.y) <= 4);
  });

  it("applies CAMERA_SMOOTHING_FACTOR 0.85 to incoming velocity", () => {
    assert.equal(CAMERA_SMOOTHING_FACTOR, 0.85);
    const next = stepCameraFollow({
      camera: { x: 0, y: 0 },
      velocity: { x: 0, y: -4 },
      playerScreen: { x: 400, y: 500 },
      canvasWidth: 800,
      canvasHeight: 600,
      deadzone: 8,
      maxOffset: 600,
      followSpeed: 0.35,
    });
    // smoothedTargetY = -70; vy = -4*0.85 + (-70)*0.15 = -3.4 - 10.5 = -13.9 → cap -6
    assert.deepEqual(next.velocity, { x: 0, y: -6 });
  });

  it("uses the slower non-mobile follow speed when isMobile is false", () => {
    const mobile = stepCameraFollow({
      camera: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      playerScreen: { x: 400, y: 500 },
      canvasWidth: 800,
      canvasHeight: 600,
      deadzone: 8,
      maxOffset: 600,
      followSpeed: 0.35,
    });
    const desktopWidth = stepCameraFollow({
      camera: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      playerScreen: { x: 400, y: 500 },
      canvasWidth: 800,
      canvasHeight: 600,
      deadzone: 8,
      maxOffset: 600,
      followSpeed: getCameraFollowSpeed(800, false),
    });
    assert.ok(mobile.target && desktopWidth.target);
    // Live WX never calls this on desktop (camera is locked at 0), but the
    // helper must still use 0.12 vs 0.35 so a future caller cannot mix them.
    // First step from rest: mobile hits the 6-px cap; non-mobile does not.
    assert.ok(Math.abs(desktopWidth.target.y) < Math.abs(mobile.target.y));
    assert.equal(mobile.velocity.y, -6);
    assert.ok(Math.abs(desktopWidth.velocity.y + 3.6) < 1e-9);
  });
});
