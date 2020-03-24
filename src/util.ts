import { TimeDuration, SecondDuration, DurationUnit } from "./types";

export const durationToString = (duration: TimeDuration) => {
  let hoursString = "00";
  let minuteString = "00";
  let secondString = "00";
  if (duration.hours) {
    hoursString = duration.hours > 9 ? `${duration.hours}` : `0${duration.hours}`;
  }
  if (duration.minutes) {
    minuteString = duration.minutes > 9 ? `${duration.minutes}` : `0${duration.minutes}`;
  }
  if (duration.seconds) {
    secondString = duration.seconds > 9 ? `${duration.seconds}` : `0${duration.seconds}`;
  }

  return `${hoursString}:${minuteString}:${secondString}`;
};

export const timeToSeconds = (duration: TimeDuration): SecondDuration => {
  const hours = duration.hours ? duration.hours * 60 * 60 : 0;
  const minutes = duration.minutes ? duration.minutes * 60 : 0;
  const seconds = duration.seconds ? duration.seconds : 0;
  return { unit: DurationUnit.SECONDS, value: hours + minutes + seconds };
};

export const secondsToTime = (duration: SecondDuration): TimeDuration => {
  let totalSeconds = duration.value || 0;
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return { unit: DurationUnit.HH_MM_SS, hours, seconds, minutes };
};
