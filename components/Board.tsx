import React from 'react';
import { BoardData, Coordinates, Theme } from '../types';
import Cell from './Cell';

interface BoardProps {
  // FIX: Corrected typo from 'Board-Data' to 'BoardData'. This was causing subsequent type errors.
  boardData: BoardData;
  onCellClick: (row: number, col: number) => void;
  selectedCell: Coordinates | null;
  validMoves: Map<string, any>;
  theme: Theme;
}

const Board: React.FC<BoardProps> = ({ boardData, onCellClick, selectedCell, validMoves, theme }) => {
  const boardSize = boardData.length;

  const boardStyle = {
    gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
  };

  return (
    <div className="w-full lg:w-auto lg:h-full aspect-square p-2 sm:p-4 rounded-xl shadow-2xl" style={{ backgroundColor: theme.boardColor }}>
        <div className="grid w-full h-full gap-2" style={boardStyle}>
        {boardData.map((row, rowIndex) =>
            row.map((cellData, colIndex) => (
            <Cell
                key={`${rowIndex}-${colIndex}`}
                data={cellData}
                onClick={() => onCellClick(rowIndex, colIndex)}
                isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                isPossibleMove={validMoves.has(`${rowIndex},${colIndex}`)}
                theme={theme}
            />
            ))
        )}
        </div>
    </div>
  );
};

export default Board;