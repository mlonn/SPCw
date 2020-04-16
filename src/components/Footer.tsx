import React from "react";
import { Footer as GFooter, Box, Anchor } from "grommet";

interface Props {}

const Footer = (props: Props) => {
  return (
    <Box background="dark-2">
      <GFooter background="dark-2">
        <Box pad="medium" align="center" fill>
          <div>
            {`Made with love by `}
            <Anchor
              target="_blank"
              label="Steve Palladino"
              href="https://www.facebook.com/groups/PalladinoPowerProject/"
            />
            {`, `}
            <Anchor target="_blank" label="Steve Bateman" href="https://www.facebook.com/groups/from1runner2another/" />
            {`, `}
            <Anchor target="_blank" label="Alex Tran" href="https://www.powerpacing.run/" />
            {` and `}
            <Anchor target="_blank" label="Mikael Lönn" href="https://mikaellonn.se" />
          </div>
        </Box>
      </GFooter>
    </Box>
  );
};

export default Footer;
