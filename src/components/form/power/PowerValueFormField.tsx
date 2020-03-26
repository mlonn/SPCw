import { Box, FormField, FormFieldProps, TextInput } from "grommet";
import React from "react";
import { Power, PowerUnit, Weight } from "../../../types";

interface OwnProps {
  weight: Weight;
  power: Power;
  setPower: (power: Power) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const PowerValueFormField = ({ weight, power, setPower, ref, name, label, ...rest }: Props) => {
  return (
    <Box fill>
      <FormField
        label="Power"
        required
        name="power"
        validate={[
          () => {
            if (!weight && power.unit === PowerUnit.WATTS_KG) return "Please enter stryd weight if using Watts/kg";
            return undefined;
          }
        ]}
        {...rest}
      >
        <TextInput
          name="power"
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
