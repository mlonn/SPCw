import { TimeDuration, SecondDuration, DurationUnit, Duration, Weight, WeightUnit } from "./types";

export const round = (n: number, places: number) => {
  const factor = Math.pow(10, places);
  return Math.round(n * factor) / factor;
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
