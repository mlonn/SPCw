import regression from "regression";
import {
  Activity,
  CALCULATION_ERRORS,
  DurationUnit,
  Gender,
  INPUT_ERRORS,
  PowerMeter,
  PowerUnit,
  Weight,
  WeightUnit,
  RwcUnit,
  RwcRating,
} from "../types";
import { timeToSeconds, toKg, round } from "../util";
import { rwcReference } from "./data";

const standardizeActivity = (activity: Activity, weight: Weight) => {
  if (!activity.power.value) {
    throw Error(CALCULATION_ERRORS.NO_POWER);
  }
  if (activity.duration.unit === DurationUnit.SECONDS && !activity.duration.value) {
    throw Error(CALCULATION_ERRORS.NO_DURATION);
  }
  let power = activity.power;
  let duration = activity.duration;
  if (activity.power.unit === PowerUnit.WATTS_KG) {
    if (!weight.value) {
      throw Error(CALCULATION_ERRORS.NO_WEIGHT);
    }
    let weightValue = weight.value;
    if (weight.unit === WeightUnit.LBS) {
      weightValue = toKg(weight).value!;
    }
    power = {
      value: activity.power.value * weightValue,
      unit: PowerUnit.WATTS,
    };
  }
  if (activity.duration.unit === DurationUnit.HH_MM_SS) {
    duration = timeToSeconds(activity.duration);
  }
  return {
    ...activity,
    power,
    duration,
  };
};
const checkActivities = (activities: Activity[], weight: Weight): boolean => {
  if (activities.length < 2) {
    throw Error(INPUT_ERRORS.NOT_ENOUGH);
  }

  const seconds = activities.map((a) => timeToSeconds(a.duration).value || 0);
  if (seconds.some((s) => s < 120) || seconds.some((s) => s > 1800)) {
    throw Error(INPUT_ERRORS.DURATION_ERROR);
  }
  const max = Math.max(...seconds);
  const min = Math.min(...seconds);
  if (max - min < 360) {
    throw Error(INPUT_ERRORS.TO_CLOSE);
  }
  activities.forEach((a) => {
    const { power } = a;
    if (!power.value) {
      throw Error(CALCULATION_ERRORS.NO_POWER);
    }
    if (!weight.value && power.unit === PowerUnit.WATTS_KG) {
      throw Error(INPUT_ERRORS.ENTER_WEIGHT);
    }
    if (power.unit === PowerUnit.WATTS_KG && (power.value < 1 || power.value > 10)) {
      throw Error("Please enter Watts/kg between 1 and 10");
    }
    if (weight.value && power.unit === PowerUnit.WATTS) {
      const kgs = toKg(weight).value!;
      if (power.value < Math.floor(kgs) || power.value > Math.ceil(kgs * 10)) {
        throw Error(
          `Power (Pt): Expecting ${Math.floor(kgs)}-${Math.ceil(kgs * 10)} Watts (check value and/or Unit of Measure)`
        );
      }
    }
    if (!weight.value && power.unit === PowerUnit.WATTS) {
      if (power.value < 70 || power.value > 700) {
        throw Error(INPUT_ERRORS.POWER);
      }
    }
  });
  const sortedPower = [...activities].sort((a, b) => b.power.value! - a.power.value!);
  const durationAlsoSorted = sortedPower.every(
    (activity, i, arr) => !i || timeToSeconds(activity.duration).value! >= timeToSeconds(arr[i - 1].duration).value!
  );
  if (!durationAlsoSorted) {
    throw Error(INPUT_ERRORS.HIGH_LONG_POWER);
  }

  return true;
};
const checkRwc = (rwc: number, weight: Weight, gender?: Gender, powerMeter?: PowerMeter) => {
  const powerMeterToUse = powerMeter || PowerMeter.NON_WIND;
  const genderToUse = gender || Gender.MALE;
  if (powerMeterToUse === PowerMeter.OTHER) {
    return;
  }
  let rating;
  if (weight.value) {
    const kg = toKg(weight).value!;
    rating = rwcReference.find(
      (ref) =>
        ref.gender === genderToUse &&
        ref.powerMeter === powerMeterToUse &&
        ref.unit === RwcUnit.JKG &&
        rwc / kg >= ref.min &&
        rwc / kg <= ref.max
    )?.rating;
  } else {
    rating = rwcReference.find(
      (ref) =>
        ref.gender === genderToUse &&
        ref.powerMeter === powerMeterToUse &&
        ref.unit === RwcUnit.KJ &&
        rwc / 1000 >= ref.min &&
        rwc / 1000 <= ref.max
    )?.rating;
  }

  return rating;
};

export const calculateFTP = (activities: Activity[], weight: Weight, gender?: Gender, powerMeter?: PowerMeter) => {
  checkActivities(activities, weight);
  const convertedActivities = activities.map((activity) => standardizeActivity(activity, weight));
  const constantRegression = regression.linear(
    convertedActivities.map((a) => {
      if (a.duration.unit !== DurationUnit.SECONDS) {
        throw Error(CALCULATION_ERRORS.EXPEXTED_SECONDS);
      } else {
        return [Math.log(a.duration.value || 0), Math.log(a.power.value || 0)];
      }
    })
  );
  const valuesRegression = regression.linear(
    convertedActivities.map((a) => {
      if (a.duration.unit !== DurationUnit.SECONDS) {
        throw Error(CALCULATION_ERRORS.EXPEXTED_SECONDS);
      } else {
        const duration = a.duration.value || 0;
        const power = a.power.value || 0;
        return [duration, duration * power];
      }
    })
  );

  const reigel = constantRegression.equation[0];
  const ftp = valuesRegression.equation[0];
  let ftpkg, rwckg;
  let weightValue = weight.value;
  if (weight.value && weight.unit === WeightUnit.LBS) {
    weightValue = toKg(weight).value!;
  }
  ftpkg = weightValue ? Math.round((ftp / weightValue) * 100) / 100 : undefined;
  const rwc = Math.round(valuesRegression.equation[1]) / 1000;
  rwckg = weightValue ? round(valuesRegression.equation[1] / weightValue, 2) : undefined;
  const r2 = valuesRegression.r2;
  const rwcRating = checkRwc(valuesRegression.equation[1], weight, gender, powerMeter);
  if (isNaN(r2)) {
    throw Error(CALCULATION_ERRORS.TOO_SIMILAR);
  }
  return {
    reigel,
    ftp,
    ftpkg,
    rwc,
    rwckg,
    rwcRating,
    r2,
  };
};
