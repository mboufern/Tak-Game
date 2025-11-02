import React, { useState, useEffect, useCallback } from 'react';
import useTakGame from './hooks/useTakGame';
import Board from './components/Board';
import GameControls from './components/GameControls';
import { StoneType, Theme, Coordinates, Player } from './types';
import { THEMES } from './constants';

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>(THEMES.classic);
    const [boardSize, setBoardSize] = useState(5);
    const [placementPopoverCell, setPlacementPopoverCell] = useState<Coordinates | null>(null);
    const [movePopoverCell, setMovePopoverCell] = useState<Coordinates | null>(null);
    const [showRoads, setShowRoads] = useState(false);

    const {
        board,
        currentPlayer,
        phase,
        winner,
        pieces,
        selectedCell,
        hand,
        validMoves,
        roadConnections,
        initializeGame,
        placePiece,
        pickupStack,
        moveStack,
        cancelMove,
    } = useTakGame(boardSize);
    
    useEffect(() => {
        initializeGame(boardSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardSize]);
    
    useEffect(() => {
        document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
        document.documentElement.style.setProperty('--text-color', theme.textColor);
    }, [theme]);
    
    // Close popovers if clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setPlacementPopoverCell(null);
            setMovePopoverCell(null);
        };
        if (placementPopoverCell || movePopoverCell) {
            setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [placementPopoverCell, movePopoverCell]);

    const handleCellClick = useCallback((row: number, col: number) => {
        if (winner) return;

        if ((placementPopoverCell && placementPopoverCell.row === row && placementPopoverCell.col === col) ||
            (movePopoverCell && movePopoverCell.row === row && movePopoverCell.col === col)) {
            return;
        }
        
        setPlacementPopoverCell(null);
        setMovePopoverCell(null);

        const coordKey = `${row},${col}`;
        const stack = board[row][col];

        if (hand.length > 0) {
            // We are in the middle of a move.
            if (validMoves.has(coordKey)) {
                const drops = validMoves.get(coordKey);
                if (drops && drops.length > 0) {
                    moveStack({ row, col }, drops[0]);
                }
            } else {
                // If the player clicks anywhere other than a valid move, cancel the move.
                cancelMove();
            }
        } else {
            // Starting a new turn action.
            if (stack.length === 0) {
                if (phase === 'INITIAL_PLACEMENT') {
                    placePiece(row, col, StoneType.FLAT);
                } else {
                    setMovePopoverCell(null);
                    setPlacementPopoverCell({ row, col });
                }
            } else {
                const topPiece = stack[stack.length - 1];
                if (topPiece.player === currentPlayer) {
                    if (stack.length === 1) {
                        pickupStack(row, col, 1);
                    } else {
                        setPlacementPopoverCell(null);
                        setMovePopoverCell({ row, col });
                    }
                }
            }
        }
    }, [winner, board, phase, currentPlayer, hand, validMoves, placementPopoverCell, movePopoverCell, placePiece, moveStack, pickupStack, cancelMove]);
    
    const handlePlacementPopoverPlace = (type: StoneType) => {
        if (placementPopoverCell) {
            placePiece(placementPopoverCell.row, placementPopoverCell.col, type);
        }
        setPlacementPopoverCell(null);
    };

    const handlePlacementPopoverCancel = () => {
        setPlacementPopoverCell(null);
    };

    const handleMovePopoverPickup = (count: number) => {
        if (movePopoverCell) {
            pickupStack(movePopoverCell.row, movePopoverCell.col, count);
        }
        setMovePopoverCell(null);
    };

    const handleMovePopoverCancel = () => {
        setMovePopoverCell(null);
    };
    
    const handleNewGame = (size: number) => {
        setPlacementPopoverCell(null);
        setMovePopoverCell(null);
        initializeGame(size);
    }

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row items-center lg:items-stretch justify-center p-2 sm:p-4 lg:p-8 gap-8 font-sans transition-colors duration-500"
            style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
            <div className="w-full lg:flex-1 flex items-center justify-center">
                <Board 
                    boardData={board} 
                    onCellClick={handleCellClick} 
                    selectedCell={hand.length > 0 ? selectedCell : null}
                    validMoves={hand.length > 0 ? validMoves : new Map()}
                    theme={theme}
                    placementPopoverCell={placementPopoverCell}
                    onPlacementPopoverPlace={handlePlacementPopoverPlace}
                    onPlacementPopoverCancel={handlePlacementPopoverCancel}
                    movePopoverCell={movePopoverCell}
                    onMovePopoverPickup={handleMovePopoverPickup}
                    onMovePopoverCancel={handleMovePopoverCancel}
                    currentPlayer={currentPlayer}
                    currentPlayerPieces={pieces[currentPlayer]}
                    hand={hand}
                    roadConnections={roadConnections}
                    showRoads={showRoads}
                />
            </div>
            <GameControls
                boardSize={boardSize}
                setBoardSize={setBoardSize}
                onNewGame={handleNewGame}
                phase={phase}
                currentPlayer={currentPlayer}
                winner={winner}
                pieces={pieces}
                hand={hand}
                onCancelMove={cancelMove}
                theme={theme}
                setTheme={setTheme}
                showRoads={showRoads}
                setShowRoads={setShowRoads}
            />
        </div>
    );
};

export default App;