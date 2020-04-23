import { Box, FormField, FormFieldProps, TextInput } from "grommet";
import React, { useState } from "react";
import { INPUT_ERRORS, Power, PowerUnit, Weight } from "../../../types";
import { toKg } from "../../../util";

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
          value={power?.value ? power.value : ""}
          type="number"
          step="any"
        />
      </FormField>
    </Box>
  );
};

export default PowerValueFormField;
