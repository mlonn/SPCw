import { Activity, PowerUnit, DurationUnit, CALCULATOION_ERRORS, Weight, WeightUnit } from "../types";
import regression from "regression";
import { timeToSeconds, toKg } from "../util";

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
export const calculateFTP = (activities: Activity[], weight: Weight) => {
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
  let ftpkg;
  let weightValue = weight.value;
  if (weight.value && weight.unit === WeightUnit.LBS) {
    weightValue = toKg(weight).value!;
  }
  ftpkg = weightValue ? Math.round((valuesRegression.equation[0] / weightValue) * 100) / 100 : undefined;
  const rwc = Math.round(valuesRegression.equation[1]) / 1000;
  const r2 = valuesRegression.r2;
  if (isNaN(r2)) {
    throw Error(CALCULATOION_ERRORS.TOO_SIMILAR);
  }
  return {
    reigel,
    ftp,
    ftpkg,
    rwc,
    r2
  };
};
