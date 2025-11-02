
import React from 'react';
import { Piece, Player, StoneType } from '../types';

interface PieceDisplayProps {
  piece: Piece;
  player1Color: string;
  player2Color: string;
  capstone1Color: string;
  capstone2Color: string;
}

const PieceDisplay: React.FC<PieceDisplayProps> = ({ piece, player1Color, player2Color, capstone1Color, capstone2Color }) => {
  const color = piece.player === Player.One ? player1Color : player2Color;
  const capstoneColor = piece.player === Player.One ? capstone1Color : capstone2Color;

  const baseClasses = "w-full h-full rounded transition-all duration-200 ease-in-out";
  const shadow = "shadow-[rgba(0,0,0,0.4)_0px_2px_4px,rgba(0,0,0,0.3)_0px_7px_13px_-3px,rgba(0,0,0,0.2)_0px_-3px_0px_inset]";

  switch (piece.type) {
    case StoneType.FLAT:
      return (
        <div 
          className={`${baseClasses} ${shadow}`}
          style={{ backgroundColor: color, height: '90%' }}
        />
      );
    case StoneType.STANDING:
      // A container to center the thinner, beveled wall.
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="w-[60%] h-full transition-all duration-200 ease-in-out"
            style={{
              backgroundColor: color,
              boxShadow: `
                rgba(0, 0, 0, 0.4) 0px 2px 4px,
                rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
                inset -2px -2px 0px rgba(0, 0, 0, 0.2)
              `,
            }}
          />
        </div>
      );
    case StoneType.CAPSTONE:
      return (
        <div className="w-full h-full flex items-center justify-center">
            <div 
            className={`w-5/6 h-5/6 rounded-full ${shadow}`}
            style={{ backgroundColor: capstoneColor }}
            />
        </div>
      );
    default:
      return null;
  }
};

export default PieceDisplay;
