
import React from 'react';
import { CellData, Theme } from '../types';
import PieceDisplay from './PieceDisplay';

interface CellProps {
  data: CellData;
  onClick: () => void;
  isSelected: boolean;
  isPossibleMove: boolean;
  theme: Theme;
}

const Cell: React.FC<CellProps> = ({ data, onClick, isSelected, isPossibleMove, theme }) => {
  const stackHeight = data.length;

  const cellStyle = {
    backgroundColor: theme.cellColor,
  };
  
  let ringClass = 'ring-offset-2 ring-offset-[var(--background-color)]';
  if (isSelected) {
    ringClass += ' ring-4 ring-yellow-400';
  } else if (isPossibleMove) {
    ringClass += ' ring-4 ring-green-500';
  }

  const pieceEdgeThickness = 5; // in pixels

  return (
    <div
      className={`relative aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${ringClass}`}
      style={cellStyle}
      onClick={onClick}
    >
      {stackHeight > 0 && (
        <div className="relative w-3/4 h-3/4">
          {data.map((piece, index) => (
            <div
              key={index}
              className="absolute w-full h-full"
              style={{
                bottom: `${index * pieceEdgeThickness}px`,
                zIndex: index,
              }}
            >
              <PieceDisplay 
                piece={piece}
                player1Color={theme.player1Color}
                player2Color={theme.player2Color}
                capstone1Color={theme.capstone1Color}
                capstone2Color={theme.capstone2Color}
              />
            </div>
          ))}
        </div>
      )}
      {stackHeight > 1 && (
        <div 
            className="absolute bottom-1 right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            style={{ backgroundColor: theme.boardColor, color: theme.textColor, zIndex: stackHeight + 1 }}
        >
          {stackHeight}
        </div>
      )}
    </div>
  );
};

export default Cell;