import { FormField, FormFieldProps, Select, Box, TextInput } from "grommet";
import React from "react";
import { Weight, WeightUnit } from "../../types";
import { round, kgToLbs, lbsToKg } from "../../util";

interface OwnProps {
  weight: Weight;
  setWeight: (value: React.SetStateAction<Weight>) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const WeightUnitFormField = ({ weight, setWeight, ref, name, label, ...rest }: Props) => {
  return (
    <Box gap="small" direction="row">
      <Box fill>
        <FormField label="Weight">
          <TextInput
            value={weight.value}
            type="number"
            step="any"
            onChange={e => setWeight({ ...weight, value: parseFloat(e.target.value) })}
          />
        </FormField>
      </Box>
      <Box justify="end">
        <FormField label="Weight unit" name="weightunit" {...rest}>
          <Select
            name="weightunit"
            value={weight.unit}
            options={[...Object.values(WeightUnit)]}
            onChange={({ option }) => {
              if (weight.value) {
                if (option === WeightUnit.LBS && weight.unit === WeightUnit.KG) {
                  setWeight({ unit: option, value: round(kgToLbs(weight.value), 2) });
                }
                if (option === WeightUnit.KG && weight.unit === WeightUnit.LBS) {
                  setWeight({ unit: option, value: round(lbsToKg(weight.value), 2) });
                }
              } else {
                setWeight({ ...weight, unit: option });
              }
            }}
          />
        </FormField>
      </Box>
    </Box>
  );
};

export default WeightUnitFormField;
