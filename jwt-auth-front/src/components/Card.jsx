import React from "react";
import style from "./Style.module.css";

function Card({ children, addClass }) {
  return <div className={`${style.card} ${addClass}`}>{children}</div>;
}

export default Card;
