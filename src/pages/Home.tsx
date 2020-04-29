import { Anchor, Box, Heading, Paragraph } from "grommet";
import React from "react";

interface Props {}

const Home = () => {
  return (
    <Box alignSelf="center" width="large" align="center">
      <Heading size="small">SuperPower Calculator for Web (SPCw)</Heading>

      <Paragraph fill>
        The SuperPower Calculator (SPC) contains a comprehensive suite of calculators and converters useful to anyone
        training, racing, and running with power. There are two versions: SPC for Web (SPCw) and SPC for Sheets (SPCs).
        This site is for SPCw and supports the most popular SPCs features. For more information about SPCs, please visit
        the
        {` `}
        <Anchor href="https://www.powerpacing.run/superpower-calculator/" label="SPCs page" />.
      </Paragraph>
    </Box>
  );
};

export default Home;
