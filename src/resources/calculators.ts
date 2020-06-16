import { CALCULATION_TYPE, Calculator } from "../types";

const calculators: Calculator[] = [
  {
    id: 6,
    title: "Calculate FTP/CP and RWC (W') from a CP test",
    active: true,
    requirements: {
      minDuration: 120,
      maxDuration: 1800,
      durationDistance: 360,
    },
    type: CALCULATION_TYPE.FTP_CP,
  },
  {
    id: 20,
    title: "Calculate FTP/CP and RWC (W') using maximal efforts from different activities",
    active: true,
    requirements: {
      date: true,
      minDuration: 120,
      maxDuration: 2400,
      dateDistance: 21,
      durationRange: {
        min: 360,
        max: 900,
      },
    },
    type: CALCULATION_TYPE.FTP_CP,
  },
  {
    id: 11,
    title: "Generate Race Power Scenarios using FTP/CP, Riegel Exponents and Running Effectiveness",
    active: true,
    requirements: {},
    type: CALCULATION_TYPE.RACE_POWER_PLANNING,
  },
  {
    id: 21,
    title: "Generate Race Power Scenarios using Prior Race data, Riegel Exponents and Running Effectiveness",
    active: true,
    requirements: {},
    type: CALCULATION_TYPE.RACE_POWER_PLANNING,
  },
  {
    id: 7,
    title: "Calculate FTP/CP from a Prior Race Power/Time and Riegel Exponent",
    active: true,
    requirements: {},
    type: CALCULATION_TYPE.FTP_CP,
  },
  {
    id: 8,
    title: "Calculate Race Target Power using FTP/CP, Target Time and Riegel Exponent",
    active: true,
    requirements: {},
    type: CALCULATION_TYPE.RACE_POWER_PLANNING,
  },
  {
    id: 9,
    title: "Calculate Race Target Power from a Prior Race, Target Time and Riegel Exponent",
    active: true,
    requirements: {},
    type: CALCULATION_TYPE.RACE_POWER_PLANNING,
  },
  {
    id: 10,
    title: "Calculate Race Target Power from a Prior Race, Target Distance and Riegel Exponent",
    active: true,
    requirements: {},
    type: CALCULATION_TYPE.RACE_POWER_PLANNING,
  },
];
export default calculators;
