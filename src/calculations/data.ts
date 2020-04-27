import { Gender, PowerMeter, RwcUnit, RwcRating } from "../types";

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
  const { average, stdDev, ...rest } = data;
  const low = average - stdDev * 1.645;
  const mediumLow = average - stdDev;
  const mediumHigh = average + stdDev;
  const high = average + stdDev * 1.645;

  return [
    { rating: RwcRating.TOO_LOW, min: Number.NEGATIVE_INFINITY, max: low, average, stdDev, ...rest },
    { rating: RwcRating.LOW, min: low, max: mediumLow, average, stdDev, ...rest },
    { rating: RwcRating.MEDIUM, min: mediumLow, max: mediumHigh, average, stdDev, ...rest },
    { rating: RwcRating.HIGH, min: mediumHigh, max: high, average, stdDev, ...rest },
    { rating: RwcRating.TOO_HIGH, min: high, max: Number.POSITIVE_INFINITY, average, stdDev, ...rest },
  ];
});
export const rwcTable = rwcData.map((data) => {
  const { average, stdDev, ...rest } = data;
  const low = average - stdDev * 1.645;
  const mediumLow = average - stdDev;
  const mediumHigh = average + stdDev;
  const high = average + stdDev * 1.645;

  return {
    ...rest,
    average,
    stdDev,
    TOO_LOW: { min: Number.NEGATIVE_INFINITY, max: low },
    LOW: { min: low, max: mediumLow },
    MEDIUM: { min: mediumLow, max: mediumHigh },
    HIGH: { min: mediumHigh, max: high },
    TOO_HIGH: { min: high, max: Number.POSITIVE_INFINITY },
  };
});
