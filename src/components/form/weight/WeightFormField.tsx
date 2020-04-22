import { Box, FormFieldProps } from "grommet";
import React from "react";
import { Weight } from "../../../types";
import WeightUnitFormField from "./WeightUnitFormField";
import WeightValueFormField from "./WeightValueFormField";

interface OwnProps {
  weight?: Weight;
  valueLabel?: string;
  unitLabel?: string;
  setWeight: (value: Weight) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const WeightFormField = ({ ref, ...rest }: Props) => {
  return (
    <Box gap="small" direction="row" align="start">
      <WeightValueFormField {...rest} />
      <WeightUnitFormField {...rest} />
    </Box>
  );
};

export default WeightFormField;
