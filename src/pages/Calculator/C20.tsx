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
import { Clear, Close, StatusWarning } from "grommet-icons";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { calculateFTP } from "../../calculations/ftp";
import Activity from "../../components/Activity";
import WeightFormField from "../../components/form/weight/WeightFormField";
import useAthleteState from "../../hooks/useAthleteState";
import calculators from "../../resources/calculators";
import { Gender, IActivity, PowerMeter, RwcRating, Weight } from "../../types";
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
    const newState = [...activities];
    newState[index] = activity;
    setActivities(newState);
    // setResult(undefined);
  };

  const onDelete = (index: number) => {
    setActivities((state) => {
      console.log(index);
      const newState = [...state];
      console.log(newState);
      newState.splice(index, 1);
      console.log(newState);
      return newState;
    });
  };

  if (!calculator) {
    return <Heading>Calcualtor not found</Heading>;
  }
  const onCalculate = () => {
    try {
      const newResult = calculateFTP(activities, weight, gender, powerMeter);
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
            Enter at least two maximal effort power & duration pairs within a two week period.
          </Paragraph>
          <Paragraph margin="small" fill>
            The durations should be between 2 and 40 minutes.
          </Paragraph>
          <Paragraph margin="small" fill>
            Atleast one activity {"<="} 6 minutes.
          </Paragraph>
          <Paragraph margin="small" fill>
            Atleast one activity {">="} 15 minutes.
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
            {activities.map((activity, index) => (
              <Activity
                date={true}
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
            onClick={() => {
              const duration = { unit: athlete.units?.duration };
              const power = { unit: athlete.units?.power };
              const id = uuidv4();
              setActivities([...activities, { id, power, duration, date: "" }]);
            }}
          />
        </Box>
        {!result && (
          <Box justify="center" align="end" margin={{ vertical: "medium" }}>
            <Button label="Calculate" onClick={onCalculate} />
          </Box>
        )}
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
            <Button icon={<Close />} onClick={() => setShowError(false)} />
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default C20;
