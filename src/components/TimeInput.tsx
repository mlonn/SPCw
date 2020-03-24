import React from "react";
import { MaskedInput } from "grommet";

interface Props {}

const TimeInput = (props: Props & any) => {
  return <MaskedInput {...props} />;
};

export default TimeInput;
