import React, { useState } from 'react';
import { Theme } from '../types';

interface MovePopoverProps {
  maxPickup: number;
  theme: Theme;
  onPickup: (count: number) => void;
  onCancel: () => void;
}

const MovePopover: React.FC<MovePopoverProps> = ({ maxPickup, theme, onPickup, onCancel }) => {
  const [pickupCount, setPickupCount] = useState(maxPickup);

  return (
    <div
      className="absolute z-50 w-[220px] p-3 rounded-lg shadow-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ backgroundColor: theme.accentColor }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-sm">Move Stack</h4>
        <button onClick={onCancel} className="text-xl font-bold leading-none w-6 h-6 rounded-full hover:bg-black/20 transition-colors">&times;</button>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="pickup-slider" className="text-sm">Pieces to pick up: {pickupCount}</label>
        <input
          id="pickup-slider"
          type="range"
          min="1"
          max={maxPickup}
          value={pickupCount}
          onChange={(e) => setPickupCount(parseInt(e.target.value))}
          className="w-full"
        />
        <button
          onClick={() => onPickup(pickupCount)}
          className="p-2 rounded font-bold transition-all duration-200 hover:brightness-90 active:scale-95"
          style={{ backgroundColor: theme.boardColor, color: theme.textColor }}
        >
          Pick Up ({pickupCount})
        </button>
      </div>
    </div>
  );
};

export default MovePopover;
