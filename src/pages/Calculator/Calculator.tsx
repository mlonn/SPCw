import React from "react";
import { Redirect, useParams } from "react-router-dom";
import calculators from "../../resources/calculators";
import C10 from "./C10";
import C11 from "./C11";
import C20 from "./C20";
import C6 from "./C6";
import C7 from "./C7";
import C8 from "./C8";
import C9 from "./C9";
const Calculator = () => {
  let { calculatorId } = useParams();
  if (!calculatorId) {
    return <Redirect to="/calculators" />;
  }
  const calculator = calculators.find((c) => c.id === parseInt(calculatorId || ""));
  if (!calculator?.active) {
    return <Redirect to="/calculators" />;
  }
  switch (calculatorId) {
    case "6":
      return <C6 />;
    case "7":
      return <C7 />;
    case "8":
      return <C8 />;
    case "9":
      return <C9 />;
    case "10":
      return <C10 />;
    case "20":
      return <C20 />;
    case "11":
      return <C11 />;
    default:
      return <Redirect to="/calculators" />;
  }
};

export default Calculator;
