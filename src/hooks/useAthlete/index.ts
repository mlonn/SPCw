import { Dispatch, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import { DurationUnit } from "../../types";
import { Action, AthleteState, TypeKeys } from "./types";
const initialState: AthleteState = {
  id: uuidv4(),
  weight: {},
  ftp: {},

  tte: { hours: 0, minutes: 50, seconds: 0, unit: DurationUnit.HH_MM_SS },
};
const athleteReducer = (state: AthleteState, action: Action) => {
  switch (action.type) {
    case TypeKeys.CLEAR_PROFILE:
      return updateStorage({ ...initialState });
    case TypeKeys.SET_PROFILE:
      return updateStorage({ ...action.profile });
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

  const [state, dispatch] = useReducer(athleteReducer, init);
  return [state, dispatch];
};
