import { useReducer, Dispatch } from "react";
import { AthleteState, TypeKeys, Action } from "./types";
import { WeightUnit, PowerUnit, DurationUnit } from "../../types";

const modalReducer = (state: AthleteState, action: Action) => {
  switch (action.type) {
    case TypeKeys.SET_NAME:
      return updateStorage({ ...state, name: action.name });
    case TypeKeys.SET_FTP:
      return updateStorage({ ...state, ftp: action.ftp });
    case TypeKeys.SET_GENDER:
      return updateStorage({ ...state, gender: action.gender });
    case TypeKeys.SET_POWER_METER:
      return updateStorage({ ...state, powerMeter: action.powerMeter });
    case TypeKeys.SET_TTE:
      return updateStorage({ ...state, tte: action.tte });
    case TypeKeys.SET_WEIGHT:
      return updateStorage({ ...state, weight: action.weight });
    default:
      break;
  }
  return state;
};

const updateStorage = (state: AthleteState) => {
  window.localStorage.setItem("athlete", JSON.stringify(state));
  return state;
};

export const useAthlete = (): [AthleteState, Dispatch<Action>] => {
  const localState = window.localStorage.getItem("athlete");
  let initialState: AthleteState = {
    weight: { unit: WeightUnit.KG },
    ftp: { unit: PowerUnit.WATTS },
    tte: { hours: 0, minutes: 50, seconds: 0, unit: DurationUnit.HH_MM_SS }
  };
  if (localState) {
    initialState = JSON.parse(localState);
  } else {
    window.localStorage.setItem("athlete", JSON.stringify(initialState));
  }

  const [state, dispatch] = useReducer(modalReducer, initialState);
  return [state, dispatch];
};
