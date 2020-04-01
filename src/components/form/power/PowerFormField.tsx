import { Box, FormFieldProps } from "grommet";
import React from "react";
import { Power, Weight } from "../../../types";
import PowerUnitFormField from "./PowerUnitFormField";
import PowerValueFormField from "./PowerValueFormField";

interface OwnProps {
  weight: Weight;
  power: Power;
  valueLabel?: string;
  unitLabel?: string;
  setPower: (value: Power) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const PowerFormField = ({ ref, ...rest }: Props) => {
  return (
    <Box gap="small" direction="row" align="start">
      <PowerValueFormField {...rest} />
      <PowerUnitFormField {...rest} />
    </Box>
  );
};

export default PowerFormField;
