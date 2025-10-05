import React from "react";
import "./style.css";
import { O } from "./components/O";
import { X } from "./components/X";

export const Cell = ({ value, onClick }) => {
  return (
    <div className="cell" onClick={onClick}>
      <span className="cell-value">
        {value === 1 ? <O /> : value === 2 ? <X /> : ""}
      </span>
    </div>
  );
};