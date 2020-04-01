import { Box, FormFieldProps } from "grommet";
import React from "react";
import { Duration } from "../../../types";
import DurationUnitFormField from "./DurationUnitFormField";
import DurationValueFormField from "./DurationValueFormField";

interface OwnProps {
  duration: Duration;
  valueLabel?: string;
  unitLabel?: string;
  setDuration: (value: Duration) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DurationFormField = ({ ref, ...rest }: Props) => {
  return (
    <Box gap="small" direction="row" align="start">
      <DurationValueFormField {...rest} />
      <DurationUnitFormField {...rest} />
    </Box>
  );
};

export default DurationFormField;
