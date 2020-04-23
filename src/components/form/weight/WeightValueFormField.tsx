import { Box, FormField, FormFieldProps, TextInput } from "grommet";
import React, { useState } from "react";
import { Weight } from "../../../types";

interface OwnProps {
  weight?: Weight;
  valueLabel?: string;
  setWeight: (value: Weight) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const WeightValueFormField = ({
  weight,
  setWeight,
  ref,
  name = "weightvalue",
  valueLabel = "Weight",
  label,
  ...rest
}: Props) => {
  const [value, setValue] = useState(weight?.value);
  return (
    <Box fill>
      <FormField
        label={valueLabel}
        name={name}
        validate={[
          () => {
            if (weight?.value && weight?.value < 40) return "WARNING: Weight to low, Expecting 40-200Kg";
            if (weight?.value && weight?.value > 200) return "WARNING: Weight to low, Expecting 40-200Kg";
          },
        ]}
        {...rest}
      >
        <TextInput
          value={value}
          name={name}
          type="number"
          step="any"
          onChange={(e) => setValue(parseFloat(e.target.value))}
          onBlur={() => setWeight({ ...weight, value: value })}
        />
      </FormField>
    </Box>
  );
};

export default WeightValueFormField;
