import { Box, FormField, FormFieldProps, Select } from "grommet";
import React from "react";
import { Weight, WeightUnit } from "../../../types";
import { toKg, toLbs } from "../../../util";

interface OwnProps {
  weight?: Weight;
  unitLabel?: string;
  setWeight: (value: Weight) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const WeightUnitFormField = ({
  weight,
  setWeight,
  ref,
  name = "weightunit",
  unitLabel = "Weight unit",
  label,
  ...rest
}: Props) => {
  return (
    <Box justify="end">
      <FormField label={unitLabel} name="weightunit" {...rest}>
        <Select
          name={name}
          value={weight?.unit}
          options={[...Object.values(WeightUnit)]}
          onChange={({ option }) => {
            if (weight?.unit && weight?.value) {
              if (option === WeightUnit.LBS && weight.unit === WeightUnit.KG) {
                setWeight({ unit: option, value: toLbs(weight).value! });
              }
              if (option === WeightUnit.KG && weight.unit === WeightUnit.LBS) {
                setWeight({ unit: option, value: toKg(weight).value! });
              }
            } else {
              setWeight({ ...weight, unit: option });
            }
          }}
        />
      </FormField>
    </Box>
  );
};

export default WeightUnitFormField;
