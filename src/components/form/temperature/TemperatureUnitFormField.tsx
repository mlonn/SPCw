import { Box, FormField, FormFieldProps, Select } from "grommet";
import React from "react";
import { Temperature, TemperatureUnit } from "../../../types";

interface OwnProps {
  temperature?: Temperature;
  unitLabel?: string;
  setTemperature: (value: Temperature) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const TemperatureUnitFormField = ({
  temperature,
  setTemperature,
  ref,
  unitLabel = "Temperature unit",
  ...rest
}: Props) => {
  return (
    <Box justify="end">
      <FormField label={unitLabel} {...rest}>
        <Select
          value={temperature?.unit}
          onChange={({ option }) => {
            setTemperature({ ...temperature, unit: option });
          }}
          options={[...Object.values(TemperatureUnit)]}
        />
      </FormField>
    </Box>
  );
};

export default TemperatureUnitFormField;
