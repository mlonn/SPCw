import { Weight, Gender, PowerMeter, Power, Duration } from "../../types";

export interface AthleteState {
  name?: string;
  gender?: Gender;
  powerMeter?: PowerMeter;
  weight?: Weight;
  ftp?: Power;
  tte: Duration;
}

export type Action =
  | ClearProfileAction
  | SetWeightAction
  | SetGenderAction
  | ClearGenderAction
  | SetPowerMeterAction
  | ClearPowerMeterAction
  | SetFtpAction
  | SetTteAction
  | SetNameAction;

export interface ClearProfileAction {
  type: TypeKeys.CLEAR_PROFILE;
}

export interface SetWeightAction {
  type: TypeKeys.SET_WEIGHT;
  weight: Weight;
}

export interface SetGenderAction {
  type: TypeKeys.SET_GENDER;
  gender: Gender;
}
export interface ClearGenderAction {
  type: TypeKeys.CLEAR_GENDER;
}

export interface SetPowerMeterAction {
  type: TypeKeys.SET_POWER_METER;
  powerMeter: PowerMeter;
}

export interface ClearPowerMeterAction {
  type: TypeKeys.CLEAR_POWER_METER;
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
  CLEAR_PROFILE = "CLEAR_PROFILE",
  SET_WEIGHT = "SET_WEIGHT",
  SET_GENDER = "SET_GENDER",
  CLEAR_GENDER = "CLEAR_GENDER",
  SET_POWER_METER = "SET_POWER_METER",
  CLEAR_POWER_METER = "CLEAR_POWER_METER",
  SET_FTP = "SET_FTP",
  SET_TTE = "SET_TTE",
  SET_NAME = "SET_NAME",
}
