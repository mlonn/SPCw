import { Dispatch, useReducer } from "react";
import { DurationUnit } from "../../types";
import { Action, AthleteState, TypeKeys } from "./types";
const initialState: AthleteState = {
  weight: {},
  ftp: {},
  tte: { hours: 0, minutes: 50, seconds: 0, unit: DurationUnit.HH_MM_SS },
};
const modalReducer = (state: AthleteState, action: Action) => {
  switch (action.type) {
    case TypeKeys.CLEAR_PROFILE:
      return updateStorage({ ...initialState });
    case TypeKeys.SET_NAME:
      return updateStorage({ ...state, name: action.name });
    case TypeKeys.SET_FTP:
      return updateStorage({ ...state, ftp: action.ftp });
    case TypeKeys.SET_GENDER:
      return updateStorage({ ...state, gender: action.gender });
    case TypeKeys.CLEAR_GENDER:
      return updateStorage({ ...state, gender: undefined });
    case TypeKeys.SET_POWER_METER:
      return updateStorage({ ...state, powerMeter: action.powerMeter });
    case TypeKeys.CLEAR_POWER_METER:
      return updateStorage({ ...state, powerMeter: undefined });
    case TypeKeys.SET_TTE:
      return updateStorage({ ...state, tte: action.tte });
    case TypeKeys.SET_WEIGHT:
      return updateStorage({ ...state, weight: action.weight });
    case TypeKeys.SET_UNITS:
      return updateStorage({ ...state, units: action.units });
    default:
      break;
  }
  return state;
};

const updateStorage = (newState: AthleteState) => {
  window.localStorage.setItem("athlete", JSON.stringify(newState));
  return newState;
};

export const useAthlete = (): [AthleteState, Dispatch<Action>] => {
  const localState = window.localStorage.getItem("athlete");
  let init = localState ? JSON.parse(localState) : initialState;

  window.localStorage.setItem("athlete", JSON.stringify(init));

  const [state, dispatch] = useReducer(modalReducer, init);
  return [state, dispatch];
};
