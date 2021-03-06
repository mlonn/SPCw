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
} from "grommet";
import { Clear, Close, StatusWarning } from "grommet-icons";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { task20 } from "../../calculations/task";
import Activity from "../../components/Activity";
import WeightFormField from "../../components/form/weight/WeightFormField";
import useAthleteState from "../../hooks/useAthleteState";
import calculators from "../../resources/calculators";
import {
  Duration,
  DurationUnit,
  Gender,
  IActivity,
  Power,
  PowerMeter,
  PowerUnit,
  RwcRating,
  Weight,
} from "../../types";
import { getFtpError, getRwcError, round } from "../../util";
interface Props {}

const C20 = (props: Props) => {
  const TASK_ID = 20;
  const calculator = calculators.find((c) => c.id === TASK_ID);
  const athlete = useAthleteState();
  const [showError, setShowError] = useState(false);
  const size = useContext(ResponsiveContext);
  const [weight, setWeight] = useState<Weight>({
    value: athlete.weight?.value,
    unit: athlete.weight?.unit ? athlete.weight.unit : athlete.units?.weight,
  });
  const [power, setPower] = useState<Power>({ unit: athlete.units?.power });
  const [duration, setDuration] = useState<Duration>({ unit: athlete.units?.duration });
  const [gender, setGender] = useState(athlete.gender);
  const [powerMeter, setPowerMeter] = useState(athlete.powerMeter);
  const [calculationError, setCalculationError] = useState("");

  const initialActivities: IActivity[] = [
    {
      id: uuidv4(),
      power: { unit: athlete.units?.power },
      duration: { unit: athlete.units?.duration },
      date: "",
    },
    {
      id: uuidv4(),
      power: { unit: athlete.units?.power },
      duration: { unit: athlete.units?.duration },
      date: "",
    },
  ];

  const [activities, setActivities] = useState<IActivity[]>(initialActivities);
  useEffect(() => {
    setResult(undefined);
  }, [activities, weight, gender, powerMeter]);
  const [result, setResult] = useState<any>();

  const onActivityChange = (index: number, activity: IActivity) => {
    setActivities((oldState) => {
      const newState = [...oldState];
      newState[index] = activity;
      return newState;
    });
  };

  const onDelete = (index: number) => {
    setActivities((state) => {
      const newState = [...state];
      newState.splice(index, 1);
      return newState;
    });
  };

  if (!calculator) {
    return <Heading>Calcualtor not found</Heading>;
  }
  const onCalculate = () => {
    try {
      const newResult = task20(activities, calculator.requirements, weight, gender, powerMeter);
      setResult(newResult);
      if (showError) {
        setShowError(false);
        setCalculationError("");
      }
    } catch (error) {
      setShowError(true);
      setCalculationError(error.message);
    }
  };
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
          <Paragraph margin="small" fill>
            Enter at least two maximal effort power & duration pairs within a three week period.
          </Paragraph>
          <Paragraph margin="small" fill>
            The durations should be between 2 and 40 minutes.
          </Paragraph>
          <Paragraph margin="small" fill>
            at least one activity {"\u2264"} 6 minutes.
          </Paragraph>
          <Paragraph margin="small" fill>
            at least one activity {"\u2265"} 15 minutes.
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
      <Box>
        <Heading level="2" size="small">
          Activities
        </Heading>
        <Grid columns={["1fr", "2fr", "2fr"]} gap="small">
          <Box />
          <FormField label="Power unit">
            <RadioButtonGroup
              direction="row"
              name="powerunitforallactivities"
              wrap
              value={power.unit}
              options={[...Object.values(PowerUnit)]}
              onChange={(e) => {
                setActivities((state) =>
                  state.map((a) => ({ ...a, power: { ...a.power, unit: e.target.value as PowerUnit } }))
                );
                setPower({ ...power, unit: e.target.value as PowerUnit });
              }}
            />
          </FormField>
          <FormField label="Duration unit">
            <RadioButtonGroup
              direction="row"
              name="durationunitforallactivities"
              wrap
              value={duration.unit}
              options={[...Object.values(DurationUnit)]}
              onChange={(e) => {
                setActivities((state) =>
                  state.map((a) => ({ ...a, duration: { ...a.duration, unit: e.target.value as DurationUnit } }))
                );
                setDuration({ ...duration, unit: e.target.value as DurationUnit });
              }}
            />
          </FormField>
        </Grid>
      </Box>

      {activities.length > 0 ? (
        <Box margin={{ vertical: "medium" }}>
          {activities.map((activity, index) => (
            <Activity
              date
              canDelete={activities.length > 2}
              key={activity.id}
              index={index}
              activity={activity}
              weight={weight}
              onActivityChange={onActivityChange}
              onDelete={onDelete}
            />
          ))}
        </Box>
      ) : (
        <Box align="center">
          <Heading level="3">No activities</Heading>
        </Box>
      )}

      <Box>
        <Box justify="center" align="end">
          <Button
            label="Add activity"
            onClick={() => {
              const id = uuidv4();
              setActivities([...activities, { id, power, duration, date: "" }]);
            }}
          />
        </Box>
        <Box justify="center" align="end" margin={{ vertical: "medium" }}>
          <Button label="Calculate" onClick={onCalculate} />
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
            {result.ftpkg ? <Text>{result.ftpkg} </Text> : <Text>Enter Stryd Weight</Text>}
            <Text>Watts/kg</Text>

            <Text>RWC (W')</Text>
            <Text>{result.rwc}</Text>
            <Text>kJ</Text>

            <Text>RWC (W')/kg</Text>
            {result.rwckg ? <Text>{Math.round(result.rwckg)}</Text> : <Text>Enter Stryd Weight</Text>}
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
            <Button icon={<Close />} onClick={() => setShowError(false)} />
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default C20;
