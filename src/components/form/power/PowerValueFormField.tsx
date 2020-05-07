import { Box, BoxProps, FormField, FormFieldProps, TextInput } from "grommet";
import React, { useEffect, useRef, useState } from "react";
import { Power, PowerUnit, Weight, WeightUnit } from "../../../types";
import { round, toKg } from "../../../util";

interface OwnProps {
  weight?: Weight;
  power?: Power;
  valueLabel?: string;
  setPower: (power: Power) => void;
}

type Props = OwnProps & FormFieldProps & BoxProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const PowerValueFormField = ({ weight, power, setPower, ref, valueLabel = "Power (Pt)", gridArea, ...rest }: Props) => {
  const [value, setValue] = useState(power?.value);
  const prevUnitRef = useRef<PowerUnit>();
  useEffect(() => {
    prevUnitRef.current = power?.unit;
  }, [power]);
  const prevUnit = prevUnitRef.current;
  useEffect(() => {
    if (weight?.value && power?.value) {
      const kgWeight = weight?.unit === WeightUnit.KG ? weight?.value : toKg(weight).value!;
      if (prevUnit === PowerUnit.WATTS && power?.unit === PowerUnit.WATTS_KG) {
        const newValue = power?.value / kgWeight;
        setPower({ ...power, value: newValue });
        setValue(newValue);
      }
      if (prevUnit === PowerUnit.WATTS_KG && power?.unit === PowerUnit.WATTS) {
        const newValue = power?.value * kgWeight;
        setPower({ ...power, value: newValue });
        setValue(newValue);
      }
    } else {
      setValue(power?.value);
    }
  }, [power, prevUnit, setPower, weight]);
  return (
    <Box gridArea={gridArea}>
      <FormField label={valueLabel} required {...rest}>
        <TextInput
          onChange={(e) => {
            setValue(parseFloat(e.target.value));
          }}
          onBlur={() => setPower({ ...power, value })}
          value={value ? round(value, 2) : ""}
          type="number"
          step="any"
        />
      </FormField>
    </Box>
  );
};

export default PowerValueFormField;
