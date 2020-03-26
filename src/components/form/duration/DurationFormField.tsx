import { Box, FormFieldProps } from "grommet";
import React from "react";
import { Duration } from "../../../types";
import DurationUnitFormField from "./DurationUnitFormField";
import DurationValueFormField from "./DurationValueFormField";

interface OwnProps {
  duration: Duration;
  setDuration: (value: Duration) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DurationFormField = ({ duration, setDuration, ref, name, label, ...rest }: Props) => {
  return (
    <Box gap="small" direction="row" align="start">
      <DurationValueFormField duration={duration} setDuration={setDuration} />
      <DurationUnitFormField duration={duration} setDuration={setDuration} />
    </Box>
  );
};

export default DurationFormField;
