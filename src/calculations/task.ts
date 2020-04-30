import { ActivityRequirement, DurationUnit, Gender, IActivity, PowerMeter, Weight } from "../types";
import { calculateFTP, checkActivities, standardizeActivity } from "./ftp";
const filterActivites = (activity: IActivity) => {
  if (!activity.power.unit) {
    return false;
  }
  if (!activity.duration.unit) {
    return false;
  }
  if (!activity.power.value) {
    return false;
  }
  if (activity.duration.unit === DurationUnit.SECONDS && !activity.duration.value) {
    return false;
  }
  if (
    activity.duration.unit === DurationUnit.HH_MM_SS &&
    isNaN(activity.duration.hours!) &&
    isNaN(activity.duration.minutes!) &&
    isNaN(activity.duration.seconds!)
  ) {
    return false;
  }
  return true;
};

export const task6 = (
  activities: IActivity[],
  requirements: ActivityRequirement,
  weight?: Weight,
  gender?: Gender,
  powerMeter?: PowerMeter
) => {
  const filteredActivites = activities.filter(filterActivites);
  checkActivities(filteredActivites, requirements, weight);
  const convertedActivities = filteredActivites.map((activity) => standardizeActivity(activity, weight));
  return calculateFTP(convertedActivities, weight, gender, powerMeter);
};
export const task20 = (
  activities: IActivity[],
  requirements: ActivityRequirement,
  weight?: Weight,
  gender?: Gender,
  powerMeter?: PowerMeter
) => {
  const filteredActivites = activities.filter(filterActivites);
  checkActivities(filteredActivites, requirements, weight);
  const convertedActivities = filteredActivites.map((activity) => standardizeActivity(activity, weight));
  return calculateFTP(convertedActivities, weight, gender, powerMeter);
};
