import { Box, FormField, FormFieldProps, TextInput } from "grommet";
import React, { useState } from "react";
import { Power, Weight } from "../../../types";

interface OwnProps {
  weight?: Weight;
  power?: Power;
  valueLabel?: string;
  setPower: (power: Power) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const PowerValueFormField = ({ weight, power, setPower, ref, valueLabel = "Power (Pt)", ...rest }: Props) => {
  const [value, setValue] = useState(power?.value);
  return (
    <Box fill>
      <FormField label={valueLabel} required {...rest}>
        <TextInput
          onChange={(e) => {
            setValue(parseFloat(e.target.value));
          }}
          onBlur={() => setPower({ ...power, value })}
          value={value}
          type="number"
          step="any"
        />
      </FormField>
    </Box>
  );
};

export default PowerValueFormField;
