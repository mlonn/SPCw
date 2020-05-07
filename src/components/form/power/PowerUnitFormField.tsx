import { Box, FormField, FormFieldProps, Select } from "grommet";
import React from "react";
import { Power, PowerUnit, Weight } from "../../../types";

interface OwnProps {
  weight?: Weight;
  power?: Power;
  unitLabel?: string;
  setPower: (value: Power) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const PowerUnitFormField = ({
  weight,
  power,
  setPower,
  ref,
  name = "powerunit",
  unitLabel = "‎Power unit",
  ...rest
}: Props) => {
  return (
    <Box justify="end">
      <FormField label={unitLabel} {...rest}>
        <Select
          name={name}
          value={power?.unit}
          onChange={({ option }) => {
            setPower({ ...power, unit: option });
          }}
          options={[...Object.values(PowerUnit)]}
        />
      </FormField>
    </Box>
  );
};

export default PowerUnitFormField;
