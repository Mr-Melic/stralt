export type TileType = "floor" | "wall" | "trap" | "access";

export type ObjectTool = "wall" | "trap" | "access" | "eraser";

export interface Room {
  id: string;
  tiles: TileType[][];
}

export interface Dungeon {
  id: string;
  rooms: Room[];
}

export interface Position {
  x: number;
  y: number;
}
