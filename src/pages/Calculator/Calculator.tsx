import React from "react";
import { Redirect, useParams } from "react-router-dom";
import C11 from "./C11";
import C20 from "./C20";
import C6 from "./C6";
const Calculator = () => {
  let { calculatorId } = useParams();
  switch (calculatorId) {
    case "6":
      return <C6 />;
    case "20":
      return <C20 />;
    case "11":
      return <C11 />;
    default:
      return <Redirect to="/calculators" />;
  }
};

export default Calculator;
