import React from 'react';
import { Player, StoneType, Theme, PlayerPieces } from '../types';
import { PIECE_COUNTS } from '../constants';
import PieceDisplay from './PieceDisplay';

interface PlacementPopoverProps {
  player: Player;
  pieces: PlayerPieces;
  boardSize: number;
  theme: Theme;
  onPlace: (type: StoneType) => void;
  onCancel: () => void;
}

const PlacementPopover: React.FC<PlacementPopoverProps> = ({ player, pieces, boardSize, theme, onPlace, onCancel }) => {
  return (
    <div 
      className="absolute z-50 w-[220px] p-3 rounded-lg shadow-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
      style={{ backgroundColor: theme.accentColor }}
      // Prevent click from propagating to the cell and triggering the main click handler
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-sm">Place Piece</h4>
        <button onClick={onCancel} className="text-xl font-bold leading-none w-6 h-6 rounded-full hover:bg-black/20 transition-colors">&times;</button>
      </div>
      <div className="flex justify-around items-stretch gap-2">
        <button 
          disabled={pieces.stones <= 0} 
          onClick={() => onPlace(StoneType.FLAT)} 
          className="flex-1 flex flex-col items-center p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:brightness-90 active:scale-95"
          style={{ backgroundColor: theme.boardColor }}
        >
          <div className="w-8 h-8 mb-1">
            <PieceDisplay piece={{player, type: StoneType.FLAT}} player1Color={theme.player1Color} player2Color={theme.player2Color} capstone1Color={theme.capstone1Color} capstone2Color={theme.capstone2Color} />
          </div>
          <span className="font-semibold text-xs">Flat</span>
        </button>

        <button 
          disabled={pieces.stones <= 0} 
          onClick={() => onPlace(StoneType.STANDING)} 
          className="flex-1 flex flex-col items-center p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:brightness-90 active:scale-95"
          style={{ backgroundColor: theme.boardColor }}
        >
          <div className="w-8 h-8 mb-1">
            <PieceDisplay piece={{player, type: StoneType.STANDING}} player1Color={theme.player1Color} player2Color={theme.player2Color} capstone1Color={theme.capstone1Color} capstone2Color={theme.capstone2Color} />
          </div>
          <span className="font-semibold text-xs">Wall</span>
        </button>
        
        {PIECE_COUNTS[boardSize]?.capstones > 0 && (
          <button 
            disabled={pieces.capstones <= 0} 
            onClick={() => onPlace(StoneType.CAPSTONE)} 
            className="flex-1 flex flex-col items-center p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:brightness-90 active:scale-95"
            style={{ backgroundColor: theme.boardColor }}
          >
            <div className="w-8 h-8 mb-1">
              <PieceDisplay piece={{player, type: StoneType.CAPSTONE}} player1Color={theme.player1Color} player2Color={theme.player2Color} capstone1Color={theme.capstone1Color} capstone2Color={theme.capstone2Color} />
            </div>
            <span className="font-semibold text-xs">Capstone</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PlacementPopover;
