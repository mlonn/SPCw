import { Box, FormField, FormFieldProps, TextInput } from "grommet";
import React from "react";
import { Weight } from "../../../types";

interface OwnProps {
  weight: Weight;
  valueLabel?: string;

  setWeight: (value: Weight) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const WeightValueFormField = ({ weight, setWeight, ref, name, valueLabel = "Weight", label, ...rest }: Props) => {
  return (
    <Box fill>
      <FormField
        label={valueLabel}
        validate={[
          () => {
            if (weight.value && weight.value < 40) return "WARNING: Weight to low, Expecting 40-200Kg";
            if (weight.value && weight.value > 200) return "WARNING: Weight to low, Expecting 40-200Kg";
          }
        ]}
        {...rest}
      >
        <TextInput
          value={weight.value}
          type="number"
          step="any"
          onChange={e => setWeight({ ...weight, value: parseFloat(e.target.value) })}
        />
      </FormField>
    </Box>
  );
};

export default WeightValueFormField;
