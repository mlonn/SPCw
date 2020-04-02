import regression from "regression";
import {
  Activity,
  CALCULATOION_ERRORS,
  DurationUnit,
  Gender,
  INPUT_ERRORS,
  PowerMeter,
  PowerUnit,
  Weight,
  WeightUnit,
  RwcUnit,
  RwcRating
} from "../types";
import { timeToSeconds, toKg, round } from "../util";
import { rwcReference } from "./data";

const standardizeActivity = (activity: Activity, weight: Weight) => {
  if (!activity.power.value) {
    throw Error(CALCULATOION_ERRORS.NO_POWER);
  }
  if (activity.duration.unit === DurationUnit.SECONDS && !activity.duration.value) {
    throw Error(CALCULATOION_ERRORS.NO_DURATION);
  }
  let power = activity.power;
  let duration = activity.duration;
  if (activity.power.unit === PowerUnit.WATTS_KG) {
    if (!weight.value) {
      throw Error(CALCULATOION_ERRORS.NO_WEIGHT);
    }
    let weightValue = weight.value;
    if (weight.unit === WeightUnit.LBS) {
      weightValue = toKg(weight).value!;
    }
    power = {
      value: activity.power.value * weightValue,
      unit: PowerUnit.WATTS
    };
  }
  if (activity.duration.unit === DurationUnit.HH_MM_SS) {
    duration = timeToSeconds(activity.duration);
  }
  return {
    ...activity,
    power,
    duration
  };
};
const checkActivities = (activities: Activity[]): boolean => {
  if (activities.length < 2) {
    throw Error(INPUT_ERRORS.NOT_ENOUGH);
  }
  const seconds = activities.map(a => timeToSeconds(a.duration).value || 0);
  const max = Math.max(...seconds);
  const min = Math.min(...seconds);
  if (max - min < 360) {
    throw Error(INPUT_ERRORS.TO_CLOSE);
  }
  const sortedPower = [...activities].sort((a, b) => b.power.value! - a.power.value!);
  const durationAlsoSorted = sortedPower.every(
    (activity, i, arr) => !i || timeToSeconds(activity.duration).value! >= timeToSeconds(arr[i - 1].duration).value!
  );
  if (!durationAlsoSorted) {
    throw Error(INPUT_ERRORS.HIGH_LONG_POWER);
  }

  return true;
};
const checkRwc = (rwc: number, gender = Gender.MALE, powerMeter = PowerMeter.NON_WIND, weight: Weight) => {
  if (powerMeter === PowerMeter.OTHER) {
    return;
  }

  const kj = rwcReference.find(
    ref =>
      ref.gender === gender &&
      ref.powerMeter === powerMeter &&
      ref.unit === RwcUnit.KJ &&
      rwc / 1000 >= ref.min &&
      rwc / 1000 <= ref.max
  );
  if (weight.value) {
    const kg = toKg(weight).value!;
    const jkg = rwcReference.find(
      ref =>
        ref.gender === gender &&
        ref.powerMeter === powerMeter &&
        ref.unit === RwcUnit.JKG &&
        rwc / kg >= ref.min &&
        rwc / kg <= ref.max
    );

    switch (jkg?.rating) {
      case RwcRating.HIGH:
        break;

      default:
        break;
    }
  } else {
  }
};

export const calculateFTP = (activities: Activity[], weight: Weight, gender?: Gender, powerMeter?: PowerMeter) => {
  checkActivities(activities);
  const convertedActivities = activities.map(activity => standardizeActivity(activity, weight));
  const constantRegression = regression.linear(
    convertedActivities.map(a => {
      if (a.duration.unit !== DurationUnit.SECONDS) {
        throw Error(CALCULATOION_ERRORS.EXPEXTED_SECONDS);
      } else {
        return [Math.log(a.duration.value || 0), Math.log(a.power.value || 0)];
      }
    })
  );
  const valuesRegression = regression.linear(
    convertedActivities.map(a => {
      if (a.duration.unit !== DurationUnit.SECONDS) {
        throw Error(CALCULATOION_ERRORS.EXPEXTED_SECONDS);
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
  checkRwc(rwc, gender, powerMeter, weight);
  if (isNaN(r2)) {
    throw Error(CALCULATOION_ERRORS.TOO_SIMILAR);
  }
  return {
    reigel,
    ftp,
    ftpkg,
    rwc,
    rwckg,
    r2
  };
};
