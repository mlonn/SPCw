export enum CALCULATION_ERRORS {
  TOO_SIMILAR = "Activities too similar",
  EXPEXTED_SECONDS = "Needs duration in seconds",
  NO_POWER = "No power value found",
  NO_DURATION = "No duration value found",
  NO_WEIGHT = "Please enter weight when using W/kg",
  RWC_TOO_HIGH = "",
  RWC_HIGH = "",
  RWC_LOW = "",
  RWC_TOO_LOW = "",
  POWER_ERROR = "POWER_ERROR",
}

export enum INPUT_ERRORS {
  TO_CLOSE = "Min/max durations should be at least 6 minutes apart",
  NOT_ENOUGH = "Please enter Power+Duration for 2 or more activities",
  HIGH_LONG_POWER = "Power should be higher at shorter durations",
  ENTER_WEIGHT = "Enter Stryd Weight to see FTP/Critical Power (Pt)/kg",
  POWER = "Power (Pt): Expecting 70-700 Watts (check value and/or Unit of Measure)",
  DURATION_ERROR = "Please enter duration between 2min and 30min",
}
export enum PowerUnit {
  WATTS = "Watts",
  WATTS_KG = "Watts/kg",
}
export enum RwcUnit {
  KJ = "KiloJules (kJ)",
  JKG = "Joules/kg (J/kg)",
}
export enum RwcRating {
  TOO_LOW = "Too Low",
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  TOO_HIGH = "Too High",
}
export enum DurationUnit {
  HH_MM_SS = "hh:mm:ss",
  SECONDS = "Seconds",
}
export enum WeightUnit {
  KG = "Kilograms",
  LBS = "Pounds",
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum PowerMeter {
  WIND = "Stryd Wind",
  NON_WIND = "Stryd non-Wind",
  OTHER = "Other",
}

export interface IActivity {
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
