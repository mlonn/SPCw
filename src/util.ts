import {
  TimeDuration,
  SecondDuration,
  DurationUnit,
  Duration,
  Weight,
  WeightUnit,
  Power,
  PowerUnit,
  RwcRating,
  Gender,
  PowerMeter
} from "./types";

export const round = (n: number, places: number) => {
  const factor = Math.pow(10, places);
  return Math.round(n * factor) / factor;
};

export const getPowerError = (power: Power, weight: Weight) => {
  if (!power.value) {
    return;
  }
  const value = power.value;
  if (power.unit === PowerUnit.WATTS_KG && (value < 1 || value > 10)) {
    return "Power (Pt): Expecting  1-10 Watts (check value and/or Unit of Measure)";
  }
  let kgs = 70;
  if (weight.value) {
    kgs = toKg(weight).value!;
    if (value < Math.floor(kgs) || value > Math.ceil(kgs * 10)) {
      return `Power (Pt): Expecting ${Math.floor(kgs)}-${Math.ceil(
        kgs * 10
      )} Watts (check value and/or Unit of Measure)`;
    }
  }
};

export const getRwcError = (rating: RwcRating, gender?: Gender, powerMeter?: PowerMeter) => {
  const prefix = rating === RwcRating.TOO_HIGH || rating === RwcRating.TOO_LOW ? "WARNING" : "NOTE";
  if (gender && powerMeter) {
    return `${prefix}: Your RWC (W') is '${rating}' for a ${gender} using ${powerMeter}`;
  } else {
    const enter = !gender && !powerMeter ? "Gender+Power Meter" : !gender ? "Gender" : !powerMeter ? "PowerMeter" : "";
    return `${prefix}: Your RWC (W') is rated '${rating}' - to check this rating, please enter ${enter}`;
  }
};

export const getFtpError = (rating: RwcRating) => {
  const prefix = rating === RwcRating.TOO_HIGH ? "under" : RwcRating.TOO_LOW ? "over" : "";
  if (rating === RwcRating.TOO_HIGH || rating === RwcRating.TOO_LOW) {
    return `WARNING: If your RWC (W') is '${rating}', FTP/CP may be ${prefix}-estimated`;
  } else {
    return null;
  }
};
export const toKg = (weight: Weight) => {
  if (!weight.value) {
    return weight;
  }
  if (weight.unit === WeightUnit.KG) {
    return weight;
  }
  return { ...weight, value: weight.value / 2.205 };
};
export const toLbs = (weight: Weight) => {
  if (!weight.value) {
    return weight;
  }
  if (weight.unit === WeightUnit.KG) {
    return weight;
  }
  return { ...weight, value: weight.value * 2.205 };
};
export const durationToString = (duration: Duration) => {
  const timeDuration = duration.unit === DurationUnit.HH_MM_SS ? duration : secondsToTime(duration);
  let hoursString = "00";
  let minuteString = "00";
  let secondString = "00";
  if (timeDuration.hours) {
    hoursString = timeDuration.hours > 9 ? `${timeDuration.hours}` : `0${timeDuration.hours}`;
  }
  if (timeDuration.minutes) {
    minuteString = timeDuration.minutes > 9 ? `${timeDuration.minutes}` : `0${timeDuration.minutes}`;
  }
  if (timeDuration.seconds) {
    secondString = timeDuration.seconds > 9 ? `${timeDuration.seconds}` : `0${timeDuration.seconds}`;
  }

  return `${hoursString}:${minuteString}:${secondString}`;
};

export const timeToSeconds = (duration: Duration): SecondDuration => {
  if (duration.unit === DurationUnit.SECONDS) {
    return duration;
  }
  const hours = duration.hours ? duration.hours * 60 * 60 : 0;
  const minutes = duration.minutes ? duration.minutes * 60 : 0;
  const seconds = duration.seconds ? duration.seconds : 0;
  return { unit: DurationUnit.SECONDS, value: hours + minutes + seconds };
};

export const secondsToTime = (duration: Duration): TimeDuration => {
  if (duration.unit === DurationUnit.HH_MM_SS) {
    return duration;
  }
  let totalSeconds = duration.value || 0;
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return { unit: DurationUnit.HH_MM_SS, hours, seconds, minutes };
};
