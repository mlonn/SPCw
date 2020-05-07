import { Box, FormField, FormFieldProps, TextInput } from "grommet";
import React, { useEffect, useRef, useState } from "react";
import { Distance, DistanceUnit } from "../../../types";
import { round } from "../../../util";

interface OwnProps {
  distance?: Distance;
  valueLabel?: string;
  setDistance: (distance: Distance) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DistanceValueFormField = ({ distance, setDistance, ref, valueLabel = "Distance", ...rest }: Props) => {
  const [value, setValue] = useState(distance?.value);
  const [disabled, setDisabled] = useState(false);
  const prevUnitRef = useRef<DistanceUnit>();

  useEffect(() => {
    prevUnitRef.current = distance?.unit;
  }, [distance]);
  const prevUnit = prevUnitRef.current;

  useEffect(() => {
    if (prevUnit !== DistanceUnit.MARATHON && distance?.unit === DistanceUnit.MARATHON) {
      setValue(undefined);
      setDisabled(true);
    }
    if (prevUnit !== DistanceUnit.HALF_MARATHON && distance?.unit === DistanceUnit.HALF_MARATHON) {
      setValue(undefined);
      setDisabled(true);
    }
    if (prevUnit !== DistanceUnit.TEN_K && distance?.unit === DistanceUnit.TEN_K) {
      setValue(undefined);
      setDisabled(true);
    }
    if (prevUnit !== DistanceUnit.FIVE_K && distance?.unit === DistanceUnit.FIVE_K) {
      setValue(undefined);
      setDisabled(true);
    }
    if (
      distance?.unit === DistanceUnit.METERS ||
      distance?.unit === DistanceUnit.MILES ||
      distance?.unit === DistanceUnit.KM ||
      distance?.unit === DistanceUnit.FEET
    ) {
      setDisabled(false);
    }
    if (distance?.value) {
      if (distance.unit === DistanceUnit.KM) {
        if (prevUnit === DistanceUnit.METERS) {
          const newValue = distance?.value / 1000;
          setValue(newValue);
          setDistance({ ...distance, value: newValue });
        }
        if (prevUnit === DistanceUnit.FEET) {
          const newValue = distance?.value / 3280.84;
          setValue(newValue);
          setDistance({ ...distance, value: newValue });
        }
        if (prevUnit === DistanceUnit.MILES) {
          const newValue = distance?.value * 1.60934;
          setValue(newValue);
          setDistance({ ...distance, value: newValue });
        }
      }
      if (distance.unit === DistanceUnit.METERS) {
        if (prevUnit === DistanceUnit.KM) {
          const newValue = distance?.value * 1000;
          setValue(newValue);
          setDistance({ ...distance, value: newValue });
        }
        if (prevUnit === DistanceUnit.FEET) {
          const newValue = distance?.value / 3.28084;
          setValue(newValue);
          setDistance({ ...distance, value: newValue });
        }
        if (prevUnit === DistanceUnit.MILES) {
          const newValue = distance?.value * 1609.34;
          setValue(newValue);
          setDistance({ ...distance, value: newValue });
        }
      }
      if (distance.unit === DistanceUnit.FEET) {
        if (prevUnit === DistanceUnit.METERS) {
          const newValue = distance?.value * 3.28084;
          setValue(newValue);
          setDistance({ ...distance, value: newValue });
        }
        if (prevUnit === DistanceUnit.KM) {
          const newValue = distance?.value * 3280.84;
          setValue(newValue);
          setDistance({ ...distance, value: newValue });
        }
        if (prevUnit === DistanceUnit.MILES) {
          const newValue = distance?.value * 5280;
          setValue(newValue);
          setDistance({ ...distance, value: newValue });
        }
      }
      if (distance.unit === DistanceUnit.MILES) {
        if (prevUnit === DistanceUnit.METERS) {
          const newValue = distance?.value / 1609.34;
          setValue(newValue);
          setDistance({ ...distance, value: newValue });
        }
        if (prevUnit === DistanceUnit.FEET) {
          const newValue = distance?.value / 5280;
          setValue(newValue);
          setDistance({ ...distance, value: newValue });
        }
        if (prevUnit === DistanceUnit.KM) {
          const newValue = distance?.value / 1.60934;
          setValue(newValue);
          setDistance({ ...distance, value: newValue });
        }
      }
    }
  }, [distance, prevUnit, setDistance]);

  return (
    <Box>
      <FormField label={valueLabel} required {...rest} disabled={disabled}>
        <TextInput
          disabled={disabled}
          onChange={(e) => {
            setValue(parseFloat(e.target.value));
          }}
          onBlur={() => setDistance({ ...distance, value })}
          value={value !== undefined ? round(value, 4) : ""}
          type="number"
          step="any"
        />
      </FormField>
    </Box>
  );
};

export default DistanceValueFormField;
