import { Box, FormFieldProps } from "grommet";
import React from "react";
import { Temperature } from "../../../types";
import TemperatureUnitFormField from "./TemperatureUnitFormField";
import TemperatureValueFormField from "./TemperatureValueFormField";

interface OwnProps {
  temperature?: Temperature;
  valueLabel?: string;
  unitLabel?: string;
  setTemperature: (value: Temperature) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const TemperatureFormField = ({ ref, unitLabel = "‎\u00A0‎‎‎", ...rest }: Props) => {
  return (
    <Box gap="small" direction="row" align="start">
      <TemperatureValueFormField {...rest} />
      <TemperatureUnitFormField unitLabel={unitLabel} {...rest} />
    </Box>
  );
};

export default TemperatureFormField;
