import React from "react";
import { Heading, Box, Button } from "grommet";
import { Link } from "react-router-dom";

interface Props {}

const Home = () => {
  return (
    <Box fill justify="center" align="center">
      <Box>
        <Heading>SuperPower Calculator</Heading>

        <Link to="/profile">
          <Button label={"Profile"} />
        </Link>

        <Heading>Calculators</Heading>
        <ul>
          <li>
            <Link to="/ftp">Calculate FTP/CP and RWC (W') from a CP test"</Link>
          </li>
        </ul>
      </Box>
    </Box>
  );
};

export default Home;
