import { Calculator } from "../types";

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
  },
  {
    id: 20,
    title: "Calculate FTP/CP and RWC (W') using maximal efforts from different activities",
    active: true,
    requirements: {
      date: true,
      minDuration: 120,
      maxDuration: 2400,
      dateDistance: 14,
      durationRange: {
        min: 360,
        max: 900,
      },
    },
  },
];
export default calculators;
