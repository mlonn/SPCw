import { Box, Button, DataTable, Form, Grid, Heading, Layer, Text } from "grommet";
import { FormClose, StatusWarning, Trash } from "grommet-icons";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { calculateFTP } from "../calculations/ftp";
import { Activity, Duration, DurationUnit, Power, PowerUnit, Weight, WeightUnit } from "../types";
import { durationToString, round } from "../util";
import DurationFormField from "./form/DurationFormField";
import PowerFormField from "./form/PowerFormField";
import WeightFormField from "./form/WeightFormField";
interface Props {}

const CalculateFTP = (props: Props) => {
  const [duration, setDuration] = useState<Duration>({ unit: DurationUnit.HH_MM_SS });
  const [showError, setShowError] = useState(false);
  const [power, setPower] = useState<Power>({ unit: PowerUnit.WATTS });

  const [weight, setWeight] = useState<Weight>({ unit: WeightUnit.KG });
  const [calculationError, setCalculationError] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);

  let result;
  if (activities.length > 1) {
    try {
      result = calculateFTP(activities, weight.value);
      if (showError) {
        setShowError(false);
        setCalculationError("");
      }
    } catch (error) {
      console.log(error);
      if (!showError) {
        setShowError(true);
        setCalculationError(error.message);
      }
    }
  }

  return (
    <Box alignSelf="center" width="xlarge">
      <Heading level="2">Input</Heading>
      <WeightFormField weight={weight} setWeight={setWeight} name={"weightunit"} label={"Weight unit"} />
      <Heading level="3">Activities</Heading>
      {activities.length > 0 && (
        <Box fill>
          <DataTable
            primaryKey="id"
            columns={[
              {
                property: "power",
                header: "Power",
                render: (datum: Activity) => <Text>{datum.power.value}</Text>
              },
              {
                property: "powerUnit",
                render: (datum: Activity) =>
                  datum.power.unit === PowerUnit.WATTS ? <Text>Watts</Text> : <Text>Watts/kgs</Text>
              },
              {
                property: "duration",
                header: "Duration",
                render: (datum: Activity) =>
                  datum.duration.unit === DurationUnit.SECONDS ? (
                    <Text>{datum.duration.value} seconds</Text>
                  ) : (
                    <Text>{durationToString(datum.duration)}</Text>
                  )
              },
              {
                property: "delete",
                render: (datum: Activity) => (
                  <Button
                    plain
                    icon={<Trash />}
                    onClick={() => {
                      setActivities(activities.filter(activity => activity.id !== datum.id));
                    }}
                  />
                )
              }
            ]}
            data={activities}
          />
        </Box>
      )}
      <Box>
        <Form
          onSubmit={(e: any) => {
            e.preventDefault();
            setActivities([...activities, { id: uuidv4(), power, duration }]);
            setPower({ unit: power.unit });
            setDuration({ unit: duration.unit });
          }}
        >
          <PowerFormField power={power} setPower={setPower} weight={weight} />
          <DurationFormField label="Duration" name="" duration={duration} setDuration={setDuration} />
          <Box justify="center" align="end">
            <Button label="Add" type="submit" />
          </Box>
        </Form>
      </Box>
      <Heading level="2">Result</Heading>

      {result && (
        <Grid gap="small" columns={["auto", "auto", "auto"]}>
          <Text>FTP/Critical Power</Text>
          <Text>{result.ftp}</Text>
          <Text>Watts</Text>

          <Text>FTP/Critical Power/kg</Text>
          {result.ftpkg ? <Text>{result.ftpkg} </Text> : <Text>Enter weight</Text>}
          <Text>Watts/kg</Text>

          <Text>AWC (W')</Text>
          <Text>{result.awc}</Text>
          <Text>kJ</Text>
          <Text>R^2 Coefficient</Text>
          <Text>{round(result.r2 * 100, 2).toFixed(2)}</Text>
          <Text>%</Text>
        </Grid>
      )}
      {activities.length < 2 && (
        <Box>
          <Text>Add more activities</Text>
        </Box>
      )}

      {showError && (
        <Layer
          position="bottom"
          modal={false}
          margin={{ vertical: "medium", horizontal: "small" }}
          onEsc={() => setShowError(false)}
          responsive={false}
          plain
        >
          <Box
            align="center"
            direction="row"
            gap="small"
            justify="between"
            round="medium"
            elevation="medium"
            pad={{ vertical: "xsmall", horizontal: "small" }}
            background="status-critical"
          >
            <Box align="center" direction="row" gap="xsmall">
              <StatusWarning />
              <Text>{calculationError}</Text>
            </Box>
            <Button icon={<FormClose />} onClick={() => setShowError(false)} plain />
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default CalculateFTP;
