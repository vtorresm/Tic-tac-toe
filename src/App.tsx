import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Users } from 'lucide-react';

// Tipo para representar el estado de cada casilla del tablero
type Player = 'X' | 'O' | null;
type Board = Player[];

// Tipo para el estado del juego
type GameState = 'playing' | 'won' | 'draw';

function App() {
  // Estado del tablero - array de 9 elementos representando las casillas
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  
  // Jugador actual - comienza con X
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  
  // Estado del juego (jugando, ganado, empate)
  const [gameState, setGameState] = useState<GameState>('playing');
  
  // Ganador de la partida
  const [winner, setWinner] = useState<Player>(null);
  
  // Línea ganadora para resaltar visualmente
  const [winningLine, setWinningLine] = useState<number[]>([]);

  /**
   * Función para verificar si hay un ganador
   * Comprueba todas las combinaciones posibles de victoria (filas, columnas, diagonales)
   */
  const checkWinner = (currentBoard: Board): { winner: Player; line: number[] } => {
    const winningCombinations = [
      [0, 1, 2], // Fila superior
      [3, 4, 5], // Fila media
      [6, 7, 8], // Fila inferior
      [0, 3, 6], // Columna izquierda
      [1, 4, 7], // Columna media
      [2, 5, 8], // Columna derecha
      [0, 4, 8], // Diagonal principal
      [2, 4, 6], // Diagonal secundaria
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        currentBoard[a] && 
        currentBoard[a] === currentBoard[b] && 
        currentBoard[a] === currentBoard[c]
      ) {
        return { winner: currentBoard[a], line: combination };
      }
    }

    return { winner: null, line: [] };
  };

  /**
   * Función para verificar si el tablero está lleno (empate)
   */
  const checkDraw = (currentBoard: Board): boolean => {
    return currentBoard.every(cell => cell !== null);
  };

  /**
   * Manejar el clic en una casilla del tablero
   */
  const handleCellClick = (index: number) => {
    // Prevenir jugadas si el juego ha terminado o la casilla está ocupada
    if (gameState !== 'playing' || board[index] !== null) {
      return;
    }

    // Crear una copia del tablero y colocar la marca del jugador actual
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    // Verificar si hay ganador
    const { winner: gameWinner, line } = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      setGameState('won');
      return;
    }

    // Verificar empate
    if (checkDraw(newBoard)) {
      setGameState('draw');
      return;
    }

    // Cambiar al siguiente jugador
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  /**
   * Reiniciar el juego a su estado inicial
   */
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameState('playing');
    setWinner(null);
    setWinningLine([]);
  };

  /**
   * Obtener las clases CSS para cada casilla
   */
  const getCellClasses = (index: number) => {
    let classes = 'w-20 h-20 sm:w-24 sm:h-24 border-2 border-slate-300 flex items-center justify-center text-3xl sm:text-4xl font-bold transition-all duration-200 ';
    
    // Estilos por defecto
    classes += 'bg-white hover:bg-slate-50 ';
    
    // Cursor y efectos hover solo si la casilla está disponible
    if (board[index] === null && gameState === 'playing') {
      classes += 'cursor-pointer hover:shadow-md hover:border-blue-400 ';
    } else if (gameState !== 'playing') {
      classes += 'cursor-not-allowed ';
    }
    
    // Resaltar casillas ganadoras
    if (winningLine.includes(index)) {
      classes += 'bg-green-100 border-green-400 ';
    }
    
    // Colores para X y O
    if (board[index] === 'X') {
      classes += 'text-blue-600 ';
    } else if (board[index] === 'O') {
      classes += 'text-red-600 ';
    }

    return classes;
  };

  /**
   * Obtener el mensaje de estado del juego
   */
  const getStatusMessage = () => {
    if (gameState === 'won') {
      return `¡Jugador ${winner} ha ganado!`;
    } else if (gameState === 'draw') {
      return '¡Es un empate!';
    } else {
      return `Turno del Jugador ${currentPlayer}`;
    }
  };

  /**
   * Obtener las clases CSS para el mensaje de estado
   */
  const getStatusClasses = () => {
    let classes = 'text-xl sm:text-2xl font-semibold transition-all duration-300 ';
    
    if (gameState === 'won') {
      classes += 'text-green-600 ';
    } else if (gameState === 'draw') {
      classes += 'text-orange-600 ';
    } else if (currentPlayer === 'X') {
      classes += 'text-blue-600 ';
    } else {
      classes += 'text-red-600 ';
    }
    
    return classes;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-md w-full">
        {/* Encabezado del juego */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-8 h-8 text-slate-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Tres en Raya
            </h1>
          </div>
          
          {/* Indicador de estado del juego */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {gameState === 'won' && <Trophy className="w-6 h-6 text-green-600" />}
            <p className={getStatusClasses()}>
              {getStatusMessage()}
            </p>
          </div>
        </div>

        {/* Tablero de juego */}
        <div className="grid grid-cols-3 gap-2 mb-8 justify-center">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className={getCellClasses(index)}
              disabled={gameState !== 'playing' || cell !== null}
            >
              <span className={cell ? 'animate-pulse' : ''}>
                {cell}
              </span>
            </button>
          ))}
        </div>

        {/* Botón de reinicio */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            <RotateCcw className="w-5 h-5" />
            Nuevo Juego
          </button>
        </div>

        {/* Estadísticas del juego */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">X</div>
              <div className="text-sm text-slate-600">Jugador 1</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">O</div>
              <div className="text-sm text-slate-600">Jugador 2</div>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Haz clic en una casilla vacía para realizar tu jugada
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;