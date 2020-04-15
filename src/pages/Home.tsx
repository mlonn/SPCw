import { Box, Button, Heading, Paragraph, Anchor } from "grommet";
import React from "react";
import { Link } from "react-router-dom";

interface Props {}

const Home = () => {
  return (
    <Box alignSelf="center" width="large" align="center">
      <Heading>SuperPower Calculator</Heading>

      <Paragraph fill>
        The SuperPower Calculator (SPC) contains a comprehensive suite of calculators and converters useful to anyone
        training, racing, and running with power. There are two versions: SPC Web (SPCw) and SPC Sheets (SPCs). This
        site is for SPCw and supports the most popular SPCs features. For more information about SPCs, please visit the
        {` `}
        <Anchor href="https://www.powerpacing.run/superpower-calculator/" label="SPCs page" />
      </Paragraph>
    </Box>
  );
};

export default Home;
