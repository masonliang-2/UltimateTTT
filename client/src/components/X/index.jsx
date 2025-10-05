import React from "react";
import line5 from "./line-5.svg";
import line6 from "./line-6.svg";
import "./style.css";

export const X = ({ className }) => {
  return (
    <div className={`x ${className}`}>
      <img className="line" alt="Line" src={line6} />

      <img className="line" alt="Line" src={line5} />
    </div>
  );
};
