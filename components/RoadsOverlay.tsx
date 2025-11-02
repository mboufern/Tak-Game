import React from 'react';
import { Theme, Player, RoadConnection } from '../types';

interface RoadsOverlayProps {
  connections: { [key in Player]: RoadConnection[] };
  boardSize: number;
  theme: Theme;
}

const RoadsOverlay: React.FC<RoadsOverlayProps> = ({ connections, boardSize, theme }) => {
  if (boardSize === 0) return null;

  const cellSize = 100 / boardSize;
  const offset = cellSize / 2;

  const renderLines = (playerConnections: RoadConnection[], color: string) => {
    return playerConnections.map((conn, index) => {
      const x1 = conn.from.col * cellSize + offset;
      const y1 = conn.from.row * cellSize + offset;
      const x2 = conn.to.col * cellSize + offset;
      const y2 = conn.to.row * cellSize + offset;

      return (
        <line
          key={`${color}-${index}`}
          x1={`${x1}%`}
          y1={`${y1}%`}
          x2={`${x2}%`}
          y2={`${y2}%`}
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
      );
    });
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none p-2 sm:p-4">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {renderLines(connections[Player.One], theme.player1Color)}
            {renderLines(connections[Player.Two], theme.player2Color)}
        </svg>
    </div>
  );
};

export default RoadsOverlay;