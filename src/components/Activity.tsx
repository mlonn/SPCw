import { Box, Button, Grid, ResponsiveContext } from "grommet";
import { Trash } from "grommet-icons";
import React, { memo, useContext } from "react";
import { IActivity, Weight } from "../types";
import DateFormField from "./form/date/DateFormField";
import DurationFormField from "./form/duration/DurationFormField";
import PowerFormField from "./form/power/PowerFormField";
interface ActivityContainerProps {
  date?: boolean;
}

interface Props {
  activity: IActivity;
  index: number;
  date?: boolean;
  weight?: Weight;
  canDelete?: boolean;
  onActivityChange: (index: number, activity: IActivity) => void;
  onDelete: (index: number) => void;
}
const Activity = (props: Props) => {
  const columnsDate = {
    small: ["1fr", "auto"],
    other: ["1fr", "2fr", "2fr", "auto"],
  };
  const areasDate = {
    small: [
      ["date", "delete"],
      ["power", "delete"],
      ["duration", "delete"],
    ],
    other: [["date", "power", "duration", "delete"]],
  };
  const columns = {
    small: ["1fr", "auto"],
    other: ["1fr", "1fr", "auto"],
  };
  const areas = {
    small: [
      ["power", "delete"],
      ["duration", "delete"],
    ],
    other: [["power", "duration", "delete"]],
  };
  const { activity, weight, onActivityChange, onDelete, canDelete = true, index, date } = props;
  const size = useContext(ResponsiveContext);

  let columnsVal;
  let areasVal;
  if (size === "small" || size === "medium") {
    columnsVal = date ? columnsDate["small"] : columns["small"];
    areasVal = date ? areasDate["small"] : areas["small"];
  } else {
    columnsVal = date ? columnsDate["other"] : columns["other"];
    areasVal = date ? areasDate["other"] : areas["other"];
  }
  if (!canDelete) {
    columnsVal.pop();
  }

  return (
    <Box background={index % 2 === 0 ? "light-3" : ""}>
      <Grid columns={columnsVal} areas={areasVal} pad={"small"} gap="small">
        {date && <DateFormField gridArea="date" {...props} />}
        <PowerFormField
          gridArea="power"
          power={activity.power}
          setPower={(newPower) => {
            const newActivity = { ...activity, power: newPower };
            onActivityChange(index, newActivity);
          }}
          weight={weight}
        />

        <DurationFormField
          gridArea="duration"
          duration={activity.duration}
          setDuration={(newDuration) => {
            const newActivity = { ...activity, duration: newDuration };
            onActivityChange(index, newActivity);
          }}
        />
        {canDelete && (
          <Box justify="center" gridArea="delete">
            <Button
              plain
              icon={<Trash />}
              onClick={() => {
                onDelete(index);
              }}
            />
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default memo(Activity);
