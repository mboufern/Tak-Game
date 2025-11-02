import React from 'react';
import { BoardData, CellData, Coordinates, Player, PlayerPieces, RoadConnection, StoneType, Theme } from '../types';
import Cell from './Cell';
import RoadsOverlay from './RoadsOverlay';

interface BoardProps {
  boardData: BoardData;
  onCellClick: (row: number, col: number) => void;
  selectedCell: Coordinates | null;
  validMoves: Map<string, any>;
  theme: Theme;
  placementPopoverCell: Coordinates | null;
  onPlacementPopoverPlace: (type: StoneType) => void;
  onPlacementPopoverCancel: () => void;
  movePopoverCell: Coordinates | null;
  onMovePopoverPickup: (count: number) => void;
  onMovePopoverCancel: () => void;
  currentPlayer: Player;
  currentPlayerPieces: PlayerPieces;
  hand: CellData;
  roadConnections: { [key in Player]: RoadConnection[] };
  showRoads: boolean;
}

const Board: React.FC<BoardProps> = ({ 
  boardData, onCellClick, selectedCell, validMoves, theme,
  placementPopoverCell, onPlacementPopoverPlace, onPlacementPopoverCancel,
  movePopoverCell, onMovePopoverPickup, onMovePopoverCancel,
  currentPlayer, currentPlayerPieces, hand, roadConnections, showRoads
}) => {
  const boardSize = boardData.length;

  const boardStyle = {
    gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
  };

  return (
    <div className="relative w-full lg:h-full lg:w-auto aspect-square p-2 sm:p-4 rounded-xl shadow-2xl" style={{ backgroundColor: theme.boardColor }}>
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
                isPlacementPopoverOpen={placementPopoverCell?.row === rowIndex && placementPopoverCell?.col === colIndex}
                onPlacementPopoverPlace={onPlacementPopoverPlace}
                onPlacementPopoverCancel={onPlacementPopoverCancel}
                isMovePopoverOpen={movePopoverCell?.row === rowIndex && movePopoverCell?.col === colIndex}
                onMovePopoverPickup={onMovePopoverPickup}
                onMovePopoverCancel={onMovePopoverCancel}
                currentPlayer={currentPlayer}
                currentPlayerPieces={currentPlayerPieces}
                boardSize={boardSize}
                hand={hand}
            />
            ))
        )}
        </div>
        {showRoads && <RoadsOverlay connections={roadConnections} boardSize={boardSize} theme={theme} />}
    </div>
  );
};

export default Board;