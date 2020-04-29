import { Gender, PowerMeter, RwcRating, RwcUnit } from "../types";
import { round } from "../util";

const rwcData = [
  { gender: Gender.MALE, powerMeter: PowerMeter.NON_WIND, unit: RwcUnit.JKG, average: 108, stdDev: 28 },
  { gender: Gender.FEMALE, powerMeter: PowerMeter.NON_WIND, unit: RwcUnit.JKG, average: 102, stdDev: 17 },
  { gender: Gender.MALE, powerMeter: PowerMeter.WIND, unit: RwcUnit.JKG, average: 138, stdDev: 28 },
  { gender: Gender.FEMALE, powerMeter: PowerMeter.WIND, unit: RwcUnit.JKG, average: 132, stdDev: 17 },
  { gender: Gender.MALE, powerMeter: PowerMeter.NON_WIND, unit: RwcUnit.KJ, average: 7.73, stdDev: 2.09 },
  { gender: Gender.FEMALE, powerMeter: PowerMeter.NON_WIND, unit: RwcUnit.KJ, average: 5.72, stdDev: 1.06 },
  { gender: Gender.MALE, powerMeter: PowerMeter.WIND, unit: RwcUnit.KJ, average: 9.73, stdDev: 2.09 },
  { gender: Gender.FEMALE, powerMeter: PowerMeter.WIND, unit: RwcUnit.KJ, average: 7.72, stdDev: 1.06 },
];
export const rwcReference = rwcData.flatMap((data) => {
  const { average, stdDev, unit, ...rest } = data;
  let low = average - stdDev * 1.645;
  let mediumLow = average - stdDev;
  let mediumHigh = average + stdDev;
  let high = average + stdDev * 1.645;
  let step;
  if (unit === RwcUnit.JKG) {
    low = Math.round(low);
    mediumLow = Math.round(mediumLow);
    mediumHigh = Math.round(mediumHigh);
    high = Math.round(high);
    step = 1;
  } else {
    low = round(low, 2);
    mediumLow = round(mediumLow, 2);
    mediumHigh = round(mediumHigh, 2);
    high = round(high, 2);
    step = 0.01;
  }
  return [
    { rating: RwcRating.TOO_LOW, min: Number.NEGATIVE_INFINITY, max: low - step, unit, ...rest },
    { rating: RwcRating.LOW, min: low, max: mediumLow - step, unit, ...rest },
    { rating: RwcRating.MEDIUM, min: mediumLow, max: mediumHigh, unit, ...rest },
    { rating: RwcRating.HIGH, min: mediumHigh + step, max: high, unit, ...rest },
    { rating: RwcRating.TOO_HIGH, min: high + step, max: Number.POSITIVE_INFINITY, unit, ...rest },
  ];
});
