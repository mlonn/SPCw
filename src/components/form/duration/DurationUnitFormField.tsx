import { Box, FormField, FormFieldProps, Select } from "grommet";
import React from "react";
import { Duration, DurationUnit } from "../../../types";
import { secondsToTime, timeToSeconds } from "../../../util";

interface OwnProps {
  duration: Duration;
  setDuration: (value: Duration) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DurationFormField = ({ duration, setDuration, ref, name = "timeunit", label = "Time unit", ...rest }: Props) => {
  return (
    <Box justify="end">
      <FormField {...rest} label={label} name={name}>
        <Select
          name={name}
          value={duration?.unit}
          onChange={({ option }) => {
            if (option === DurationUnit.HH_MM_SS && duration.unit === DurationUnit.SECONDS) {
              setDuration(secondsToTime(duration));
            }
            if (option === DurationUnit.SECONDS && duration.unit === DurationUnit.HH_MM_SS) {
              setDuration(timeToSeconds(duration));
            }
          }}
          options={[...Object.values(DurationUnit)]}
        />
      </FormField>
    </Box>
  );
};

export default DurationFormField;
