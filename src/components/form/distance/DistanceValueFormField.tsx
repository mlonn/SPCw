import { Box, FormField, FormFieldProps, TextInput } from "grommet";
import React, { useEffect, useState } from "react";
import { Distance } from "../../../types";
import { round } from "../../../util";

interface OwnProps {
  distance?: Distance;
  valueLabel?: string;
  setDistance: (distance: Distance) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DistanceValueFormField = ({ distance, setDistance, ref, valueLabel = "Distance", ...rest }: Props) => {
  const [value, setValue] = useState(distance?.value);
  useEffect(() => {
    setValue(distance?.value);
  }, [distance]);
  return (
    <Box fill>
      <FormField label={valueLabel} required {...rest}>
        <TextInput
          onChange={(e) => {
            setValue(parseFloat(e.target.value));
          }}
          onBlur={() => setDistance({ ...distance, value })}
          value={value ? round(value, 2) : ""}
          type="number"
          step="any"
        />
      </FormField>
    </Box>
  );
};

export default DistanceValueFormField;
