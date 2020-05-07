import { Box, Button, Collapsible, FormField, Grid, Heading, Select, TextInput } from "grommet";
import { FormDown, FormUp } from "grommet-icons";
import React, { useState } from "react";
import DistanceFormField from "../distance/DistanceFormField";
import TemperatureFormField from "../temperature/TemperatureFormField";

interface Props {}

const EnvironmentAdjustment = (props: Props) => {
  const [showEnvironment, setShowEnvironment] = useState(true);
  const Icon = showEnvironment ? FormUp : FormDown;
  return (
    <Box>
      <Box direction="row">
        <Heading level="2" size="small">
          Environment Adjustments
        </Heading>
        <Button plain icon={<Icon color="brand" size="large" onClick={() => setShowEnvironment(!showEnvironment)} />} />
      </Box>

      <Collapsible open={showEnvironment}>
        <Grid columns={["1fr", "1fr"]} gap="small" align="end">
          <DistanceFormField altitude valueLabel="CP Test Altitude" setDistance={(t) => {}} />
          <DistanceFormField altitude valueLabel="Target FTP/CP Altitude" setDistance={(t) => {}} />
          <TemperatureFormField valueLabel="CP Test Temperature" setTemperature={(t) => {}} />
          <TemperatureFormField valueLabel="Target FTP/CP Temperature" setTemperature={(t) => {}} />
          <Box gap="small" direction="row" align="start">
            <Box fill>
              <FormField label="CP Test Humidity">
                <TextInput />
              </FormField>
            </Box>
            <FormField label={"‎\u00A0‎‎‎"}>
              <Select options={["Percent"]} value="Percent" />
            </FormField>
          </Box>
          <Box gap="small" direction="row" align="start">
            <Box fill>
              <FormField label="Target CP/FTP Humidity">
                <TextInput />
              </FormField>
            </Box>
            <FormField label={"‎\u00A0‎‎‎"}>
              <Select options={["Percent"]} value="Percent" />
            </FormField>
          </Box>
        </Grid>
      </Collapsible>
    </Box>
  );
};

export default EnvironmentAdjustment;
