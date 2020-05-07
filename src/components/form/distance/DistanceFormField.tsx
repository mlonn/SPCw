import { Box, FormFieldProps } from "grommet";
import React from "react";
import { Distance } from "../../../types";
import DistanceUnitFormField from "./DistanceUnitFormField";
import DistanceValueFormField from "./DistanceValueFormField";

interface OwnProps {
  temperature?: Distance;
  valueLabel?: string;
  unitLabel?: string;
  altitude?: boolean;
  distance?: Distance;
  setDistance: (value: Distance) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DistanceFormField = ({ ref, unitLabel = "‎\u00A0‎‎‎", ...rest }: Props) => {
  return (
    <Box gap="small" direction="row" align="start" fill>
      <DistanceValueFormField {...rest} />
      <DistanceUnitFormField unitLabel={unitLabel} {...rest} />
    </Box>
  );
};

export default DistanceFormField;
