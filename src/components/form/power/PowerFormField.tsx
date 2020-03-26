import { Box, FormFieldProps } from "grommet";
import React from "react";
import { Power, Weight } from "../../../types";
import PowerUnitFormField from "./PowerUnitFormField";
import PowerValueFormField from "./PowerValueFormField";

interface OwnProps {
  weight: Weight;
  power: Power;
  setPower: (value: Power) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const PowerFormField = ({ weight, power, setPower, ref, name, label, ...rest }: Props) => {
  return (
    <Box gap="small" direction="row" align="start">
      <PowerValueFormField power={power} setPower={setPower} weight={weight} />
      <PowerUnitFormField power={power} setPower={setPower} weight={weight} />
    </Box>
  );
};

export default PowerFormField;
