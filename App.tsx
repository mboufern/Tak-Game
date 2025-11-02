import React, { useState, useEffect, useCallback } from 'react';
import useTakGame from './hooks/useTakGame';
import Board from './components/Board';
import GameControls from './components/GameControls';
import { StoneType, Theme, Coordinates } from './types';
import { THEMES } from './constants';

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>(THEMES.classic);
    const [boardSize, setBoardSize] = useState(5);
    const [placementPopoverCell, setPlacementPopoverCell] = useState<Coordinates | null>(null);

    const {
        board,
        currentPlayer,
        phase,
        winner,
        pieces,
        selectedCell,
        hand,
        validMoves,
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
    
    // Close popover if clicking outside the board
    useEffect(() => {
        const handleClickOutside = () => {
            setPlacementPopoverCell(null);
        };
        // Use a timeout to prevent the click that opens the popover from immediately closing it.
        if (placementPopoverCell) {
            setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [placementPopoverCell]);

    const handleCellClick = useCallback((row: number, col: number) => {
        if (winner) return;

        // If we click the cell that already has an open popover, do nothing.
        if (placementPopoverCell && placementPopoverCell.row === row && placementPopoverCell.col === col) {
            return;
        }
        
        const coordKey = `${row},${col}`;

        if (selectedCell) {
             setPlacementPopoverCell(null);
            // If hand is empty, it means we haven't picked up yet.
            if (row === selectedCell.row && col === selectedCell.col && hand.length === 0) {
                 cancelMove();
                 return;
            }
            // If hand has pieces, we are trying to move
            if (hand.length > 0 && validMoves.has(coordKey)) {
                const drops = validMoves.get(coordKey);
                if (drops && drops.length > 0) {
                    moveStack({ row, col }, drops[0]);
                }
            }
        } else {
            // No cell selected
            if (board[row][col].length === 0) {
                if (phase === 'INITIAL_PLACEMENT') {
                    setPlacementPopoverCell(null);
                    placePiece(row, col, StoneType.FLAT);
                } else {
                    setPlacementPopoverCell({ row, col });
                }
            } else {
                setPlacementPopoverCell(null);
                const stack = board[row][col];
                const topPiece = stack[stack.length - 1];
                if (topPiece.player === currentPlayer) {
                    pickupStack(row, col, 0);
                }
            }
        }
    }, [winner, board, phase, currentPlayer, selectedCell, hand, validMoves, placementPopoverCell, placePiece, moveStack, pickupStack, cancelMove]);
    
    const handlePopoverPlace = (type: StoneType) => {
        if (placementPopoverCell) {
            placePiece(placementPopoverCell.row, placementPopoverCell.col, type);
        }
        setPlacementPopoverCell(null);
    };

    const handlePopoverCancel = () => {
        setPlacementPopoverCell(null);
    };

    const handlePickup = (count: number) => {
        if (selectedCell) {
            pickupStack(selectedCell.row, selectedCell.col, count);
        }
    }
    
    const handleNewGame = (size: number) => {
        setPlacementPopoverCell(null);
        initializeGame(size);
    }

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row items-center lg:items-stretch justify-center p-2 sm:p-4 lg:p-8 gap-8 font-sans transition-colors duration-500"
            style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
            <div className="w-full lg:flex-1 flex items-center justify-center">
                <Board 
                    boardData={board} 
                    onCellClick={handleCellClick} 
                    selectedCell={hand.length === 0 ? selectedCell : null}
                    validMoves={hand.length > 0 ? validMoves : new Map()}
                    theme={theme}
                    placementPopoverCell={placementPopoverCell}
                    onPopoverPlace={handlePopoverPlace}
                    onPopoverCancel={handlePopoverCancel}
                    currentPlayer={currentPlayer}
                    currentPlayerPieces={pieces[currentPlayer]}
                />
            </div>
            <GameControls
                board={board}
                boardSize={boardSize}
                setBoardSize={setBoardSize}
                onNewGame={handleNewGame}
                phase={phase}
                currentPlayer={currentPlayer}
                winner={winner}
                pieces={pieces}
                hand={hand}
                onPickup={handlePickup}
                onMove={(to: Coordinates, drops: number[]) => moveStack(to, drops)}
                onCancelMove={cancelMove}
                selectedCell={selectedCell}
                validMoves={validMoves}
                theme={theme}
                setTheme={setTheme}
            />
        </div>
    );
};

export default App;
