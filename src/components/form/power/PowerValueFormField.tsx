import { Box, FormField, FormFieldProps, TextInput } from "grommet";
import React, { memo } from "react";
import { INPUT_ERRORS, Power, PowerUnit, Weight } from "../../../types";
import { toKg } from "../../../util";

interface OwnProps {
  weight?: Weight;
  power?: Power;
  valueLabel?: string;
  setPower: (power: Power) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const PowerValueFormField = ({
  weight,
  power,
  setPower,
  ref,
  name = "power",
  valueLabel = "Power (Pt)",
  ...rest
}: Props) => {
  return (
    <Box fill>
      <FormField
        label={valueLabel}
        required
        name={name}
        validate={[
          (value: number) => {
            if (!weight?.value && power?.unit === PowerUnit.WATTS_KG) {
              return INPUT_ERRORS.ENTER_WEIGHT;
            }
            if (power?.unit === PowerUnit.WATTS_KG && (value < 1 || value > 10)) {
              return "Please enter Watts/kg between 1 and 10";
            }
            if (weight?.value && power?.unit === PowerUnit.WATTS) {
              const kgs = toKg(weight).value!;
              if (value < Math.floor(kgs) || value > Math.ceil(kgs * 10)) {
                return `Power (Pt): Expecting ${Math.floor(kgs)}-${Math.ceil(
                  kgs * 10
                )} Watts (check value and/or Unit of Measure)`;
              }
            }
            if (!weight?.value && power?.unit === PowerUnit.WATTS) {
              if (value < 70 || value > 700) {
                return INPUT_ERRORS.POWER;
              }
            }
            return undefined;
          },
        ]}
        {...rest}
      >
        <TextInput
          name={name}
          onChange={(e) => {
            setPower({ ...power, value: parseFloat(e.target.value) });
          }}
          value={power?.value ? power.value : ""}
          type="number"
          step="any"
        />
      </FormField>
    </Box>
  );
};

export default memo(PowerValueFormField);
