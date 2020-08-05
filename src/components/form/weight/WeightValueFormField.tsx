import { FormField, FormFieldProps, TextInput } from "grommet";
import React, { useEffect, useState } from "react";
import { Weight } from "../../../types";
import { round } from "../../../util";

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
  valueLabel = "Stryd Weight",
  label,
  ...rest
}: Props) => {
  const [value, setValue] = useState(weight?.value);

  useEffect(() => {
    setValue(weight?.value);
  }, [setWeight, weight]);

  return (
    <FormField label={valueLabel} name={name} {...rest}>
      <TextInput
        value={value ? round(value, 2) : ""}
        name={name}
        type="number"
        step="any"
        onChange={(e) => setValue(parseFloat(e.target.value))}
        onBlur={() => setWeight({ ...weight, value: value })}
      />
    </FormField>
  );
};

export default WeightValueFormField;
