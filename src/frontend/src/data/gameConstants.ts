/**
 * Static game constants — world dimensions, movement, enemy limits, etc.
 * Extracted from WorldExploration.tsx for modularization.
 */

export const TILE_WIDTH = 80;
export const TILE_HEIGHT = 40;
export const WORLD_GRID_SIZE = 16;
export const MAX_HAZARD_TILES = 50;
export const MAX_ENEMIES = 20;
export const MOVEMENT_DURATION = 600;
export const _CAMERA_DEADZONE = 30;
export const _CAMERA_MAX_OFFSET = 150;
export const CAMERA_SMOOTHING_FACTOR = 0.85;

// Character positioning offset — adjusted for improved visual centering on tiles
export const CHARACTER_Y_OFFSET = -9;

// Enemy movement constants for visible random movement
export const ENEMY_MOVE_INTERVAL_MIN = 2000; // 2 seconds minimum between moves
export const ENEMY_MOVE_INTERVAL_MAX = 5000; // 5 seconds maximum between moves
export const _ENEMY_MOVEMENT_RANGE = 3; // Maximum tiles an enemy can move in one action
export const _ENEMY_MOVEMENT_SPEED = 800; // Duration of enemy movement animation
