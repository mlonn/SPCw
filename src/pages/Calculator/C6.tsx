import {
  Box,
  Button,
  Collapsible,
  Form,
  FormField,
  Grid,
  Heading,
  Layer,
  RadioButtonGroup,
  Text,
  ThemeContext
} from "grommet";
import { Clear, Edit, FormClose, StatusWarning, Trash } from "grommet-icons";
import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { calculateFTP } from "../../calculations/ftp";
import DurationFormField from "../../components/form/duration/DurationFormField";
import DurationUnitFormField from "../../components/form/duration/DurationUnitFormField";
import DurationValueFormField from "../../components/form/duration/DurationValueFormField";
import PowerFormField from "../../components/form/power/PowerFormField";
import PowerUnitFormField from "../../components/form/power/PowerUnitFormField";
import PowerValueFormField from "../../components/form/power/PowerValueFormField";
import WeightFormField from "../../components/form/weight/WeightFormField";
import useAthleteState from "../../hooks/useAthleteState";
import calculators from "../../resources/calculators";
import {
  Activity,
  Duration,
  DurationUnit,
  Gender,
  Power,
  PowerMeter,
  PowerUnit,
  RwcRating,
  Weight,
  WeightUnit
} from "../../types";
import { durationToString, getFtpError, getRwcError, round } from "../../util";
interface Props {}
const FtpList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto auto;
  grid-template-areas: "value value value value edit delete";
  grid-gap: 10px;
  @media only screen and (max-width: 600px) {
    grid-template-columns: 1fr 1fr auto;
    grid-template-areas:
      "value value edit"
      "value value delete";
  }
  border-bottom: 1px solid black;
  padding: 10px 0;
  margin-bottom: 10px;
`;
const EditButton = styled.div`
  grid-area: edit;
`;
const DeleteButton = styled.div`
  grid-area: delete;
