import "./GameBoard.css";

export const GameBoard = () => {
  return (
    <>
      <Row />
      <Row />
      <Row lastRow />
    </>
  );
};

const Dot = () => {
  return <span className="dot"></span>;
};

interface CellProps {
  drawVerticalOnly?: boolean;
  drawHorizontalOnly?: boolean;
}

const Cell = ({ drawVerticalOnly, drawHorizontalOnly }: CellProps) => {
  return (
    <div className="cell">
      {!drawHorizontalOnly && <Line direction="vertical" />}
      <Dot />
      {!drawVerticalOnly && <Line direction="horizontal" />}
    </div>
  );
};

interface RowProps {
  lastRow?: boolean;
}

const Row = ({ lastRow }: RowProps) => {
  return (
    <div className="row">
      <Cell drawHorizontalOnly={lastRow} />
      <Cell drawHorizontalOnly={lastRow} />
      <Cell drawVerticalOnly drawHorizontalOnly={lastRow} />
    </div>
  );
};

interface LineProps {
  direction: "horizontal" | "vertical";
}

const Line = ({ direction }: LineProps) => {
  return <div className={`line ${direction}`} />;
};
