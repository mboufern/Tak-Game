import React, { useState, useEffect } from 'react';
// FIX: Import BoardData for props and PIECE_COUNTS for rendering logic.
import { GamePhase, Player, PlayerPieces, StoneType, Theme, BoardData } from '../types';
import { THEMES, PIECE_COUNTS } from '../constants';
import PieceDisplay from './PieceDisplay';

interface GameControlsProps {
    boardSize: number;
    setBoardSize: (size: number) => void;
    onNewGame: (size: number) => void;
    phase: GamePhase;
    currentPlayer: Player;
    winner: Player | 'draw' | null;
    pieces: { [key in Player]: PlayerPieces };
    hand: any[];
    onPlace: (type: StoneType) => void;
    onPickup: (count: number) => void;
    onMove: (to: {row: number, col: number}, drops: number[]) => void;
    onCancelMove: () => void;
    selectedCell: {row: number, col: number} | null;
    validMoves: Map<string, number[][]>;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    placingPieceType: StoneType | null;
    onCancelPlacing: () => void;
    // FIX: Add board to props to determine stack size for pickup.
    board: BoardData;
}

const GameControls: React.FC<GameControlsProps> = ({
    boardSize, setBoardSize, onNewGame, phase, currentPlayer, winner, pieces,
    hand, onPlace, onPickup, onCancelMove, selectedCell, theme, setTheme,
    placingPieceType, onCancelPlacing, board
}) => {
    const [currentSize, setCurrentSize] = useState(boardSize);
    const [pickupCount, setPickupCount] = useState(1);
    
    useEffect(() => {
        // Reset pickup count to 1 whenever the selection changes.
        // This handles new selections, completing a move (selectedCell -> null),
        // and canceling a move (selectedCell -> null).
        setPickupCount(1);
    }, [selectedCell]);

    const handleNewGame = () => {
        setBoardSize(currentSize);
        onNewGame(currentSize);
    };

    const StatusDisplay = () => {
        if (winner) {
            return (
                <div className="text-center p-4 rounded-lg" style={{backgroundColor: theme.accentColor}}>
                    <h3 className="text-2xl font-bold">Game Over!</h3>
                    <p className="text-lg">{winner === 'draw' ? "It's a draw!" : `Player ${winner} wins!`}</p>
                </div>
            );
        }
        return (
            <div className="text-center p-4 rounded-lg" style={{backgroundColor: theme.accentColor}}>
                <h3 className="text-xl font-semibold">
                    Player {currentPlayer}'s Turn
                </h3>
                <p className="text-sm">{phase === GamePhase.INITIAL_PLACEMENT ? 'Place an opponent piece' : 'Your move'}</p>
            </div>
        );
    };
    
    const PiecesInfo: React.FC<{player: Player}> = ({player}) => (
        <div className="flex flex-col items-center">
            <h4 className="font-bold mb-2">Player {player}</h4>
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8"><PieceDisplay piece={{player, type: StoneType.FLAT}} player1Color={theme.player1Color} player2Color={theme.player2Color} capstone1Color={theme.capstone1Color} capstone2Color={theme.capstone2Color} /></div>
                <span>x {pieces[player].stones}</span>
            </div>
            {pieces[player].capstones > 0 && <div className="flex items-center space-x-2 mt-2">
                 <div className="w-8 h-8"><PieceDisplay piece={{player, type: StoneType.CAPSTONE}} player1Color={theme.player1Color} player2Color={theme.player2Color} capstone1Color={theme.capstone1Color} capstone2Color={theme.capstone2Color} /></div>
                <span>x {pieces[player].capstones}</span>
            </div>}
        </div>
    );

    return (
        <div className="p-4 md:p-6 rounded-xl w-full lg:w-96 flex-shrink-0 flex flex-col space-y-4" style={{ backgroundColor: theme.boardColor }}>
            <h2 className="text-3xl font-bold text-center">Tak</h2>
            
            <StatusDisplay />

            <div className="flex justify-around items-start text-center">
                <PiecesInfo player={Player.One} />
                <PiecesInfo player={Player.Two} />
            </div>

            {phase !== GamePhase.GAME_OVER && (
                 <div className="p-4 rounded-lg" style={{backgroundColor: theme.accentColor}}>
                    <h3 className="text-lg font-semibold mb-2 text-center">Actions</h3>
                    {selectedCell ? (
                        hand.length === 0 ? (
                            // Step 1: Pick up
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="pickup-slider">Pieces to pick up: {pickupCount}</label>
                                <input type="range" min="1" max={Math.min(boardSize, board.find((r,ri) => ri === selectedCell.row)?.find((c,ci) => ci === selectedCell.col)?.length || 1)} value={pickupCount} onChange={(e) => setPickupCount(parseInt(e.target.value))} className="w-full"/>
                                <button onClick={() => onPickup(pickupCount)} className="p-2 rounded bg-green-600 hover:bg-green-700 text-white font-bold">Pick Up</button>
                                <button onClick={onCancelMove} className="p-2 rounded bg-gray-600 hover:bg-gray-700 text-white">Cancel</button>
                            </div>
                        ) : (
                            // Step 2: Move
                            <div className="flex flex-col space-y-2">
                                <p className="text-center">Hand: {hand.length} piece{hand.length > 1 ? 's' : ''}. Select a destination square.</p>
                                <button onClick={onCancelMove} className="p-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold">Cancel Move</button>
                            </div>
                        )
                    ) : (
                        // Place new piece
                         phase !== GamePhase.INITIAL_PLACEMENT && (
                             placingPieceType ? (
                                <div className="flex flex-col space-y-2 text-center">
                                    <p>Placing a {placingPieceType.toLowerCase()}.</p>
                                    <p className="text-sm">Click an empty square on the board.</p>
                                    <button onClick={onCancelPlacing} className="p-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold">Cancel</button>
                                </div>
                             ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <button disabled={pieces[currentPlayer].stones <= 0} onClick={() => onPlace(StoneType.FLAT)} className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-500">Place Flat</button>
                                    <button disabled={pieces[currentPlayer].stones <= 0} onClick={() => onPlace(StoneType.STANDING)} className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-500">Place Wall</button>
                                    {PIECE_COUNTS[boardSize]?.capstones > 0 && <button disabled={pieces[currentPlayer].capstones <= 0} onClick={() => onPlace(StoneType.CAPSTONE)} className="col-span-2 p-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-gray-500">Place Capstone</button>}
                                </div>
                             )
                        )
                    )}
                 </div>
            )}
            
            <div className="p-4 rounded-lg" style={{backgroundColor: theme.accentColor}}>
                <h3 className="text-lg font-semibold mb-2">Game Settings</h3>
                <div className="space-y-2">
                     <div>
                        <label htmlFor="board-size">Board Size: {currentSize}x{currentSize}</label>
                        <input id="board-size" type="range" min="3" max="9" value={currentSize} onChange={(e) => setCurrentSize(parseInt(e.target.value))} className="w-full" />
                    </div>
                    <div>
                        <label htmlFor="theme-select">Theme</label>
                        <select id="theme-select" value={theme.name} onChange={e => setTheme(THEMES[Object.keys(THEMES).find(key => THEMES[key].name === e.target.value) || 'classic'])} className="w-full p-2 rounded" style={{backgroundColor: theme.cellColor, color: theme.textColor}}>
                            {Object.values(THEMES).map(t => <option key={t.name}>{t.name}</option>)}
                        </select>
                    </div>
                    <button onClick={handleNewGame} className="w-full p-2 mt-2 rounded bg-green-600 hover:bg-green-700 text-white font-bold">New Game</button>
                </div>
            </div>
        </div>
    );
};

export default GameControls;