
import { Theme } from './types';

export const PIECE_COUNTS: { [key: number]: { stones: number; capstones: number } } = {
  3: { stones: 10, capstones: 0 },
  4: { stones: 15, capstones: 0 },
  5: { stones: 21, capstones: 1 },
  6: { stones: 30, capstones: 1 },
  7: { stones: 40, capstones: 2 },
  8: { stones: 50, capstones: 2 },
  9: { stones: 60, capstones: 2 },
};

export const THEMES: { [key: string]: Theme } = {
  classic: {
    name: "Classic Wood",
    backgroundColor: "#2d231b",
    textColor: "#e6d5b8",
    boardColor: "#8c5b3b",
    cellColor: "#c89b7b",
    player1Color: "#f0e3d0",
    player2Color: "#593d2b",
    capstone1Color: "#d4af37",
    capstone2Color: "#3d3d3d",
    accentColor: "#a37a5a"
  },
  stone: {
    name: "Cool Stone",
    backgroundColor: "#34495e",
    textColor: "#ecf0f1",
    boardColor: "#95a5a6",
    cellColor: "#bdc3c7",
    player1Color: "#2c3e50",
    player2Color: "#ecf0f1",
    capstone1Color: "#e74c3c",
    capstone2Color: "#2980b9",
    accentColor: "#7f8c8d"
  },
  forest: {
    name: "Deep Forest",
    backgroundColor: "#1e3a1f",
    textColor: "#d4d4a4",
    boardColor: "#4a4a2a",
    cellColor: "#6b6b3e",
    player1Color: "#b8b88a",
    player2Color: "#3b3b21",
    capstone1Color: "#ffbf00",
    capstone2Color: "#8a2be2",
    accentColor: "#556b2f"
  },
};
