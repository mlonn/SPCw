import { Box, FormField, FormFieldProps, TextInput } from "grommet";
import React from "react";
import { Power, PowerUnit, Weight } from "../../../types";

interface OwnProps {
  weight: Weight;
  power: Power;
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
  valueLabel = "Power",
  ...rest
}: Props) => {
  return (
    <Box fill>
      <FormField
        label={valueLabel}
        required
        name={name}
        validate={[
          () => {
            if (!weight && power.unit === PowerUnit.WATTS_KG) return "Please enter stryd weight if using Watts/kg";
            return undefined;
          }
        ]}
        {...rest}
      >
        <TextInput
          name={name}
          onChange={e => {
            setPower({ ...power, value: parseFloat(e.target.value) });
          }}
          value={power.value ? power.value : ""}
          type="number"
          step="any"
        />
      </FormField>
    </Box>
  );
};

export default PowerValueFormField;
