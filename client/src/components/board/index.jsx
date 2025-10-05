import React, { useState } from "react";
import { Cell } from "../cell";
import line1 from "./line-1.svg";
import line2 from "./line-2.svg";
import line3 from "./line-3.svg";
import line4 from "./line-4.svg";
import "./style.css";

export const Board = ({ onCellClick }) => {
  const [cells, setCells] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [player, setPlayer] = useState(1); // 1 for O, 2 for X

  const handleClick = (row,col) => {
    onCellClick({ row,col });
  };

  return (
    <div className="board">
      {cells.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((value, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              onClick={() => handleClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
