import React from "react";
import x from "./X.svg";
import "./style.css";

export const X = ({ className }) => {
  return (
    <div className={`x ${className}`}>
      <img className="x" alt="X" src={x} />
    </div>
  );
};
