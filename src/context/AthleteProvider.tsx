import React, { Dispatch } from "react";
import { Action, AthleteState } from "../hooks/useAthlete/types";
import { useAthlete } from "../hooks/useAthlete";

export const AthleteStateContext = React.createContext<AthleteState | undefined>(undefined);
export const AthlteActionContext = React.createContext<Dispatch<Action> | undefined>(undefined);

const AthleteProvider: React.FC<{}> = ({ children }) => {
  const [state, actions] = useAthlete();

  return (
    <AthleteStateContext.Provider value={state}>
      <AthlteActionContext.Provider value={actions}>{children}</AthlteActionContext.Provider>
    </AthleteStateContext.Provider>
  );
};

export default AthleteProvider;