`;

const C6 = (props: Props) => {
  const TASK_ID = 6;
  const calculator = calculators.find(c => c.id === TASK_ID);
  const athlete = useAthleteState();
  const [duration, setDuration] = useState<Duration>({ unit: DurationUnit.HH_MM_SS });
  const [showError, setShowError] = useState(false);
  const [power, setPower] = useState<Power>({ unit: PowerUnit.WATTS });
  const [edit, setEdit] = useState<string>();
  const [weight, setWeight] = useState<Weight>(athlete.weight || { unit: WeightUnit.KG });
  const [gender, setGender] = useState(athlete.gender);
  const [powerMeter, setPowerMeter] = useState(athlete.powerMeter);
  const [calculationError, setCalculationError] = useState("");
  const mock: Activity[] = [
    {
      id: uuidv4(),
      power: { unit: PowerUnit.WATTS, value: 600 },
      duration: { unit: DurationUnit.SECONDS, value: 180 }
    },
    {
      id: uuidv4(),
      power: { unit: PowerUnit.WATTS, value: 359 },
      duration: { unit: DurationUnit.SECONDS, value: 600 }
    }
  ];
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showInputs, setShowInputs] = useState(true);
  let result;
  if (!calculator) {
    return <Heading>Calcualtor not found</Heading>;
  }

  try {
    if (activities.length > 0) {
      result = calculateFTP(activities, weight, gender, powerMeter);
      if (showError) {
        setShowError(false);
        setCalculationError("");
      } else {
      }
    }
  } catch (error) {
    if (!showError) {
      setShowError(true);
      setCalculationError(error.message);
    }
  }

  return (
    <Box alignSelf="center" width="xlarge">
      <Heading alignSelf="center" textAlign="center" level="1" size="small">
        {calculator.title}
      </Heading>
      <Heading level="3">Instructions</Heading>
      <ul>
        <li>Enter at least two maximal effort power & duration pairs from the same day.</li>
        <li>The durations should be between 2 and 30 minutes, and have at least 6 minutes difference between them.</li>
      </ul>
      <Box direction="row" justify="between">
        <Heading level="3">Inputs</Heading>
        <Box justify="center" align="center">
          <Button
            plain
            reverse
            label={`${showInputs ? "Hide" : "Show"} inputs`}
            onClick={() => setShowInputs(!showInputs)}
          />
        </Box>
      </Box>
      <Box>
        <Collapsible open={showInputs}>
          <Form validate="blur">
            <WeightFormField weight={weight} setWeight={setWeight} name={"weightunit"} label={"Weight unit"} />
            <Form onReset={() => setGender(undefined)}>
              <Box direction="row" align="center">
                <Box fill>
                  <FormField label="Gender">
                    <RadioButtonGroup
                      direction="row"
                      name="gender"
                      wrap
                      value={gender}
                      options={[...Object.values(Gender)]}
                      onChange={e => setGender(e.target.value as Gender)}
                    />
                  </FormField>
                </Box>
                <Button type="reset" icon={<Clear />} />
              </Box>
            </Form>
            <Form onReset={() => setPowerMeter(undefined)}>
              <Box direction="row" align="center" justify="center">
                <Box fill>
                  <FormField label="Power meter">
                    <RadioButtonGroup
                      direction="row"
                      name="powermeter"
                      wrap
                      value={powerMeter}
                      options={[...Object.values(PowerMeter)]}
                      onChange={e => setPowerMeter(e.target.value as PowerMeter)}
                    />
                  </FormField>
                </Box>
                <Button icon={<Clear />} type="reset" />
              </Box>
            </Form>
          </Form>
        </Collapsible>
      </Box>
      {activities.length > 0 ? (
        <ThemeContext.Extend
          value={{
            textInput: {
              extend: `padding: 11px 0`
            },
            maskedInput: {
              extend: `padding: 11px 0`
            }
          }}
        >
          <Heading level="3">Activities</Heading>
          {activities.map(datum => (
            <Fragment>
              <FtpList>
                <Box>
                  {edit === datum.id ? (
                    <PowerValueFormField
                      power={datum.power}
                      label=""
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
                  )}
                </Box>
                <Box>
                  {edit === datum.id ? (
                    <PowerUnitFormField
                      power={datum.power}
                      label=""
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
                    <Box fill>
                      <Text>{datum.power.unit}</Text>
                    </Box>
                  )}
                </Box>
                <EditButton>
                  <Button
                    plain
                    icon={<Edit />}
                    onClick={() => {
                      edit === datum.id ? setEdit("") : setEdit(datum.id);
                    }}
                  />
                </EditButton>
                <Box>
                  {edit === datum.id ? (
                    <DurationValueFormField
                      duration={datum.duration}
                      label=""
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
                      <Text>{datum.duration.value}</Text>
                    </Box>
                  ) : (
                    <Box fill>
                      <Text>{durationToString(datum.duration)}</Text>
                    </Box>
                  )}
                </Box>
                <Box>
                  {edit === datum.id ? (
                    <DurationUnitFormField
                      duration={datum.duration}
                      label=""
                      setDuration={newDuration =>
                        setActivities(
                          activities.map(activity =>
                            activity.id === datum.id ? { ...activity, duration: newDuration } : activity
                          )
                        )
                      }
                    />
                  ) : (
                    <Box fill>
                      <Text>{datum.duration.unit}</Text>
                    </Box>
                  )}
                </Box>

                <DeleteButton>
                  <Button
                    plain
                    icon={<Trash />}
                    onClick={() => {
                      setActivities(activities.filter(activity => activity.id !== datum.id));
                    }}
                  />
                </DeleteButton>
              </FtpList>
            </Fragment>
          ))}
        </ThemeContext.Extend>
      ) : (
        <Box align="center">
          <Heading level="3">No activities</Heading>
        </Box>
      )}
      <Box>
        <Heading level="3">Add activity</Heading>
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

            <Text>RWC (W')</Text>
            <Text>{result.rwc}</Text>
            <Text>kJ</Text>

            <Text>RWC (W')/kg</Text>
            {result.rwckg ? <Text>{Math.round(result.rwckg)}</Text> : <Text>Enter weight</Text>}
            <Text>Joules/kg</Text>

            <Text>R^2 Coefficient</Text>
            <Text>{round(result.r2 * 100, 2).toFixed(2)}</Text>
            <Text>%</Text>
          </Grid>
          {result.rwcRating && (
            <Box pad={{ vertical: "medium" }}>
              <Text
                color={
                  result.rwcRating === RwcRating.TOO_HIGH || result.rwcRating === RwcRating.TOO_LOW
                    ? "status-critical"
                    : ""
                }
              >
                {getRwcError(result.rwcRating, gender, powerMeter)}
              </Text>
              {getFtpError(result.rwcRating) !== null && (
                <Text color={"status-critical"}>{getFtpError(result.rwcRating)}</Text>
              )}
            </Box>
          )}
        </Fragment>
      )}
      {activities.length < 2 && (
        <Box align="center">
          <Heading level="3">Add more activities</Heading>
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

export default C6;
