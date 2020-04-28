import { Box, FormField, FormFieldProps, TextInput } from "grommet";
import React, { useEffect, useState } from "react";
import { Temperature } from "../../../types";
import { round } from "../../../util";

interface OwnProps {
  temperature?: Temperature;
  valueLabel?: string;
  setTemperature: (temperature: Temperature) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const TemperatureValueFormField = ({
  temperature,

  setTemperature,
  ref,
  valueLabel = "Temperature",
  ...rest
}: Props) => {
  const [value, setValue] = useState(temperature?.value);
  useEffect(() => {
    setValue(temperature?.value);
  }, [temperature]);
  return (
    <Box fill>
      <FormField label={valueLabel} required {...rest}>
        <TextInput
          onChange={(e) => {
            setValue(parseFloat(e.target.value));
          }}
          onBlur={() => setTemperature({ ...temperature, value })}
          value={value ? round(value, 2) : ""}
          type="number"
          step="any"
        />
      </FormField>
    </Box>
  );
};

export default TemperatureValueFormField;
