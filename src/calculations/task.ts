import { Gender, IActivity, PowerMeter, Weight } from "../types";
import { calculateFTP } from "./ftp";

export const task6 = (activities: IActivity[], weight?: Weight, gender?: Gender, powerMeter?: PowerMeter) => {
  return calculateFTP(activities, weight, gender, powerMeter);
};
