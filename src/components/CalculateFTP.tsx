import { Box, Button, DataTable, Form, Grid, Heading, Layer, Text } from "grommet";
import { Edit, FormClose, StatusWarning, Trash } from "grommet-icons";
import React, { Fragment, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { calculateFTP } from "../calculations/ftp";
import { Activity, Duration, Power, PowerUnit, Weight, DurationUnit, WeightUnit } from "../types";
import { durationToString, round } from "../util";
import DurationFormField from "./form/duration/DurationFormField";
import DurationValueFormField from "./form/duration/DurationValueFormField";
import DurationUnitFormField from "./form/duration/DurationUnitFormField";
import PowerFormField from "./form/power/PowerFormField";
import WeightFormField from "./form/WeightFormField";
import PowerValueFormField from "./form/power/PowerValueFormField";
import PowerUnitFormField from "./form/power/PowerUnitFormField";
interface Props {}

const CalculateFTP = (props: Props) => {
  const [duration, setDuration] = useState<Duration>({ unit: DurationUnit.HH_MM_SS });
  const [showError, setShowError] = useState(false);
  const [power, setPower] = useState<Power>({ unit: PowerUnit.WATTS });
  const [edit, setEdit] = useState<string>();
  const [weight, setWeight] = useState<Weight>({ unit: WeightUnit.KG });
  const [calculationError, setCalculationError] = useState("");
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "20c45e65-b166-4f29-8227-d786b7aac508",
      power: { unit: PowerUnit.WATTS, value: 409 },
      duration: { unit: DurationUnit.HH_MM_SS, hours: 0, minutes: 3, seconds: 0 }
    },
    {
      id: "f9413147-f25e-4a66-8551-c6e491d92f26",
      power: { unit: PowerUnit.WATTS, value: 359 },
      duration: { unit: DurationUnit.HH_MM_SS, hours: 0, minutes: 10, seconds: 0 }
    }
  ]);

  let result;
  if (activities.length > 1) {
    try {
      result = calculateFTP(activities, weight.value);
      if (showError) {
        setShowError(false);
        setCalculationError("");
      }
    } catch (error) {
      if (!showError) {
        setShowError(true);
        setCalculationError(error.message);
      }
    }
  }

  return (
    <Box alignSelf="center" width="xlarge">
      <Heading level="2">Input</Heading>
      <Form validate="blur">
        <WeightFormField weight={weight} setWeight={setWeight} name={"weightunit"} label={"Weight unit"} />
      </Form>
      <Heading level="3">Activities</Heading>
      {activities.length > 0 && (
        <DataTable
          primaryKey="id"
          columns={[
            {
              property: "power",
              header: "Power",
              render: (datum: Activity) =>
                edit === datum.id ? (
                  <PowerValueFormField
                    power={datum.power}
                    setPower={newPower =>
                      setActivities(
                        activities.map(activity =>
                          activity.id === datum.id ? { ...activity, power: newPower } : activity
                        )
                      )
                    }
                    weight={weight}
                  />
                ) : (
                  <Box width="100%">
                    <Text>{datum.power.value}</Text>
                  </Box>
                )
            },
            {
              property: "powerUnit",
              render: (datum: Activity) =>
                edit === datum.id ? (
                  <PowerUnitFormField
                    power={datum.power}
                    setPower={newPower =>
                      setActivities(
                        activities.map(activity =>
                          activity.id === datum.id ? { ...activity, power: newPower } : activity
                        )
                      )
                    }
                    weight={weight}
                  />
                ) : datum.power.unit === PowerUnit.WATTS ? (
                  <Box fill>
                    <Text>Watts</Text>
                  </Box>
                ) : (
                  <Box fill>
                    <Text>Watts/kgs</Text>
                  </Box>
                )
            },
            {
              property: "duration",
              header: "Duration",
              render: (datum: Activity) =>
                edit === datum.id ? (
                  <DurationValueFormField
                    duration={datum.duration}
                    setDuration={newDuration =>
                      setActivities(
                        activities.map(activity =>
                          activity.id === datum.id ? { ...activity, duration: newDuration } : activity
                        )
                      )
                    }
                  />
                ) : datum.duration.unit === DurationUnit.SECONDS ? (
                  <Box fill>
                    <Text>{datum.duration.value} seconds</Text>
                  </Box>
                ) : (
                  <Box fill>
                    <Text>{durationToString(datum.duration)}</Text>
                  </Box>
                )
            },
            {
              property: "durationUnit",
              render: (datum: Activity) =>
                edit === datum.id ? (
                  <DurationUnitFormField
                    duration={datum.duration}
                    setDuration={newDuration =>
                      setActivities(
                        activities.map(activity =>
                          activity.id === datum.id ? { ...activity, duration: newDuration } : activity
                        )
                      )
                    }
                  />
                ) : null
            },
            {
              property: "edit",
              render: (datum: Activity) => (
                <Box fill align="center" justify="center">
                  <Button
                    plain
                    icon={<Edit />}
                    onClick={() => {
                      edit === datum.id ? setEdit("") : setEdit(datum.id);
                    }}
                  />
                </Box>
              )
            },
            {
              property: "delete",
              render: (datum: Activity) => (
                <Box fill align="center" justify="center">
                  <Button
                    plain
                    alignSelf="center"
                    icon={<Trash />}
                    onClick={() => {
                      setActivities(activities.filter(activity => activity.id !== datum.id));
                    }}
                  />
                </Box>
              )
            }
          ]}
          data={activities}
        />
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
          <DurationFormField duration={duration} setDuration={setDuration} />
          <Box justify="center" align="end">
            <Button label="Add" type="submit" />
          </Box>
        </Form>
      </Box>
      <Heading level="2">Result</Heading>

      {result && (
        <Fragment>
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
          <Box margin="medium" align="center" gap="medium">
            {result.awc > 12 && (
              <Text color={"status-critical"}>
                WARNING: AWC seems high - expected 4 to 12 kJ, FTP/CP may be under-estimated{" "}
              </Text>
            )}
            {result.awc < 4 && (
              <Text color={"status-critical"}>
                WARNING: AWC seems low - expected 4 to 12 kJ, FTP/CP may be over-estimated{" "}
              </Text>
            )}
          </Box>
        </Fragment>
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
