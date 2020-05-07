import { Distance, Duration, DurationUnit, Power, PowerUnit, Scenario, Weight } from "../types";
import { round, toStandardDistance, toStandardDuration, toStandardPower, toStandardWeight } from "../util";
const iteration = (
  time: number,
  tte: number,
  weight: number,
  ftp: number,
  exponent: number,
  distance: number,
  re: number
): Scenario => {
  let power = ftp * Math.pow(time / tte, exponent);
  let requiredRe = distance / time / (power / weight);

  const newTime = distance / (re * (power / weight));
  if (Math.abs(re - requiredRe) < 0.0001) {
    return {
      riegel: exponent,
      re,
      power: { value: power, unit: PowerUnit.WATTS },
      time: { value: Math.round(time), unit: DurationUnit.SECONDS },
    };
  } else {
    return iteration(newTime, tte, weight, ftp, exponent, distance, re);
  }
};
export const calculateScenarios = (
  refrom: number,
  reto: number,
  riegelfrom: number,
  riegelto: number,
  distance: Distance,
  weight: Weight,
  tte: Duration,
  ftp: Power
) => {
  if (refrom > reto) {
    throw Error("From RE must be lower than to RE");
  }

  if (riegelfrom > riegelto) {
    throw Error("From riegel exponent must be lower than to riegel exponent");
  }

  const startDuration = 3600;
  const standardTte = toStandardDuration(tte);
  if (standardTte.value < 20 * 60 || standardTte.value > 80 * 60) {
    throw Error("Time to exhaustion error expecting 0:20:00-1:20:00");
  }

  const standardWeight = toStandardWeight(weight);
  const stdDistance = toStandardDistance(distance);
  const stdFtp = toStandardPower(ftp, weight);
  const scenarios: Scenario[] = [];

  for (let riegel = riegelfrom; riegel <= riegelto; riegel += 0.01) {
    for (let re = refrom; re <= reto; re += 0.01) {
      let { power, time } = iteration(
        startDuration,
        standardTte.value,
        standardWeight.value,
        stdFtp.value,
        riegel,
        stdDistance.value,
        re
      );

      scenarios.push({ riegel, re: round(re, 2), power, time });
    }
  }

  return scenarios;
};