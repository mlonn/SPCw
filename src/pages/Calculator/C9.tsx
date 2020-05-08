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
import React, { useContext, useState } from "react";
import DurationFormField from "../../components/form/duration/DurationFormField";
import PowerFormField from "../../components/form/power/PowerFormField";
import PowerUnitFormField from "../../components/form/power/PowerUnitFormField";
import WeightFormField from "../../components/form/weight/WeightFormField";
import useAthleteState from "../../hooks/useAthleteState";
import calculators from "../../resources/calculators";
import { Duration, Power, Weight } from "../../types";
import { round, toStandardDuration, toStandardPower } from "../../util";
interface Props {}

const C9 = (props: Props) => {
  const TASK_ID = 9;
  const calculator = calculators.find((c) => c.id === TASK_ID);
  const athlete = useAthleteState();
  const [showError, setShowError] = useState(false);
  const size = useContext(ResponsiveContext);
  const [weight, setWeight] = useState<Weight>({
    value: athlete.weight?.value,
    unit: athlete.weight?.unit || athlete.units?.weight,
  });
  const [priorPower, setPriorPower] = useState<Power>({ unit: athlete.units?.power });
  const [outputPower, setOutputPower] = useState<Power>({ unit: athlete.units?.power });
  const [priorDuration, setPriorDuration] = useState<Duration>({ unit: athlete.units?.duration });
  const [targetDuration, setTargetDuration] = useState<Duration>({ unit: athlete.units?.duration });
  const [calculationError, setCalculationError] = useState("");
  const [riegel, setRiegel] = useState(athlete.riegel?.toString());
  if (!calculator) {
    return <Heading>Calcualtor not found</Heading>;
  }
  const onCalculate = () => {
    try {
      if (!riegel) {
        throw Error("Please enter Riegel Exponent");
      }
      const multiplier = Math.pow(
        toStandardDuration(targetDuration).value / toStandardDuration(priorDuration).value,
        parseFloat(riegel)
      );
      const powerToUse = toStandardPower(priorPower).value;

      setOutputPower({ ...outputPower, value: powerToUse * multiplier });
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
          <Paragraph>Fill Weight to see results in Watts and Watts/kg</Paragraph>
          <Paragraph>Fill Race Power, Race Time, Target Time and Riegel Exponent</Paragraph>
        </Box>
        <Box margin={{ top: "medium" }}>
          <Form validate="blur">
            <WeightFormField
              weight={weight}
              setWeight={(next) => {
                setWeight(next);
              }}
            />
            <FormField
              label="Riegel Exponent"
              name="riegel"
              validate={[
                (number) =>
                  number < -0.14 ? (
                    <Box>
                      <Text color="status-critical">Riegel to low</Text>
                      <Text color="status-critical">Valid range (-0.14 to -0.02)</Text>
                    </Box>
                  ) : (
                    undefined
                  ),
                (number) =>
                  number > -0.02 ? (
                    <Box>
                      <Text color="status-critical">Riegel to high</Text>
                      <Text color="status-critical">Valid range (-0.14 to -0.02)</Text>
                    </Box>
                  ) : (
                    undefined
                  ),
              ]}
            >
              <TextInput
                value={riegel}
                onChange={(e) => setRiegel(e.target.value)}
                step="0.01"
                type="number"
                name="riegel"
              />
            </FormField>
          </Form>
        </Box>
      </Grid>

      <Box direction="row" gap="medium">
        <Box>
          <PowerFormField
            valueLabel="Prior Race Avg Power (Pt)"
            weight={weight}
            power={priorPower}
            setPower={(next) => {
              setPriorPower(next);
            }}
          />
          <DurationFormField
            valueLabel="Prior Race Time"
            duration={priorDuration}
            setDuration={(next) => {
              setPriorDuration(next);
            }}
          />
        </Box>
        <Box>
          <DurationFormField
            valueLabel="Target Time"
            duration={targetDuration}
            setDuration={(next) => {
              setTargetDuration(next);
            }}
          />
          <Box direction="row" align="end">
            <Box fill justify="end">
              <Heading level="2" size="small">
                Target power: {outputPower.value ? round(outputPower.value, 2).toFixed(2) : ""}
              </Heading>
            </Box>
            <PowerUnitFormField power={outputPower} weight={weight} setPower={setOutputPower} />
          </Box>
        </Box>
      </Box>
      <Box justify="center" align="end" margin={{ vertical: "medium" }}>
        <Button label="Calculate" onClick={onCalculate} />
      </Box>

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

export default C9;
