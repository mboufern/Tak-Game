import { useState, useCallback, useMemo } from 'react';
import { BoardData, Player, GamePhase, CellData, StoneType, Coordinates, Piece, PlayerPieces } from '../types';
import { PIECE_COUNTS } from '../constants';

const useTakGame = (initialSize: number = 5) => {
    const [boardSize, setBoardSize] = useState(initialSize);
    const [board, setBoard] = useState<BoardData>([]);
    const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.One);
    const [phase, setPhase] = useState<GamePhase>(GamePhase.INITIAL_PLACEMENT);
    const [winner, setWinner] = useState<Player | 'draw' | null>(null);
    const [turn, setTurn] = useState(1);
    const [pieces, setPieces] = useState<{ [key in Player]: PlayerPieces }>({
        [Player.One]: { stones: 0, capstones: 0 },
        [Player.Two]: { stones: 0, capstones: 0 },
    });
    const [selectedCell, setSelectedCell] = useState<Coordinates | null>(null);
    const [hand, setHand] = useState<CellData>([]);

    const initializeGame = useCallback((size: number) => {
        const newBoard: BoardData = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => [])
        );
        setBoard(newBoard);
        setBoardSize(size);
        setCurrentPlayer(Player.One);
        setPhase(GamePhase.INITIAL_PLACEMENT);
        setWinner(null);
        setTurn(1);
        const pieceCounts = PIECE_COUNTS[size] || PIECE_COUNTS[5];
        setPieces({
            [Player.One]: pieceCounts,
            [Player.Two]: pieceCounts,
        });
        setSelectedCell(null);
        setHand([]);
    }, []);

    const getOpponent = (player: Player) => (player === Player.One ? Player.Two : Player.One);

    const checkRoadWin = useCallback((currentBoard: BoardData) => {
        const size = currentBoard.length;
        if (size === 0) return null;

        const checkPlayerWin = (player: Player) => {
            const isRoadPiece = (r: number, c: number) => {
                const stack = currentBoard[r][c];
                if (stack.length === 0) return false;
                const topPiece = stack[stack.length - 1];
                return topPiece.player === player && (topPiece.type === StoneType.FLAT || topPiece.type === StoneType.CAPSTONE);
            };

            // Check North-South for Player 1
            let q: Coordinates[] = [];
            for (let c = 0; c < size; c++) {
                if (isRoadPiece(0, c)) q.push({ row: 0, col: c });
            }
            let visited: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
            q.forEach(coord => visited[coord.row][coord.col] = true);

            while (q.length > 0) {
                const { row, col } = q.shift()!;
                if (row === size - 1) return Player.One;

                [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
                    const newR = row + dr;
                    const newC = col + dc;
                    if (newR >= 0 && newR < size && newC >= 0 && newC < size && !visited[newR][newC] && isRoadPiece(newR, newC)) {
                        visited[newR][newC] = true;
                        q.push({ row: newR, col: newC });
                    }
                });
            }

            // Check East-West for Player 2
            q = [];
            for (let r = 0; r < size; r++) {
                if (isRoadPiece(r, 0)) q.push({ row: r, col: 0 });
            }
            visited = Array.from({ length: size }, () => Array(size).fill(false));
            q.forEach(coord => visited[coord.row][coord.col] = true);

            while (q.length > 0) {
                const { row, col } = q.shift()!;
                if (col === size - 1) return Player.Two;

                [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
                    const newR = row + dr;
                    const newC = col + dc;
                    if (newR >= 0 && newR < size && newC >= 0 && newC < size && !visited[newR][newC] && isRoadPiece(newR, newC)) {
                        visited[newR][newC] = true;
                        q.push({ row: newR, col: newC });
                    }
                });
            }
            return null;
        };

        return checkPlayerWin(Player.One) || checkPlayerWin(Player.Two);
    }, []);

    const checkFlatWin = useCallback((currentBoard: BoardData) => {
        let isBoardFull = true;
        let p1Flats = 0;
        let p2Flats = 0;

        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                const stack = currentBoard[r][c];
                if (stack.length === 0) {
                    isBoardFull = false;
                } else {
                    const topPiece = stack[stack.length-1];
                    if(topPiece.type === StoneType.FLAT) {
                        if (topPiece.player === Player.One) p1Flats++;
                        else p2Flats++;
                    }
                }
            }
        }
        
        const p1OutOfPieces = pieces[Player.One].stones === 0 && pieces[Player.One].capstones === 0;
        const p2OutOfPieces = pieces[Player.Two].stones === 0 && pieces[Player.Two].capstones === 0;

        if(isBoardFull || p1OutOfPieces || p2OutOfPieces) {
            if (p1Flats > p2Flats) return Player.One;
            if (p2Flats > p1Flats) return Player.Two;
            return 'draw';
        }

        return null;

    }, [boardSize, pieces]);
    
    const checkEndGame = useCallback((newBoard: BoardData) => {
        const roadWinner = checkRoadWin(newBoard);
        if (roadWinner) {
            setWinner(roadWinner);
            setPhase(GamePhase.GAME_OVER);
            return true;
        }

        const flatWinner = checkFlatWin(newBoard);
        if (flatWinner) {
            setWinner(flatWinner);
            setPhase(GamePhase.GAME_OVER);
            return true;
        }
        return false;
    },[checkRoadWin, checkFlatWin]);


    const endTurn = (newBoard: BoardData) => {
        if (!checkEndGame(newBoard)) {
            setCurrentPlayer(getOpponent(currentPlayer));
            const newTurn = turn + 1;
            setTurn(newTurn);
            if (newTurn > 2 && phase === GamePhase.INITIAL_PLACEMENT) {
                setPhase(GamePhase.PLAYING);
            }
        }
    };

    const placePiece = (row: number, col: number, type: StoneType) => {
        if (board[row][col].length > 0 || winner) return;

        const newBoard = board.map(r => r.map(c => [...c]));
        let playerToPlace: Player = currentPlayer;
        let pieceToPlace: Piece;

        if (phase === GamePhase.INITIAL_PLACEMENT) {
            playerToPlace = getOpponent(currentPlayer);
            if (pieces[playerToPlace].stones <= 0) return;
            setPieces(p => ({ ...p, [playerToPlace]: { ...p[playerToPlace], stones: p[playerToPlace].stones - 1 }}));
            pieceToPlace = { player: playerToPlace, type: StoneType.FLAT };
        } else {
             if (type === StoneType.CAPSTONE) {
                if (pieces[currentPlayer].capstones <= 0) return;
                setPieces(p => ({ ...p, [currentPlayer]: { ...p[currentPlayer], capstones: p[currentPlayer].capstones - 1 }}));
            } else {
                if (pieces[currentPlayer].stones <= 0) return;
                setPieces(p => ({ ...p, [currentPlayer]: { ...p[currentPlayer], stones: p[currentPlayer].stones - 1 }}));
            }
            pieceToPlace = { player: currentPlayer, type };
        }
        
        newBoard[row][col].push(pieceToPlace);
        setBoard(newBoard);
        endTurn(newBoard);
    };

    const moveStack = (to: Coordinates, numToDrop: number[]) => {
        if (!selectedCell || !hand.length || winner) return;

        const { row: fromRow, col: fromCol } = selectedCell;
        const dr = Math.sign(to.row - fromRow);
        const dc = Math.sign(to.col - fromCol);
        
        const newBoard = board.map(r => r.map(c => [...c]));
        let handToDrop = [...hand];

        for (let i = 0; i < numToDrop.length; i++) {
            const dropRow = fromRow + dr * (i + 1);
            const dropCol = fromCol + dc * (i + 1);
            const dropCount = numToDrop[i];
            
            const currentStack = newBoard[dropRow][dropCol];
            const topOfStack = currentStack.length > 0 ? currentStack[currentStack.length-1] : null;

            if (topOfStack && topOfStack.type === StoneType.STANDING && handToDrop[0].type === StoneType.CAPSTONE && dropCount === 1) {
                currentStack[currentStack.length-1].type = StoneType.FLAT;
            }

            const piecesToDrop = handToDrop.splice(0, dropCount);
            newBoard[dropRow][dropCol].push(...piecesToDrop);
        }

        setBoard(newBoard);
        setSelectedCell(null);
        setHand([]);
        endTurn(newBoard);
    };
    
    const pickupStack = (row: number, col: number, count: number) => {
        const stack = board[row][col];
        if (count > boardSize || count > stack.length) return;
        if (count === 0) { // Special case to just select the cell
            setSelectedCell({row, col});
            return;
        }


        const newBoard = board.map(r => r.map(c => [...c]));
        const newStack = newBoard[row][col];
        const pickedUp = newStack.splice(newStack.length - count, count);

        setBoard(newBoard);
        setHand(pickedUp);
        setSelectedCell({row, col});
    };

    const cancelMove = () => {
        if (!selectedCell) return;
        const newBoard = board.map(r => r.map(c => [...c]));
        if (hand.length > 0) {
            newBoard[selectedCell.row][selectedCell.col].push(...hand);
        }
        setBoard(newBoard);
        setHand([]);
        setSelectedCell(null);
    }
    
    const validMoves = useMemo(() => {
        if (!selectedCell || !hand.length) return new Map<string, number[][]>();
        const { row, col } = selectedCell;
        const moves = new Map<string, number[][]>();
        const handSize = hand.length;

        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dr, dc] of directions) {
            let pathClear = true;
            for (let dist = 1; dist <= handSize; dist++) {
                const newR = row + dr * dist;
                const newC = col + dc * dist;

                if (newR < 0 || newR >= boardSize || newC < 0 || newC >= boardSize || !pathClear) break;
                
                const stack = board[newR][newC];
                const topPiece = stack.length > 0 ? stack[stack.length - 1] : null;

                if (topPiece && (topPiece.type === StoneType.CAPSTONE || topPiece.type === StoneType.STANDING)) {
                     if (hand[hand.length-1].type === StoneType.CAPSTONE && dist === handSize) {
                         // can flatten a standing wall, so this is a valid move.
                     } else {
                        pathClear = false;
                     }
                }
                
                const key = `${newR},${newC}`;
                if (!moves.has(key)) moves.set(key, []);

                // Generate possible drop distributions
                function findDistributions(remainingPieces: number, remainingSteps: number, currentDistribution: number[]) {
                    if (remainingSteps === 1) {
                        if(remainingPieces > 0) moves.get(key)!.push([...currentDistribution, remainingPieces]);
                        return;
                    }
                    for (let i = 1; i <= remainingPieces - (remainingSteps - 1); i++) {
                        findDistributions(remainingPieces - i, remainingSteps - 1, [...currentDistribution, i]);
                    }
                }
                findDistributions(handSize, dist, []);
            }
        }
        return moves;
    }, [selectedCell, hand, boardSize, board]);


    return {
        boardSize,
        board,
        currentPlayer,
        phase,
        winner,
        turn,
        pieces,
        selectedCell,
        hand,
        validMoves,
        initializeGame,
        placePiece,
        pickupStack,
        moveStack,
        cancelMove
    };
};

export default useTakGame;