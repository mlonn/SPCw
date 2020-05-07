import { DistanceUnit, DurationUnit, PowerUnit, WeightUnit } from "../types";
import { toKg, toLbs } from "../util";
import { calculateScenarios } from "./scenarios";

test("Scenarios", () => {
  const refrom = 0.9;
  const reto = 0.95;
  const riegelfrom = -0.09;
  const riegelto = -0.07;
  const distance = { unit: DistanceUnit.HALF_MARATHON };
  const weight = { value: 77, unit: WeightUnit.KG };
  const tte = { value: 3000, unit: DurationUnit.SECONDS };
  const ftp = { value: 331, unit: PowerUnit.WATTS };

  const scenarios = calculateScenarios(refrom, reto, riegelfrom, riegelto, distance, weight, tte, ftp);
  const result = [
    {
      riegel: -0.09,
      re: 0.9,
      power: { value: 312.0041666993113, unit: "Watts" },
      time: { value: 5785, unit: "Seconds" },
    },
    {
      riegel: -0.09,
      re: 0.91,
      power: { value: 312.3453016124287, unit: "Watts" },
      time: { value: 5715, unit: "Seconds" },
    },
    {
      riegel: -0.09,
      re: 0.92,
      power: { value: 312.6830750921717, unit: "Watts" },
      time: { value: 5647, unit: "Seconds" },
    },
    {
      riegel: -0.09,
      re: 0.93,
      power: { value: 313.01755626349006, unit: "Watts" },
      time: { value: 5580, unit: "Seconds" },
    },
    {
      riegel: -0.09,
      re: 0.94,
      power: { value: 313.3488121053101, unit: "Watts" },
      time: { value: 5515, unit: "Seconds" },
    },
    {
      riegel: -0.08,
      re: 0.9,
      power: { value: 314.23889640445566, unit: "Watts" },
      time: { value: 5744, unit: "Seconds" },
    },
    {
      riegel: -0.08,
      re: 0.91,
      power: { value: 314.5409672466168, unit: "Watts" },
      time: { value: 5676, unit: "Seconds" },
    },
    {
      riegel: -0.08,
      re: 0.92,
      power: { value: 314.8400223319951, unit: "Watts" },
      time: { value: 5609, unit: "Seconds" },
    },
    {
      riegel: -0.08,
      re: 0.93,
      power: { value: 315.13612406251036, unit: "Watts" },
      time: { value: 5543, unit: "Seconds" },
    },
    {
      riegel: -0.08,
      re: 0.94,
      power: { value: 315.42933289492936, unit: "Watts" },
      time: { value: 5479, unit: "Seconds" },
    },
    {
      riegel: -0.07,
      re: 0.9,
      power: { value: 316.4412138044233, unit: "Watts" },
      time: { value: 5704, unit: "Seconds" },
    },
    {
      riegel: -0.07,
      re: 0.91,
      power: { value: 316.7045036783808, unit: "Watts" },
      time: { value: 5637, unit: "Seconds" },
    },
    {
      riegel: -0.07,
      re: 0.92,
      power: { value: 316.96513149703486, unit: "Watts" },
      time: { value: 5571, unit: "Seconds" },
    },
    {
      riegel: -0.07,
      re: 0.93,
      power: { value: 317.2231526764925, unit: "Watts" },
      time: { value: 5507, unit: "Seconds" },
    },
    {
      riegel: -0.07,
      re: 0.94,
      power: { value: 317.4786208986446, unit: "Watts" },
      time: { value: 5444, unit: "Seconds" },
    },
  ];

  expect(scenarios).toEqual(result);
});

test("convert weight", () => {
  let kg = toKg({});
  expect(kg).toEqual({ unit: WeightUnit.KG });
  const noUnitKg = () => {
    toKg({ value: 5 });
  };
  expect(noUnitKg).toThrow(Error);

  let lbs = toLbs({});
  expect(lbs).toEqual({ unit: WeightUnit.LBS });
  const noUnitLbs = () => {
    toLbs({ value: 5 });
  };
  expect(noUnitLbs).toThrow(Error);
});

export default undefined;
