import {
  Box,
  Button,
  Form,
  FormField,
  Grid,
  Heading,
  Layer,
  Paragraph,
  ResponsiveContext,
  Text,
  TextInput,
} from "grommet";
import { Close, StatusWarning } from "grommet-icons";
import React, { Fragment, useContext, useState } from "react";
import { calculateScenarios } from "../../calculations/scenarios";
import DistanceFormField from "../../components/form/distance/DistanceFormField";
import DurationFormField from "../../components/form/duration/DurationFormField";
import PowerFormField from "../../components/form/power/PowerFormField";
import WeightFormField from "../../components/form/weight/WeightFormField";
import useAthleteState from "../../hooks/useAthleteState";
import calculators from "../../resources/calculators";
import { Distance, Duration, Power, Scenario, Weight } from "../../types";
import { durationToString, round, toStandardDuration, toStandardPower, toStandardWeight } from "../../util";
interface Props {}

const C21 = (props: Props) => {
  const TASK_ID = 21;
  const calculator = calculators.find((c) => c.id === TASK_ID);
  const athlete = useAthleteState();
  const [showError, setShowError] = useState(false);
  const size = useContext(ResponsiveContext);
  const [weight, setWeight] = useState<Weight>({
    value: athlete.weight?.value,
    unit: athlete.weight?.unit || athlete.units?.weight,
  });
  const [power, setPower] = useState<Power>({ unit: athlete.units?.power });
  const [distance, setDistance] = useState<Distance>();
  const [duration, setDuration] = useState<Duration>({ unit: athlete.units?.duration });

  const [calculationError, setCalculationError] = useState("");

  const [scenarios, setScenarios] = useState<Scenario[]>();

  if (!calculator) {
    return <Heading>Calcualtor not found</Heading>;
  }
  const onCalculate = (refrom: number, reto: number, riegelfrom: number, riegelto: number) => {
    try {
      if (!distance) {
        throw Error("Please enter target distance");
      }
      if (!power.value || !power.unit) {
        throw Error("Please enter prior race power");
      }
      if (!duration.unit) {
        throw Error("Please enter prior race duration");
      } else {
        toStandardDuration(duration);
      }
      const s = calculateScenarios(refrom, reto, riegelfrom, riegelto, distance, weight, duration, power);
      console.log(s);
      setScenarios(s);
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
          <Paragraph fill>Enter Weight, prior race data</Paragraph>
          <Paragraph fill>Enter a range of riegel exponents from -0.25 to -0.02</Paragraph>
          <Paragraph fill>Enter a range of target RE from 0.6 to 1.2</Paragraph>
          <Paragraph fill>
            This calculator should be used with caution as race time progressively gets lower than about 30 minutes, and
            certainly below 15 minutes.
          </Paragraph>
        </Box>
        <Box margin={{ top: "medium" }}>
          <Form validate="blur">
            <WeightFormField
              weight={weight}
              setWeight={(next) => {
                setScenarios(undefined);
                setWeight(next);
              }}
            />
            <PowerFormField
              valueLabel="Race power"
              weight={weight}
              power={power}
              setPower={(next) => {
                setScenarios(undefined);
                setPower(next);
              }}
            />
            <DurationFormField
              valueLabel="Prior Race Time"
              duration={duration}
              setDuration={(next) => {
                setDuration(next);
                setScenarios(undefined);
              }}
            />
            <DistanceFormField
              valueLabel="Target distance"
              distance={distance}
              setDistance={(next) => {
                setScenarios(undefined);
                setDistance(next);
              }}
            />
          </Form>
        </Box>
      </Grid>
      <Form
        onSubmit={(event: any) => {
          const { refrom, reto, riegelfrom, riegleto } = event.value;
          onCalculate(parseFloat(refrom), parseFloat(reto), parseFloat(riegelfrom), parseFloat(riegleto));
        }}
      >
        <Box margin={{ vertical: "medium" }}>
          <Box direction="row" fill gap="medium">
            <Box fill>
              <Heading level="2" size="small">
                Riegel exponents
              </Heading>
              <Box direction="row" fill gap="medium">
                <Box fill>
                  <FormField
                    label="From"
                    name="riegelfrom"
                    required
                    validate={[
                      (number) =>
                        number < -0.25 ? (
                          <Box>
                            <Text color="status-critical">Riegel to low</Text>
                            <Text color="status-critical">Valid range (-0.25 to -0.02)</Text>
                          </Box>
                        ) : undefined,
                      (number) =>
                        number > -0.02 ? (
                          <Box>
                            <Text color="status-critical">Riegel to high</Text>
                            <Text color="status-critical">Valid range (-0.25 to -0.02)</Text>
                          </Box>
                        ) : undefined,
                    ]}
                  >
                    <TextInput onChange={() => setScenarios(undefined)} step="0.01" type="number" name="riegelfrom" />
                  </FormField>
                </Box>
                <Box fill>
                  <FormField
                    label="To"
                    name="riegleto"
                    required
                    validate={[
                      (number) =>
                        number < -0.25 ? (
                          <Box>
                            <Text color="status-critical">Riegel to low</Text>
                            <Text color="status-critical">Valid range (-0.25 to -0.02)</Text>
                          </Box>
                        ) : undefined,
                      (number) =>
                        number > -0.02 ? (
                          <Box>
                            <Text color="status-critical">Riegel to high</Text>
                            <Text color="status-critical">Valid range (-0.25 to -0.02)</Text>
                          </Box>
                        ) : undefined,
                    ]}
                  >
                    <TextInput onChange={() => setScenarios(undefined)} step="0.01" type="number" name="riegleto" />
                  </FormField>
                </Box>
              </Box>
            </Box>
            <Box fill>
              <Heading level="2" size="small">
                Target RE
              </Heading>
              <Box direction="row" gap="medium">
                <Box fill>
                  <FormField
                    label="From"
                    name="refrom"
                    required
                    validate={[
                      (number) =>
                        number < 0.6 ? (
                          <Box>
                            <Text color="status-critical">RE to low</Text>
                            <Text color="status-critical">Valid range (0.6 to 1.2)</Text>
                          </Box>
                        ) : undefined,
                      (number) =>
                        number > 1.2 ? (
                          <Box>
                            <Text color="status-critical">RE to high</Text>
                            <Text color="status-critical">Valid range (0.6 to 1.2)</Text>
                          </Box>
                        ) : undefined,
                    ]}
                  >
                    <TextInput onChange={() => setScenarios(undefined)} step="0.01" type="number" name="refrom" />
                  </FormField>
                </Box>
                <Box fill>
                  <FormField
                    label="To"
                    name="reto"
                    required
                    validate={[
                      (number) =>
                        number < 0.6 ? (
                          <Box>
                            <Text color="status-critical">RE to low</Text>
                            <Text color="status-critical">Valid range (0.6 to 1.2)</Text>
                          </Box>
                        ) : undefined,
                      (number) =>
                        number > 1.2 ? (
                          <Box>
                            <Text color="status-critical">RE to high</Text>
                            <Text color="status-critical">Valid range (0.6 to 1.2)</Text>
                          </Box>
                        ) : undefined,
                    ]}
                  >
                    <TextInput onChange={() => setScenarios(undefined)} step="0.01" type="number" name="reto" />
                  </FormField>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box justify="center" align="end" margin={{ vertical: "medium" }}>
            <Button label="Calculate" type="submit" />
          </Box>
        </Box>
      </Form>
      {scenarios && (
        <Grid columns={{ count: 6, size: "auto" }}>
          <Box>
            <Text weight="bold">Riegel exponent</Text>
          </Box>
          <Box>
            <Text weight="bold">Target RE</Text>
          </Box>
          <Box>
            <Text weight="bold">Avg Pwr (W/kg)</Text>
          </Box>
          <Box>
            <Text weight="bold">Avg Pwr (W)</Text>
          </Box>
          <Box>
            <Text weight="bold">Est Time</Text>
          </Box>
          <Box>
            <Text weight="bold">%FTP/CP</Text>
          </Box>
          {scenarios.map((s) => (
            <Fragment>
              <Box>{s.riegel.toFixed(2)}</Box>
              <Box>{s.re.toFixed(2)}</Box>
              <Box>{round(s.power.value / toStandardWeight(weight).value, 2).toFixed(2)}</Box>
              <Box>{round(s.power.value, 2).toFixed(2)}</Box>
              <Box>{durationToString(s.time)}</Box>
              <Box>{round((s.power.value / toStandardPower(power, weight).value) * 100, 2).toFixed(2)}%</Box>
            </Fragment>
          ))}
        </Grid>
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

export default C21;
