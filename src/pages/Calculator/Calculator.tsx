import React from "react";
import { useParams, Redirect } from "react-router-dom";
import C6 from "./C6";
const Calculator = () => {
  let { calculatorId } = useParams();
  switch (calculatorId) {
    case "6":
      return <C6 />;
    default:
      return <Redirect to="/calculators" />;
  }
};

export default Calculator;
