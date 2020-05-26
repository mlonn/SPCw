import { Box, BoxProps, FormFieldProps } from "grommet";
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

type Props = OwnProps & FormFieldProps & BoxProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DurationFormField = ({ ref, unitLabel = "\u00A0", gridArea, ...rest }: Props) => {
  return (
    <Box gap="small" direction="row" align="start" gridArea={gridArea}>
      <DurationValueFormField {...rest} />
      <DurationUnitFormField unitLabel={unitLabel} {...rest} />
    </Box>
  );
};

export default DurationFormField;
