export enum CALCULATION_ERRORS {
  TOO_SIMILAR = "Activities too similar",
  EXPEXTED_SECONDS = "Needs duration in seconds",
  NO_POWER = "No power value found",
  NO_POWER_UNIT = "No power unit found",
  NO_DURATION = "No duration value found",
  NO_DURATION_UNIT = "No duration unit found",
  NO_WEIGHT = "Please enter weight when using W/kg",

  POWER_ERROR = "POWER_ERROR",
}

export enum INPUT_ERRORS {
  NOT_ENOUGH = "Please enter Power+Duration for 2 or more activities",
  HIGH_LONG_POWER = "Power should be higher at shorter durations",
  ENTER_WEIGHT = "Enter Stryd Weight to see FTP/Critical Power (Pt)/kg",
  POWER = "Power (Pt): Expecting 70-700 Watts (check value and/or Unit of Measure)",
  DURATION_ERROR = "Please enter duration between 2min and 30min",
  NO_DATE = "Please enter date for 2 or more activites",
}
export interface Calculator {
  id: number;
  title: string;
  active: boolean;
  requirements: ActivityRequirement;
}
export interface ActivityRequirement {
  date?: boolean;
  minDuration?: number;
  maxDuration?: number;
  durationDistance?: number;
  dateDistance?: number;
  durationRange?: {
    min: number;
    max: number;
  };
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

export enum TemperatureUnit {
  C = "Celcius",
  F = "Fahrenheit",
}

export enum DistanceUnit {
  METERS = "Meters",
  FEET = "Feet",
  MILES = "Miles",
  KM = "Kilometers",
  MARATHON = "Marathon",
  HALF_MARATHON = "Half Marathon",
  TEN_K = "10k",
  FIVE_K = "5k",
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
  date?: string;
  activityWeight?: Weight;
}

export interface StandardActivity {
  id: string;
  power: StandardPower;
  duration: StandardDuration;
  date?: string;
  activityWeight?: StandardWeight;
}

export interface Weight {
  value?: number;
  unit?: WeightUnit;
}

export interface StandardWeight {
  value: number;
  unit: WeightUnit.KG;
}

export interface Power {
  value?: number;
  unit?: PowerUnit;
}

export interface StandardPower {
  value: number;
  unit: PowerUnit.WATTS;
}

export type Duration = SecondDuration | TimeDuration;

export interface StandardDuration {
  value: number;
  unit: DurationUnit.SECONDS;
}

export interface SecondDuration {
  value?: number;
  unit?: DurationUnit.SECONDS;
}
export interface TimeDuration {
  hours?: number;
  minutes?: number;
  seconds?: number;
  unit?: DurationUnit.HH_MM_SS;
}
export interface Units {
  weight?: WeightUnit;
  power?: PowerUnit;
  duration?: DurationUnit;
}

export interface Temperature {
  value?: number;
  unit?: TemperatureUnit;
}

export interface Distance {
  value?: number;
  unit?: DistanceUnit;
}
