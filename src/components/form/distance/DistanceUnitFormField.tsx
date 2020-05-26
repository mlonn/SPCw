import { Box, FormField, FormFieldProps, Select } from "grommet";
import React from "react";
import { Distance, DistanceUnit } from "../../../types";

interface OwnProps {
  distance?: Distance;
  unitLabel?: string;
  altitude?: boolean;
  setDistance: (value: Distance) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DistanceUnitFormField = ({
  distance,
  setDistance,
  ref,
  unitLabel = "Distance unit",
  altitude,
  ...rest
}: Props) => {
  return (
    <Box justify="end">
      <FormField label={unitLabel} {...rest}>
        <Select
          value={distance?.unit}
          onChange={({ option }) => {
            setDistance({ ...distance, unit: option });
          }}
          options={altitude ? [DistanceUnit.METERS, DistanceUnit.FEET] : [...Object.values(DistanceUnit)]}
        />
      </FormField>
    </Box>
  );
};

export default DistanceUnitFormField;
