import {
  Box,
  Button,
  Form,
  FormField,
  Grid,
  Heading,
  Layer,
  Paragraph,
  RadioButtonGroup,
  ResponsiveContext,
  Text,
  ThemeContext,
} from "grommet";
import { Clear, StatusWarning } from "grommet-icons";
import debounce from "lodash.debounce";
import React, { Fragment, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { calculateFTP } from "../../calculations/ftp";
import WeightFormField from "../../components/form/weight/WeightFormField";
import useAthleteState from "../../hooks/useAthleteState";
import calculators from "../../resources/calculators";
import { DurationUnit, Gender, IActivity, PowerMeter, PowerUnit, RwcRating, Weight } from "../../types";
import { getFtpError, getRwcError, round } from "../../util";
import Activity from "../Activity";
interface Props {}

const C6 = (props: Props) => {
  const TASK_ID = 6;
  const calculator = calculators.find((c) => c.id === TASK_ID);
  const athlete = useAthleteState();
  const [showError, setShowError] = useState(false);
  const size = useContext(ResponsiveContext);
  const [weight, setWeight] = useState(athlete.weight);
  const [gender, setGender] = useState(athlete.gender);
  const [powerMeter, setPowerMeter] = useState(athlete.powerMeter);
  const [calculationError, setCalculationError] = useState("");

  const initialActivities: IActivity[] = [
    {
      id: uuidv4(),
      power: {},
      duration: {},
    },
    {
      id: uuidv4(),
      power: {},
      duration: {},
    },
  ];

  const [activities, setActivities] = useState<IActivity[]>([...initialActivities]);
  const debouncedSetActivites = debounce(setActivities, 100);
  const updateActivity = (newActivity: IActivity) => {
    console.log(newActivity.id);
    debouncedSetActivites(activities.map((activity) => (activity.id === newActivity.id ? newActivity : activity)));
  };
  const removeActivity = (activityToRemove: IActivity) => {
    setActivities(activities.filter((activity) => activityToRemove.id !== activity.id));
  };
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
      }
    }
  } catch (error) {
    if (calculationError !== error.message) {
      setShowError(true);
      setCalculationError(error.message);
    }
  }

  return (
    <Box alignSelf="center" width="xlarge">
      <Heading alignSelf="center" textAlign="center" level="1" size="small">
        {calculator.title}
      </Heading>
      <Grid columns={size !== "small" ? ["1fr", "1fr"] : undefined} gap="medium">
        <Box>
          <Heading level="2" size="small">
            Instructions
          </Heading>
          <Paragraph>Enter at least two maximal effort power & duration pairs from the same day.</Paragraph>
          <Paragraph>
            The durations should be between 2 and 30 minutes, and have at least 6 minutes difference between them.
          </Paragraph>
        </Box>
        <Box margin={{ top: "medium" }}>
          <Form validate="blur">
            <WeightFormField weight={weight} setWeight={setWeight} />
          </Form>
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
                    onChange={(e) => setGender(e.target.value as Gender)}
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
                    onChange={(e) => setPowerMeter(e.target.value as PowerMeter)}
                  />
                </FormField>
              </Box>
              <Button icon={<Clear />} type="reset" />
            </Box>
          </Form>
        </Box>
      </Grid>
      <Heading level="2" size="small">
        Activities
      </Heading>
      {activities.length > 0 ? (
        <ThemeContext.Extend
          value={{
            textInput: {
              extend: `padding: 11px 0`,
            },
            maskedInput: {
              extend: `padding: 11px 0`,
            },
          }}
        >
          <Box margin={{ vertical: "medium" }}>
            {activities.map((activity) => (
              <Activity
                canDelete={activities.length > 2}
                key={activity.id}
                activity={activity}
                weight={weight}
                updateActivity={updateActivity}
                removeActivity={removeActivity}
              />
            ))}
          </Box>
        </ThemeContext.Extend>
      ) : (
        <Box align="center">
          <Heading level="3">No activities</Heading>
        </Box>
      )}
      <Box>
        <Box justify="center" align="end">
          <Button
            label="Add activity"
            type="submit"
            onClick={() => {
              const duration = { unit: DurationUnit.HH_MM_SS };
              const power = { unit: PowerUnit.WATTS };
              const id = uuidv4();
              setActivities([...activities, { id, power, duration }]);
            }}
          />
        </Box>
      </Box>

      {result && (
        <Fragment>
          <Heading level="2">Result</Heading>
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

      {showError && (
        <Layer
          position="bottom"
          modal={false}
          margin={{ vertical: "xlarge", horizontal: "small" }}
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
            pad={{ vertical: "small", horizontal: "medium" }}
            background="status-critical"
          >
            <Box align="center" direction="row" gap="xsmall">
              <StatusWarning />
              <Text>{calculationError}</Text>
            </Box>
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default C6;
