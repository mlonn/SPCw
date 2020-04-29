import { Box, BoxProps, FormField, FormFieldProps, Select } from "grommet";
import React from "react";
import { Power, PowerUnit, Weight } from "../../../types";

interface OwnProps {
  weight?: Weight;
  power?: Power;
  unitLabel?: string;
  setPower: (value: Power) => void;
}

type Props = OwnProps & FormFieldProps & BoxProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const PowerUnitFormField = ({ weight, power, setPower, ref, gridArea, unitLabel = "‎Power unit", ...rest }: Props) => {
  return (
    <Box justify="end" gridArea={gridArea}>
      <FormField label={unitLabel} {...rest}>
        <Select
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
