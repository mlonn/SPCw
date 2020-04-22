import { Box, FormField, FormFieldProps, Select } from "grommet";
import React from "react";
import { Duration, DurationUnit } from "../../../types";
import { secondsToTime, timeToSeconds } from "../../../util";

interface OwnProps {
  duration: Duration;
  unitLabel?: string;
  setDuration: (value: Duration) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DurationUnitFormField = ({
  duration,
  setDuration,
  ref,
  name = "timeunit",
  unitLabel = "\u00A0",
  ...rest
}: Props) => {
  return (
    <Box justify="end">
      <FormField label={unitLabel} name={name} {...rest}>
        <Select
          name={name}
          value={duration.unit}
          onChange={({ option }) => {
            if (option === DurationUnit.HH_MM_SS && duration.unit === DurationUnit.SECONDS) {
              setDuration(secondsToTime(duration));
            } else if (option === DurationUnit.SECONDS && duration.unit === DurationUnit.HH_MM_SS) {
              setDuration(timeToSeconds(duration));
            } else {
              setDuration({ ...duration, unit: option });
            }
          }}
          options={[...Object.values(DurationUnit)]}
        />
      </FormField>
    </Box>
  );
};

export default DurationUnitFormField;
