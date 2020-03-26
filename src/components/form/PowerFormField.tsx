import { FormField, FormFieldProps, Select, TextInput, Box } from "grommet";
import React from "react";
import { Power, PowerUnit, Weight, WeightUnit } from "../../types";
import { round, lbsToKg } from "../../util";

interface OwnProps {
  weight: Weight;
  power: Power;
  setPower: (value: React.SetStateAction<Power>) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const PowerUnitFormField = ({ weight, power, setPower, ref, name, label, ...rest }: Props) => {
  return (
    <Box gap="small" direction="row" align="start">
      <Box fill>
        <FormField
          label="Power"
          required
          name="power"
          validate={[
            () => {
              if (!weight && power.unit === PowerUnit.WATTS_KG) return "Please enter stryd weight if using Watts/kg";
              return undefined;
            }
          ]}
          {...rest}
        >
          <TextInput
            name="power"
            onChange={e => {
              setPower({ ...power, value: parseFloat(e.target.value) });
            }}
            value={power.value ? power.value : ""}
            type="number"
            step="any"
          />
        </FormField>
      </Box>
      <Box justify="end">
        <FormField label="Power unit" name="powerunit" {...rest}>
          <Select
            name="powerunit"
            value={power.unit}
            onChange={({ option }) => {
              if (weight.value && power.value) {
                const kgWeight = weight.unit === WeightUnit.KG ? weight.value : lbsToKg(weight.value);
                if (option === PowerUnit.WATTS) {
                  setPower({ value: round(power.value * kgWeight, 2), unit: option });
                }
                if (option === PowerUnit.WATTS_KG) {
                  setPower({ value: round(power.value / kgWeight, 2), unit: option });
                }
              } else {
                setPower({ value: undefined, unit: option });
              }
            }}
            options={[...Object.values(PowerUnit)]}
          />
        </FormField>
      </Box>
    </Box>
  );
};

export default PowerUnitFormField;
