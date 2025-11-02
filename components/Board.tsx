import React from 'react';
import { BoardData, Coordinates, Player, PlayerPieces, StoneType, Theme } from '../types';
import Cell from './Cell';

interface BoardProps {
  boardData: BoardData;
  onCellClick: (row: number, col: number) => void;
  selectedCell: Coordinates | null;
  validMoves: Map<string, any>;
  theme: Theme;
  placementPopoverCell: Coordinates | null;
  onPopoverPlace: (type: StoneType) => void;
  onPopoverCancel: () => void;
  currentPlayer: Player;
  currentPlayerPieces: PlayerPieces;
}

const Board: React.FC<BoardProps> = ({ 
  boardData, onCellClick, selectedCell, validMoves, theme,
  placementPopoverCell, onPopoverPlace, onPopoverCancel, currentPlayer, currentPlayerPieces
}) => {
  const boardSize = boardData.length;

  const boardStyle = {
    gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
  };

  return (
    <div className="w-full lg:h-full lg:w-auto aspect-square p-2 sm:p-4 rounded-xl shadow-2xl" style={{ backgroundColor: theme.boardColor }}>
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
                isPopoverOpen={placementPopoverCell?.row === rowIndex && placementPopoverCell?.col === colIndex}
                onPopoverPlace={onPopoverPlace}
                onPopoverCancel={onPopoverCancel}
                currentPlayer={currentPlayer}
                currentPlayerPieces={currentPlayerPieces}
                boardSize={boardSize}
            />
            ))
        )}
        </div>
    </div>
  );
};

export default Board;
