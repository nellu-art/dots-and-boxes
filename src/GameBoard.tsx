import { createUseStyles } from 'react-jss';
import { useState } from 'react';
import './GameBoard.css';

const boardSize = 6;

type PlayerId = string;

type CellData = {
  top: PlayerId | null;
  bottom: PlayerId | null;
  left: PlayerId | null;
  right: PlayerId | null;
  completedBy?: PlayerId | null;
};

type Board = CellData[][];

const createBoardData = (): Board => {
  const result: Array<CellData[]> = [];

  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push({ top: null, bottom: null, left: null, right: null });
    }
    result.push(row);
  }

  return result;
};

const initialBoardData = createBoardData();

const PLAYERS_ID = {
  PLAYER_1: '1',
  PLAYER_2: '2',
} as const;

const getPlayersColor = (playerId: PlayerId) => {
  switch (playerId) {
    case PLAYERS_ID.PLAYER_1:
      return '#FF7F50';
    case PLAYERS_ID.PLAYER_2:
      return '#5D3FD3';
  }
};

function getCellNeighbors({
  board,
  rowIndex,
  colIndex,
}: {
  board: Board;
  rowIndex: number;
  colIndex: number;
}) {
  const neighbors: {
    top: CellData | null;
    bottom: CellData | null;
    left: CellData | null;
    right: CellData | null;
  } = {
    top: null,
    bottom: null,
    left: null,
    right: null,
  };

  if (rowIndex > 0) {
    neighbors.top = board[rowIndex - 1][colIndex];
  }

  if (rowIndex < boardSize - 1) {
    neighbors.bottom = board[rowIndex + 1][colIndex];
  }

  if (colIndex > 0) {
    neighbors.left = board[rowIndex][colIndex - 1];
  }

  if (colIndex < boardSize - 1) {
    neighbors.right = board[rowIndex][colIndex + 1];
  }

  return neighbors;
}

function isCellCompleted(cell: CellData) {
  const cellBorders = { top: cell.top, bottom: cell.bottom, left: cell.left, right: cell.right };

  return Object.values(cellBorders).every((value) => value !== null);
}

function getPlayerName(playerId: PlayerId) {
  switch (playerId) {
    case PLAYERS_ID.PLAYER_1:
      return 'Player 1';
    case PLAYERS_ID.PLAYER_2:
      return 'Player 2';
  }
}

const useGameBoardStyles = createUseStyles({
  player1BoxColor: {
    '&::after': {
      backgroundColor: getPlayersColor(PLAYERS_ID.PLAYER_1),
    },
  },
  player2BoxColor: {
    '&::after': {
      backgroundColor: getPlayersColor(PLAYERS_ID.PLAYER_2),
    },
  },
});

function getWinner({
  playersScore,
  boardSize,
}: {
  playersScore: { [key: PlayerId]: number };
  boardSize: number;
}): PlayerId | 'draw' | null {
  const totalCells = boardSize * boardSize;

  if (playersScore[PLAYERS_ID.PLAYER_1] + playersScore[PLAYERS_ID.PLAYER_2] === totalCells) {
    if (playersScore[PLAYERS_ID.PLAYER_1] > playersScore[PLAYERS_ID.PLAYER_2]) {
      return PLAYERS_ID.PLAYER_1;
    } else if (playersScore[PLAYERS_ID.PLAYER_1] < playersScore[PLAYERS_ID.PLAYER_2]) {
      return PLAYERS_ID.PLAYER_2;
    } else {
      return 'draw' as const;
    }
  }

  return null;
}

