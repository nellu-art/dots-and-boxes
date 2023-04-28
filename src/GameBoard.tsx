import { useState } from "react";
import "./GameBoard.css";

const boardSize = 3;

type CellData = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type Board = CellData[][];

const createBoardData = () => {
  const result = [];
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push({ top: 0, bottom: 0, left: 0, right: 0 });
    }
    result.push(row);
  }
  return result;
};

const initialBoardData = createBoardData();

export const GameBoard = () => {
  const [activePlayer, setActivePlayer] = useState<"player1" | "player2">(
    "player1"
  );
  const [board, setBoard] = useState<Board>(initialBoardData);

  const handleClick = (params: {
    rowIndex: number;
    colIndex: number;
    position: Position;
  }) => {
    const { rowIndex, colIndex, position } = params;
    const cell = board[rowIndex][colIndex];
    if (cell[position] !== 0) return;

    setActivePlayer((prevState) =>
      prevState === "player1" ? "player2" : "player1"
    );

    setBoard((prevState) => {
      const { rowIndex, colIndex, position } = params;
      const newState = [...prevState];
      const cell = newState[rowIndex][colIndex];
      switch (position) {
        case "top":
          cell.top = activePlayer === "player1" ? 1 : 2;
          break;
        case "bottom":
          cell.bottom = activePlayer === "player1" ? 1 : 2;
          break;
        case "left":
          cell.left = activePlayer === "player1" ? 1 : 2;
          break;
        case "right":
          cell.right = activePlayer === "player1" ? 1 : 2;
          break;
      }
      return newState;
    });
  };

  return (
    <div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
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

type Position = "top" | "bottom" | "left" | "right";
interface CellProps {
  rowIndex: number;
  colIndex: number;
  showRight?: boolean;
  showBottom?: boolean;
  completed?: boolean;
  onClick?: (params: {
    rowIndex: number;
    colIndex: number;
    position: Position;
  }) => void;
  data: CellData;
}

const Cell = ({
  rowIndex,
  colIndex,
  showRight,
  showBottom,
  completed,
  onClick,
  data,
}: CellProps) => {
  const handleClick = (position: Position) => {
    onClick?.({ rowIndex, colIndex, position });
  };

  return (
    <div className={`cell ${completed}`}>
      <Line
        position="top"
        selectedBy={
          data.top === 1 ? "player1" : data.top === 2 ? "player2" : undefined
        }
        onClick={() => handleClick("top")}
      />
      <Dot />
      <Line
        position="left"
        selectedBy={
          data.left === 1 ? "player1" : data.left === 2 ? "player2" : undefined
        }
        onClick={() => handleClick("left")}
      />
      {showRight && (
        <Line
          position="right"
          selectedBy={
            data.right === 1
              ? "player1"
              : data.right === 2
              ? "player2"
              : undefined
          }
          onClick={() => handleClick("right")}
        />
      )}
      {showBottom && (
        <Line
          position="bottom"
          selectedBy={
            data.bottom === 1
              ? "player1"
              : data.bottom === 2
              ? "player2"
              : undefined
          }
          onClick={() => handleClick("bottom")}
        />
      )}
    </div>
  );
};

interface LineProps {
  position: Position;
  selectedBy?: "player1" | "player2";
  onClick?: () => void;
}

const Line = ({ position, selectedBy, onClick }: LineProps) => {
  return <div className={`line ${position} ${selectedBy}`} onClick={onClick} />;
};

const Dot = () => {
  return <span className="dot"></span>;
};
