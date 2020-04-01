import { Box, Button, Form, Grid, Heading, Layer, Text, ThemeContext } from "grommet";
import { Edit, FormClose, StatusWarning, Trash } from "grommet-icons";
import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { calculateFTP } from "../calculations/ftp";
import { Activity, Duration, DurationUnit, Power, PowerUnit, Weight, WeightUnit } from "../types";
import { durationToString, round } from "../util";
import DurationFormField from "../components/form/duration/DurationFormField";
import DurationUnitFormField from "../components/form/duration/DurationUnitFormField";
import DurationValueFormField from "../components/form/duration/DurationValueFormField";
import PowerFormField from "../components/form/power/PowerFormField";
import PowerUnitFormField from "../components/form/power/PowerUnitFormField";
import PowerValueFormField from "../components/form/power/PowerValueFormField";
import WeightFormField from "../components/form/weight/WeightFormField";
import useAthleteState from "../hooks/useAthleteState";
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

const NewRow = styled.div``;
const CalculateFTP = (props: Props) => {
  const athlete = useAthleteState();
  const [duration, setDuration] = useState<Duration>({ unit: DurationUnit.HH_MM_SS });
  const [showError, setShowError] = useState(false);
  const [power, setPower] = useState<Power>({ unit: PowerUnit.WATTS });
  const [edit, setEdit] = useState<string>();
  const [weight, setWeight] = useState<Weight>(athlete.weight ? athlete.weight : { unit: WeightUnit.KG });
  const [calculationError, setCalculationError] = useState("");
  const mock: Activity[] = Array.from({ length: 10 }).map(a => ({
    id: uuidv4(),
    power: { unit: PowerUnit.WATTS, value: Math.floor(Math.random() * 400) + 200 },
    duration: { unit: DurationUnit.SECONDS, value: Math.floor(Math.random() * 1000) + 200 }
  }));
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
      if (!showError) {
        setShowError(true);
        setCalculationError(error.message);
      }
    }
  }

  return (
    <Box alignSelf="center" width="xlarge">
      <Heading level="2">Calculate FTP/CP and RWC (W') from a CP test</Heading>
      <Heading level="3">Input</Heading>
      <Form validate="blur">
        <WeightFormField weight={weight} setWeight={setWeight} name={"weightunit"} label={"Weight unit"} />
      </Form>
      <Heading level="3">Activities</Heading>
      {activities.length > 0 && (
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
          {activities.map(datum => (
            <Fragment>
              <FtpList>
                <NewRow>
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
                </NewRow>
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
                <NewRow>
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
                </NewRow>
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

            <Text>RWC (W')</Text>
            <Text>{result.rwc}</Text>
            <Text>kJ</Text>
            <Text>R^2 Coefficient</Text>
            <Text>{round(result.r2 * 100, 2).toFixed(2)}</Text>
            <Text>%</Text>
          </Grid>
          <Box margin="medium" align="center" gap="medium">
            {result.rwc > 12 && (
              <Text color={"status-critical"}>
                WARNING: RWC seems high - expected 4 to 12 kJ, FTP/CP may be under-estimated{" "}
              </Text>
            )}
            {result.rwc < 4 && (
              <Text color={"status-critical"}>
                WARNING: RWC seems low - expected 4 to 12 kJ, FTP/CP may be over-estimated{" "}
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
