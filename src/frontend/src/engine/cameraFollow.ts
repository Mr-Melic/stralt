/**
 * Mobile camera-follow step. React-free.
 *
 * WorldExploration still owns rest/Death Realm snap, desktop lock at (0,0),
 * `shouldFollowPlayer`, refs, and the RAF 0.18 lerp toward `targetCamera`.
 * This module only computes the velocity-smoothed, offset-clamped target
 * when the player is outside the deadzone.
 *
 * `getCameraFollowSpeed` stays in `worldHelpers.ts` so older PRs that add
 * re-exports there do not collide with this module.
 */

import { CAMERA_SMOOTHING_FACTOR } from "../data/gameConstants.ts";

export type CameraVec = { x: number; y: number };

export type CameraFollowStepInput = {
  camera: CameraVec;
  velocity: CameraVec;
  playerScreen: CameraVec;
  canvasWidth: number;
  canvasHeight: number;
  deadzone: number;
  maxOffset: number;
  followSpeed: number;
};

export type CameraFollowStepResult = {
  /** `null` means the player is inside the deadzone — leave the target as-is. */
  target: CameraVec | null;
  velocity: CameraVec;
};

/** Per-frame velocity cap used by the follow step (not the RAF 0.18 lerp). */
export function cameraMaxVelocity(canvasWidth: number): number {
  return canvasWidth < 768 ? 8 : canvasWidth < 1200 ? 6 : 4;
}

export function stepCameraFollow(
  input: CameraFollowStepInput,
): CameraFollowStepResult {
  const {
    camera,
    velocity,
    playerScreen,
    canvasWidth,
    canvasHeight,
    deadzone,
    maxOffset,
    followSpeed,
  } = input;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const desiredOffsetX = centerX - playerScreen.x + camera.x;
  const desiredOffsetY = centerY - playerScreen.y + camera.y;
  const distanceFromCenter = Math.sqrt(
    (playerScreen.x - centerX) ** 2 + (playerScreen.y - centerY) ** 2,
  );
  if (!(distanceFromCenter > deadzone)) {
    return {
      target: null,
      velocity: { x: velocity.x, y: velocity.y },
    };
  }
  const smoothedTargetX = camera.x + (desiredOffsetX - camera.x) * followSpeed;
  const smoothedTargetY = camera.y + (desiredOffsetY - camera.y) * followSpeed;
  let vx =
    velocity.x * CAMERA_SMOOTHING_FACTOR +
    (smoothedTargetX - camera.x) * (1 - CAMERA_SMOOTHING_FACTOR);
  let vy =
    velocity.y * CAMERA_SMOOTHING_FACTOR +
    (smoothedTargetY - camera.y) * (1 - CAMERA_SMOOTHING_FACTOR);
  const maxV = cameraMaxVelocity(canvasWidth);
  vx = Math.max(-maxV, Math.min(maxV, vx));
  vy = Math.max(-maxV, Math.min(maxV, vy));
  const newOffsetX = camera.x + vx;
  const newOffsetY = camera.y + vy;
  return {
    target: {
      x: Math.max(-maxOffset, Math.min(maxOffset, newOffsetX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newOffsetY)),
    },
    velocity: { x: vx, y: vy },
  };
}
