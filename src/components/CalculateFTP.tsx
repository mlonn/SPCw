import {
  Box,
  Button,
  DataTable,
  Form,
  FormField,
  Heading,
  Layer,
  Select,
  Text,
  TextInput,
  Grid,
  MaskedInput
} from "grommet";
import { Trash, StatusCritical, FormClose, StatusWarning } from "grommet-icons";
import React, { useState, useEffect, Fragment } from "react";
import { v4 as uuidv4 } from "uuid";
import { calculateFTP } from "../calculations/ftp";
import { Activity, DurationUnit, PowerUnit, WeightUnit, Duration, Power } from "../types";
import TimeInput from "./TimeInput";
import { durationToString, timeToSeconds, secondsToTime } from "../util";
interface Props {}

const CalculateFTP = (props: Props) => {
  const [duration, setDuration] = useState<Duration>({ unit: DurationUnit.HH_MM_SS });
  const [showError, setShowError] = useState(false);
  const [power, setPower] = useState<Power>({ unit: PowerUnit.WATTS });
  const [durationString, setDurationString] = useState("");
  const [weight, setWeight] = useState<number | undefined>();
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(WeightUnit.KG);
  const [calculationError, setCalculationError] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);

  let result;
  if (activities.length > 1) {
    try {
      result = calculateFTP(activities, weight);
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
      <Form>
        <Heading level="2">Input</Heading>
        <Box fill>
          <Form>
            <Box gap="small" direction="row">
              <Box fill>
                <FormField label="Weight">
                  <TextInput
                    value={weight}
                    type="number"
                    step="any"
                    onChange={e => setWeight(parseFloat(e.target.value))}
                  />
                </FormField>
              </Box>
              <Box justify="end">
                <FormField label="Weight unit" name="weightunit">
                  <Select
                    name="weightunit"
                    value={weightUnit}
                    options={[...Object.values(WeightUnit)]}
                    onChange={({ option }) => {
                      if (weight) {
                        if (option === WeightUnit.LBS) {
                          setWeight(Math.round(weight * 2.205 * 100) / 100);
                        }
                        if (option === WeightUnit.KG) {
                          setWeight(Math.round((weight / 2.205) * 100) / 100);
                        }
                      }
                      setWeightUnit(option);
                    }}
                  />
                </FormField>
              </Box>
            </Box>
          </Form>
        </Box>
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
              if (!weight && power.unit === PowerUnit.WATTS_KG) {
                setCalculationError("Please enter stryd weight if using Watts/kg");
                setShowError(true);
              } else {
                setActivities([...activities, { id: uuidv4(), power, duration }]);
              }
            }}
            validate="blur"
          >
            <Box gap="small" direction="row">
              <Box fill>
                <FormField label="Power">
                  <TextInput
                    onChange={e => {
                      setPower({ ...power, value: parseFloat(e.target.value) });
                    }}
                    required
                    value={power.value ? power.value : ""}
                    type="number"
                    step="any"
                  />
                </FormField>
              </Box>
              <Box justify="end">
                <FormField label="Power unit">
                  <Select
                    name="powerunit"
                    value={power.unit}
                    onChange={({ option }) => {
                      if (weight && power.value) {
                        if (option === PowerUnit.WATTS) {
                          setPower({ value: Math.round(power.value * weight * 100) / 100, unit: option });
                        }
                        if (option === PowerUnit.WATTS_KG) {
                          setPower({ value: Math.round((power.value / weight) * 100) / 100, unit: option });
                        }
                      } else {
                        setPower({ value: undefined, unit: option });
                      }
                    }}
                    options={[...Object.values(PowerUnit)]}
                  />
                </FormField>
              </Box>
            </Box>
            <Box gap="small" direction="row">
              <Box fill>
                <FormField name="duration" label="Duration">
                  {duration?.unit === DurationUnit.SECONDS ? (
                    <TextInput
                      name="duration"
                      plain
                      required
                      type="number"
                      value={duration.value ? duration.value : ""}
                      onChange={e => {
                        setDuration({ ...duration, value: parseFloat(e.target.value) });
                      }}
                    />
                  ) : (
                    <MaskedInput
                      plain
                      required
                      mask={[
                        {
                          length: [1, 2],
                          regexp: /^[0-9]{1,2}$/,
                          placeholder: "hh"
                        },
                        { fixed: ":" },
                        {
                          length: [1, 2],
                          regexp: /^[0-5][0-9]$|^[0-9]$/,
                          placeholder: "mm"
                        },
                        { fixed: ":" },
                        {
                          length: [1, 2],
                          regexp: /^[0-5][0-9]$|^[0-9]$/,
                          placeholder: "ss"
                        }
                      ]}
                      value={durationString}
                      onChange={e => {
                        const split = e.target.value.split(":");
                        if (split.length >= 1) {
                          setDuration({ ...duration, hours: parseInt(split[0]) });
                        }
                        if (split.length >= 2) {
                          setDuration({ ...duration, minutes: parseInt(split[1]) });
                        }
                        if (split.length >= 3) {
                          setDuration({ ...duration, seconds: parseInt(split[2]) });
                        }
                        setDurationString(e.target.value);
                      }}
                    />
                  )}
                </FormField>
              </Box>
              <Box justify="end">
                <FormField label="TimeUnit" name="timeunit">
                  <Select
                    name="timeunit"
                    value={duration?.unit}
                    onChange={({ option }) => {
                      if (option === DurationUnit.HH_MM_SS && duration.unit === DurationUnit.SECONDS) {
                        setDurationString(durationToString(secondsToTime(duration)));
                        setDuration(secondsToTime(duration));
                      }
                      if (option === DurationUnit.SECONDS && duration.unit === DurationUnit.HH_MM_SS) {
                        setDuration(timeToSeconds(duration));
                      }
                    }}
                    options={[...Object.values(DurationUnit)]}
                  />
                </FormField>
              </Box>
            </Box>
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
            <Text>{(Math.round(result.r2 * 10000) / 100).toFixed(2)}</Text>
            <Text>%</Text>
          </Grid>
        )}
        {activities.length < 2 && (
          <Box>
            <Text>Add more activities</Text>
          </Box>
        )}
      </Form>
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
