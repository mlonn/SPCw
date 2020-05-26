import { useContext } from "react";
import { AthlteActionContext } from "../context/AthleteProvider";

const useAthleteAction = () => {
  const context = useContext(AthlteActionContext);

  if (context === undefined) {
    throw new Error("useAthleteContext must be used within a AthleteProvider");
  }
  return context;
};

export default useAthleteAction;