export const GameBoard = () => {
  const classes = useGameBoardStyles();
  const [activePlayer, setActivePlayer] = useState<PlayerId>(PLAYERS_ID.PLAYER_1);
  const [board, setBoard] = useState<Board>(initialBoardData);
  const [playersScore, setPlayersScore] = useState<{ [key: PlayerId]: number }>({
    [PLAYERS_ID.PLAYER_1]: 0,
    [PLAYERS_ID.PLAYER_2]: 0,
  });

  const winnerId = getWinner({ playersScore, boardSize });

  const handleClick = (params: { rowIndex: number; colIndex: number; position: Position }) => {
    const newState = [...board];
    const { rowIndex, colIndex, position } = params;
    const cell = newState[rowIndex][colIndex];

    if (cell[position] !== null) return;

    const cellNeighbors = getCellNeighbors({ board: newState, rowIndex, colIndex });

    switch (position) {
      case 'top':
        cell.top = activePlayer;

        if (cellNeighbors.top) {
          cellNeighbors.top.bottom = activePlayer;
        }

        break;
      case 'bottom':
        cell.bottom = activePlayer;

        break;
      case 'left':
        cell.left = activePlayer;

        if (cellNeighbors.left) {
          cellNeighbors.left.right = activePlayer;
        }

        break;
      case 'right':
        cell.right = activePlayer;

        break;
    }

    let hasCompletedCell = false;

    if (!cell.completedBy && isCellCompleted(cell)) {
      cell.completedBy = activePlayer;

      setPlayersScore((prevState) => ({
        ...prevState,
        [activePlayer]: prevState[activePlayer] + 1,
      }));

      hasCompletedCell = true;
    }

    if (cellNeighbors.top && !cellNeighbors.top.completedBy && isCellCompleted(cellNeighbors.top)) {
      cellNeighbors.top.completedBy = activePlayer;

      setPlayersScore((prevState) => ({
        ...prevState,
        [activePlayer]: prevState[activePlayer] + 1,
      }));

      hasCompletedCell = true;
    }

    if (
      cellNeighbors.left &&
      !cellNeighbors.left.completedBy &&
      isCellCompleted(cellNeighbors.left)
    ) {
      cellNeighbors.left.completedBy = activePlayer;

      setPlayersScore((prevState) => ({
        ...prevState,
        [activePlayer]: prevState[activePlayer] + 1,
      }));

      hasCompletedCell = true;
    }

    if (!hasCompletedCell) {
      setActivePlayer((prevState) =>
        prevState === PLAYERS_ID.PLAYER_1 ? PLAYERS_ID.PLAYER_2 : PLAYERS_ID.PLAYER_1
      );
    }

    setBoard(newState);
  };

  return (
    <>
      <h3 className='player-name'>{`Now: ${getPlayerName(activePlayer)}`}</h3>

      <div className='game-container'>
        <div className={`score ${classes.player1BoxColor}`}>
          <h3 className='result-label'>
            {winnerId &&
              (winnerId === 'draw' ? 'Draw' : winnerId === PLAYERS_ID.PLAYER_1 ? 'Win' : 'Lose')}
          </h3>
          <p>{getPlayerName(PLAYERS_ID.PLAYER_1)}</p>
          <p className='bold'>Score: {playersScore[PLAYERS_ID.PLAYER_1]}</p>
        </div>

        <div>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className='row'>
              {row.map((col, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  data={col}
                  onClick={handleClick}
                  showRight={colIndex === boardSize - 1}
                  showBottom={rowIndex === boardSize - 1}
                />
              ))}
            </div>
          ))}
        </div>

        <div className={`score ${classes.player2BoxColor}`}>
          <h3 className='result-label'>
            {winnerId &&
              (winnerId === 'draw' ? 'Draw' : winnerId === PLAYERS_ID.PLAYER_2 ? 'Win' : 'Lose')}
          </h3>
          <p>{getPlayerName(PLAYERS_ID.PLAYER_2)}</p>
          <p className='bold'>Score: {playersScore[PLAYERS_ID.PLAYER_2]}</p>
        </div>
      </div>
    </>
  );
};

type Position = 'top' | 'bottom' | 'left' | 'right';
interface CellProps {
  rowIndex: number;
  colIndex: number;
  showRight?: boolean;
  showBottom?: boolean;
  onClick: (params: { rowIndex: number; colIndex: number; position: Position }) => void;
  data: CellData;
}

const useCellStyles = createUseStyles<'completedBoxColor', { color?: string }>({
  completedBoxColor: {
    '&::after': {
      backgroundColor: ({ color }) => color,
    },
  },
});

const Cell = ({ rowIndex, colIndex, showRight, showBottom, onClick, data }: CellProps) => {
  const completedByColor = getPlayersColor(data.completedBy || '');
  const classes = useCellStyles({ color: completedByColor });

  const handleClick = (position: Position) => {
    onClick({ rowIndex, colIndex, position });
  };

  return (
    <div className={`cell ${completedByColor ? 'completed' : ''} ${classes.completedBoxColor}`}>
      <Line position='top' selectedBy={data.top || undefined} onClick={() => handleClick('top')} />
      <Dot />
      <Line
        position='left'
        selectedBy={data.left || undefined}
        onClick={() => handleClick('left')}
      />
      {showRight && (
        <Line
          position='right'
          selectedBy={data.right || undefined}
          onClick={() => handleClick('right')}
        />
      )}
      {showBottom && (
        <Line
          position='bottom'
          selectedBy={data.bottom || undefined}
          onClick={() => handleClick('bottom')}
        />
      )}
    </div>
  );
};

interface LineProps {
  position: Position;
  selectedBy?: PlayerId;
  onClick?: () => void;
}

const Line = ({ position, selectedBy, onClick }: LineProps) => {
  const color = getPlayersColor(selectedBy || '');

  return (
    <div
      className={`line ${position} ${color ? 'completed' : ''}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  );
};

const Dot = () => {
  return <span className='dot'></span>;
};
