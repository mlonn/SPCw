import regression from "regression";
import {
  CALCULATION_ERRORS,
  DurationUnit,
  Gender,
  IActivity,
  INPUT_ERRORS,
  PowerMeter,
  PowerUnit,
  RwcUnit,
  StandardActivity,
  StandardWeight,
  Weight,
  WeightUnit,
} from "../types";
import { round, timeToSeconds, toKg, toStandardDuration, toStandardPower, toStandardWeight } from "../util";
import { rwcReference } from "./data";
const filterActivites = (activity: IActivity) => {
  if (!activity.power.unit) {
    return false;
  }
  if (!activity.duration.unit) {
    return false;
  }
  if (!activity.power.value) {
    return false;
  }
  if (activity.duration.unit === DurationUnit.SECONDS && !activity.duration.value) {
    return false;
  }
  if (
    activity.duration.unit === DurationUnit.HH_MM_SS &&
    !activity.duration.hours &&
    !activity.duration.minutes &&
    !activity.duration.seconds
  ) {
    return false;
  }
  return true;
};
const standardizeActivity = (activity: IActivity, weight?: Weight): StandardActivity => {
  const power = toStandardPower(activity.power, weight);
  const duration = toStandardDuration(activity.duration);

  let activityWeight: StandardWeight | undefined;
  if (activity.activityWeight) {
    activityWeight = toStandardWeight(activity.activityWeight);
  }
  return {
    ...activity,
    activityWeight,
    power,
    duration,
  };
};
const checkActivities = (activities: IActivity[], weight?: Weight): boolean => {
  const seconds = activities.map((a) => timeToSeconds(a.duration).value || 0);

  if (seconds.some((s) => s && s < 120) || seconds.some((s) => s && s > 1800)) {
    throw Error(INPUT_ERRORS.DURATION_ERROR);
  }
  if (activities.some((a) => a.date)) {
    throw Error("hej");
  }
  const max = Math.max(...seconds);
  const min = Math.min(...seconds);
  if (max - min < 360) {
    throw Error(INPUT_ERRORS.TO_CLOSE);
  }
  activities.forEach((a) => {
    const { power } = a;
    if (power.value && weight) {
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
const checkRwc = (rwc: number, weight?: Weight, gender?: Gender, powerMeter?: PowerMeter) => {
  const powerMeterToUse = powerMeter || PowerMeter.NON_WIND;
  const genderToUse = gender || Gender.MALE;
  if (powerMeterToUse === PowerMeter.OTHER) {
    return;
  }
  let rating;
  if (weight?.value) {
    const kg = toKg(weight).value!;
    rating = rwcReference.find(
      (ref) =>
        ref.gender === genderToUse &&
        ref.powerMeter === powerMeterToUse &&
        ref.unit === RwcUnit.JKG &&
        Math.round(rwc / kg) >= ref.min &&
        Math.round(rwc / kg) <= ref.max
    )?.rating;
  } else {
    rating = rwcReference.find(
      (ref) =>
        ref.gender === genderToUse &&
        ref.powerMeter === powerMeterToUse &&
        ref.unit === RwcUnit.KJ &&
        round(rwc / 1000, 2) >= ref.min &&
        round(rwc / 1000, 2) <= ref.max
    )?.rating;
  }

  return rating;
};

export const calculateFTP = (activities: IActivity[], weight?: Weight, gender?: Gender, powerMeter?: PowerMeter) => {
  const filteredActivites = activities.filter(filterActivites);
  if (filteredActivites.length < 2) {
    throw Error(INPUT_ERRORS.NOT_ENOUGH);
  }
  const convertedActivities = filteredActivites.map((activity) => standardizeActivity(activity, weight));
  checkActivities(convertedActivities, weight);

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
  let weightValue = weight ? weight.value : undefined;
  if (weight?.value && weight.unit === WeightUnit.LBS) {
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
