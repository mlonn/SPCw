import { Duration, Gender, Power, PowerMeter, Units, Weight } from "../../types";

export interface AthleteState {
  id: string;
  name?: string;
  gender?: Gender;
  powerMeter?: PowerMeter;
  weight?: Weight;
  ftp?: Power;
  tte: Duration;
  riegel?: number;
  units?: Units;
}

export type Action = ClearProfileAction | SetProfileAction;

export interface ClearProfileAction {
  type: TypeKeys.CLEAR_PROFILE;
}
export interface SetProfileAction {
  type: TypeKeys.SET_PROFILE;
  profile: AthleteState;
}

export enum TypeKeys {
  CLEAR_PROFILE = "CLEAR_PROFILE",
  SET_PROFILE = "SET_PROFILE",
}
