export enum CALCULATOION_ERRORS {
  TOO_SIMILAR = "Activities too similar",
  EXPEXTED_SECONDS = "Needs duration in seconds",
  NO_POWER = "No power value found",
  NO_DURATION = "No duration value found",
  NO_WEIGHT = "No weight value found"
}
export enum PowerUnit {
  WATTS = "Watts",
  WATTS_KG = "Watts/kg"
}
export enum DurationUnit {
  HH_MM_SS = "hh:mm:ss",
  SECONDS = "Seconds"
}
export enum WeightUnit {
  KG = "Kilograms",
  LBS = "Pounds"
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female"
}

export enum PowerMeter {
  WIND = "Stryd Wind",
  NON_WIND = "Stryd non-Wind",
  OTHER = "Other"
}

export interface Activity {
  id: string;
  power: Power;
  duration: Duration;
  activityweight?: Weight;
}

export interface Weight {
  value?: number;
  unit: WeightUnit;
}

export interface Power {
  value?: number;
  unit: PowerUnit;
}

export type Duration = SecondDuration | TimeDuration;

export interface SecondDuration {
  value?: number;
  unit: DurationUnit.SECONDS;
}
export interface TimeDuration {
  hours?: number;
  minutes?: number;
  seconds?: number;
  unit: DurationUnit.HH_MM_SS;
}
