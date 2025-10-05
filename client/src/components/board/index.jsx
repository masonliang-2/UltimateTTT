import React, { useState } from "react";
import { Cell } from "../cell";
import line1 from "./line-1.svg";
import line2 from "./line-2.svg";
import line3 from "./line-3.svg";
import line4 from "./line-4.svg";
import "./style.css";

export const Group = () => {
  const [cells, setCells] = useState(Array(81).fill(0));
  const [player, setPlayer] = useState(1); // 0 for none, 1 for O, 2 for X
  
  const handleClick = (index) => {
    if (cells[index] !== 0) return;
    const newCells = [...cells];
    newCells[index] = player;
    setCells(newCells);
    setPlayer(player === 1 ? 2 : 1);
  };

  return (
    <div className="board">
      {Array.from({ length: 9 }).map((_, row) =>
        <div className="board-row" key={row}>
          {Array.from({ length: 9 }).map((_, col) => {
            const idx = row * 9 + col;
            return (
              <Cell
                key={idx}
                value={cells[idx]}
                onClick={() => handleClick(idx)}
              />
            );
          })}
        </div>
      )}
      <img className="line" alt="Line" src={line1} />
      <img className="img" alt="Line" src={line2} />
      <img className="line-2" alt="Line" src={line3} />
      <img className="line-3" alt="Line" src={line4} />
    </div>
  );
};
