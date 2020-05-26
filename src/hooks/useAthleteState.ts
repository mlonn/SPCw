import { useContext } from "react";
import { AthleteStateContext } from "../context/AthleteProvider";

const useAthleteState = () => {
  const context = useContext(AthleteStateContext);

  if (context === undefined) {
    throw new Error("useAthleteState must be used within a AthleteProvider");
  }
  return context;
};

export default useAthleteState;
