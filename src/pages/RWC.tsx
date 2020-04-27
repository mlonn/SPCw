import React from "react";
import { Box, DataTable, Grid } from "grommet";
import { rwcTable } from "../calculations/data";
import { round } from "../util";

interface Props {}

const RWC = (props: Props) => {
  return (
    <Box>
      {rwcTable.map((r) => (
        <Grid columns={{ count: 15, size: "auto" }}>
          <Box>{r.gender}</Box>
          <Box>{r.powerMeter}</Box>
          <Box>{r.unit}</Box>
          <Box>{r.average}</Box>
          <Box>{r.stdDev}</Box>
          <Box>{round(r.TOO_LOW.min, 2)}</Box>
          <Box>{round(r.TOO_LOW.max, 2)}</Box>
          <Box>{round(r.LOW.min, 2)}</Box>
          <Box>{round(r.LOW.max, 2)}</Box>
          <Box>{round(r.MEDIUM.min, 2)}</Box>
          <Box>{round(r.MEDIUM.max, 2)}</Box>
          <Box>{round(r.HIGH.min, 2)}</Box>
          <Box>{round(r.HIGH.max, 2)}</Box>
          <Box>{round(r.TOO_HIGH.min, 2)}</Box>
          <Box>{round(r.TOO_HIGH.max, 2)}</Box>
        </Grid>
      ))}
    </Box>
  );
};

export default RWC;
