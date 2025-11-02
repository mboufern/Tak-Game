
export enum Player {
  One = 1,
  Two = 2,
}

export enum StoneType {
  FLAT = 'FLAT',
  STANDING = 'STANDING',
  CAPSTONE = 'CAPSTONE',
}

export interface Piece {
  player: Player;
  type: StoneType;
}

export type CellData = Piece[];

export type BoardData = CellData[][];

export enum GamePhase {
  INITIAL_PLACEMENT = 'INITIAL_PLACEMENT',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export interface Coordinates {
  row: number;
  col: number;
}

export interface RoadConnection {
  from: Coordinates;
  to: Coordinates;
}

export interface PlayerPieces {
  stones: number;
  capstones: number;
}

export interface Theme {
  name: string;
  backgroundColor: string;
  textColor: string;
  boardColor: string;
  cellColor: string;
  player1Color: string;
  player2Color: string;
  capstone1Color: string;
  capstone2Color: string;
  accentColor: string;
}