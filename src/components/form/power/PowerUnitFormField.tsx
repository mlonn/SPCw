import { Box, FormField, FormFieldProps, Select } from "grommet";
import React from "react";
import { Power, PowerUnit, Weight, WeightUnit } from "../../../types";
import { round, toKg } from "../../../util";

interface OwnProps {
  weight: Weight;
  power: Power;
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
  unitLabel = "Power unit",
  ...rest
}: Props) => {
  return (
    <Box justify="end">
      <FormField label={unitLabel} name={name} {...rest}>
        <Select
          name={name}
          value={power.unit}
          onChange={({ option }) => {
            if (weight.value && power.value) {
              const kgWeight = weight.unit === WeightUnit.KG ? weight.value : toKg(weight).value!;
              if (option === PowerUnit.WATTS) {
                setPower({ value: round(power.value * kgWeight, 2), unit: option });
              }
              if (option === PowerUnit.WATTS_KG) {
                setPower({ value: round(power.value / kgWeight, 2), unit: option });
              }
            } else {
              setPower({ value: undefined, unit: option });
            }
          }}
          options={[...Object.values(PowerUnit)]}
        />
      </FormField>
    </Box>
  );
};

export default PowerUnitFormField;
