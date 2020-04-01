import { Weight, Gender, PowerMeter, Power, Duration } from "../../types";

export interface AthleteState {
  name?: string;
  gender?: Gender;
  powerMeter?: PowerMeter;
  weight: Weight;
  ftp: Power;
  tte: Duration;
}

export type Action =
  | SetWeightAction
  | SetGenderAction
  | SetPowerMeterAction
  | SetFtpAction
  | SetTteAction
  | SetNameAction;

export interface SetWeightAction {
  type: TypeKeys.SET_WEIGHT;
  weight: Weight;
}

export interface SetGenderAction {
  type: TypeKeys.SET_GENDER;
  gender: Gender;
}

export interface SetPowerMeterAction {
  type: TypeKeys.SET_POWER_METER;
  powerMeter: PowerMeter;
}

export interface SetFtpAction {
  type: TypeKeys.SET_FTP;
  ftp: Power;
}

export interface SetTteAction {
  type: TypeKeys.SET_TTE;
  tte: Duration;
}

export interface SetNameAction {
  type: TypeKeys.SET_NAME;
  name: string;
}

export enum TypeKeys {
  SET_WEIGHT = "SET_WEIGHT",
  SET_GENDER = "SET_GENDER",
  SET_POWER_METER = "SET_POWER_METER",
  SET_FTP = "SET_FTP",
  SET_TTE = "SET_TTE",
  SET_NAME = "SET_NAME"
}
