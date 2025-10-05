import React from "react";
import "./style.css";

export const Cell = ({ value, onClick }) => {
  return (
    <div className="cell" onClick={onClick}>
      <div className="rectangle" />
      <span className="cell-value">
        {value === 1 ? "O" : value === 2 ? "X" : ""}
      </span>
    </div>
  );
};