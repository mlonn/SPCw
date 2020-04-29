import { Box, BoxProps, FormFieldProps } from "grommet";
import React from "react";
import { Power, Weight } from "../../../types";
import PowerUnitFormField from "./PowerUnitFormField";
import PowerValueFormField from "./PowerValueFormField";

interface OwnProps {
  weight?: Weight;
  power?: Power;
  valueLabel?: string;
  unitLabel?: string;
  setPower: (value: Power) => void;
}

type Props = OwnProps & FormFieldProps & BoxProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const PowerFormField = ({ ref, unitLabel = "‎\u00A0‎‎‎", gridArea, ...rest }: Props) => {
  return (
    <Box gap="small" direction="row" align="start" gridArea={gridArea}>
      <PowerValueFormField {...rest} />
      <PowerUnitFormField unitLabel={unitLabel} {...rest} />
    </Box>
  );
};

export default PowerFormField;
