import React from "react";
import { Heading, Box, Button } from "grommet";
import { Link } from "react-router-dom";
interface Props {}

const Calculators = (props: Props) => {
  return (
    <Box alignSelf="center" width="xlarge">
      <Heading>Calculators</Heading>
      <ul>
        <li>
          <Link to="/ftp">
            <Button plain label="Calculate FTP/CP and RWC (W') from a CP test" />
          </Link>
        </li>
      </ul>
    </Box>
  );
};

export default Calculators;
