import { Box, FormField, FormFieldProps, Select } from "grommet";
import React from "react";
import { Duration, DurationUnit } from "../../../types";

interface OwnProps {
  duration?: Duration;
  unitLabel?: string;
  setDuration: (value: Duration) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DurationUnitFormField = ({
  duration,
  setDuration,
  ref,

  unitLabel = "Duration unit",
  ...rest
}: Props) => {
  return (
    <Box justify="end">
      <FormField label={unitLabel} {...rest}>
        <Select
          value={duration?.unit || ""}
          onChange={({ option }) => {
            setDuration({ ...duration, unit: option });
          }}
          options={[...Object.values(DurationUnit)]}
        />
      </FormField>
    </Box>
  );
};

export default DurationUnitFormField;
