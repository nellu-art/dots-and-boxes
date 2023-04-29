import { useState } from 'react';
import './GameBoard.css';

const boardSize = 3;

type CellData = {
  top: string | null;
  bottom: string | null;
  left: string | null;
  right: string | null;
  completedBy?: string | null;
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
};

const getPlayersColor = (playerId: string) => {
  switch (playerId) {
    case PLAYERS_ID.PLAYER_1:
      return '#f00';
    case PLAYERS_ID.PLAYER_2:
      return '#00f';
  }
};

export const GameBoard = () => {
  const [activePlayer, setActivePlayer] = useState<string>(PLAYERS_ID.PLAYER_1);
  const [board, setBoard] = useState<Board>(initialBoardData);

  const handleClick = (params: { rowIndex: number; colIndex: number; position: Position }) => {
    const newState = [...board];
    const { rowIndex, colIndex, position } = params;
    const cell = newState[rowIndex][colIndex];

    if (cell[position] !== null) return;

    switch (position) {
      case 'top':
        cell.top = activePlayer;
        break;
      case 'bottom':
        cell.bottom = activePlayer;
        break;
      case 'left':
        cell.left = activePlayer;
        break;
      case 'right':
        cell.right = activePlayer;
        break;
    }

    const hasAllSelectedLine = Object.values(cell).every((value) => value !== null);

    if (hasAllSelectedLine) {
      cell.completedBy = activePlayer;
    } else {
      setActivePlayer((prevState) =>
        prevState === PLAYERS_ID.PLAYER_1 ? PLAYERS_ID.PLAYER_2 : PLAYERS_ID.PLAYER_1
      );
    }

    setBoard(newState);
  };

  return (
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

const Cell = ({ rowIndex, colIndex, showRight, showBottom, onClick, data }: CellProps) => {
  const handleClick = (position: Position) => {
    onClick({ rowIndex, colIndex, position });
  };

  // const getCompletedClassName = () => {
  //   if (data.completedBy === 1) return 'player1';
  //   if (data.completedBy === 2) return 'player2';
  //   return '';
  // };

  return (
    <div className={`cell`}>
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
  selectedBy?: string;
  onClick?: () => void;
}

const Line = ({ position, selectedBy, onClick }: LineProps) => {
  const color = getPlayersColor(selectedBy || '');

  return (
    <div className={`line ${position}`} style={{ backgroundColor: color }} onClick={onClick} />
  );
};

const Dot = () => {
  return <span className='dot'></span>;
};
