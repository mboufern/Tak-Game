import React, { useState, useEffect, useCallback } from 'react';
import useTakGame from './hooks/useTakGame';
import Board from './components/Board';
import GameControls from './components/GameControls';
import { StoneType, Theme, Coordinates } from './types';
import { THEMES } from './constants';

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>(THEMES.classic);
    const [boardSize, setBoardSize] = useState(5);
    const [placingPieceType, setPlacingPieceType] = useState<StoneType | null>(null);

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

    const handleCellClick = useCallback((row: number, col: number) => {
        if (winner) return;
        
        if (placingPieceType) {
            if (board[row][col].length === 0) {
                placePiece(row, col, placingPieceType);
            }
            setPlacingPieceType(null); // Always exit placing mode after a click
            return;
        }

        const coordKey = `${row},${col}`;

        if (selectedCell) {
            // If hand is empty, it means we haven't picked up yet.
            // A click on the same cell should cancel selection.
            if (row === selectedCell.row && col === selectedCell.col && hand.length === 0) {
                 cancelMove();
                 return;
            }
            // If hand has pieces, we are trying to move
            if (hand.length > 0 && validMoves.has(coordKey)) {
                // For this simple UI, we'll just use the first possible drop distribution.
                // A more advanced UI could let the user choose.
                const drops = validMoves.get(coordKey);
                if (drops && drops.length > 0) {
                    moveStack({ row, col }, drops[0]);
                }
            }
        } else {
            // No cell selected, try to place or select a stack
            if (board[row][col].length === 0) {
                // In initial placement, clicking an empty square places an opponent piece
                if (phase === 'INITIAL_PLACEMENT') {
                    placePiece(row, col, StoneType.FLAT);
                }
                // In normal play, placing is handled by `placingPieceType` state
            } else {
                // Stack exists. If it belongs to current player, select it.
                const stack = board[row][col];
                const topPiece = stack[stack.length - 1];
                if (topPiece.player === currentPlayer) {
                    // This will select the cell, controls will show pickup options
                    pickupStack(row, col, 0); // pickup 0 to just select. Real pickup is via controls.
                }
            }
        }
    }, [winner, board, phase, currentPlayer, selectedCell, hand, validMoves, placingPieceType, placePiece, moveStack, pickupStack, cancelMove]);

    const handlePlace = (type: StoneType) => {
        setPlacingPieceType(type);
    };

    const handlePickup = (count: number) => {
        if (selectedCell) {
            pickupStack(selectedCell.row, selectedCell.col, count);
        }
    }
    
    const handleNewGame = (size: number) => {
        setPlacingPieceType(null);
        initializeGame(size);
    }

    const cancelPlacing = () => {
        setPlacingPieceType(null);
    }

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row items-center lg:items-stretch justify-center p-2 sm:p-4 lg:p-8 gap-8 font-sans transition-colors duration-500"
            style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
            <div className="w-full lg:flex-1 flex items-center justify-center">
                <Board 
                    boardData={board} 
                    onCellClick={handleCellClick} 
                    selectedCell={hand.length === 0 ? selectedCell : null} // only show selection before pickup
                    validMoves={hand.length > 0 ? validMoves : new Map()}
                    theme={theme}
                />
            </div>
            <GameControls
                // FIX: Pass board data to GameControls.
                board={board}
                boardSize={boardSize}
                setBoardSize={setBoardSize}
                onNewGame={handleNewGame}
                phase={phase}
                currentPlayer={currentPlayer}
                winner={winner}
                pieces={pieces}
                hand={hand}
                onPlace={handlePlace}
                onPickup={handlePickup}
                onMove={(to: Coordinates, drops: number[]) => moveStack(to, drops)}
                onCancelMove={cancelMove}
                selectedCell={selectedCell}
                validMoves={validMoves}
                theme={theme}
                setTheme={setTheme}
                placingPieceType={placingPieceType}
                onCancelPlacing={cancelPlacing}
            />
        </div>
    );
};

export default App;