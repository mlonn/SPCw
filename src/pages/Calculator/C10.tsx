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
  TextInput,
} from "grommet";
import { Close, StatusWarning } from "grommet-icons";
import React, { useContext, useState } from "react";
import DistanceFormField from "../../components/form/distance/DistanceFormField";
import PowerFormField from "../../components/form/power/PowerFormField";
import WeightFormField from "../../components/form/weight/WeightFormField";
import useAthleteState from "../../hooks/useAthleteState";
import calculators from "../../resources/calculators";
import { Distance, Power, PowerUnit, Weight, WeightUnit } from "../../types";
import { round, toStandardDistance, toStandardPower, toStandardWeight } from "../../util";
interface Props {}

const C10 = (props: Props) => {
  const TASK_ID = 10;
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
  const [priorDistance, setPriorDistance] = useState<Distance>();
  const [targetDistance, setTargetDistance] = useState<Distance>();

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
      if (!priorDistance) {
        throw Error("Please enter prior race distance");
      }
      if (!targetDistance) {
        throw Error("Please enter target distance");
      }
      console.log(toStandardDistance(targetDistance).value, toStandardDistance(priorDistance).value);
      const multiplier = Math.pow(
        toStandardDistance(targetDistance).value / toStandardDistance(priorDistance).value,
        parseFloat(riegel)
      );
      console.log(multiplier);
      const powerToUse = toStandardPower(priorPower, weight).value;

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
          <Paragraph fill>Fill Weight to see results in Watts and Watts/kg</Paragraph>
          <Paragraph fill>Fill Race Power, Race Time, Target Time and Riegel Exponent</Paragraph>

          <Box direction="row" justify="between" wrap>
            <Heading level="2" size="small">
              Target power: {outputPower.value ? round(outputPower.value, 2).toFixed(2) : ""}
            </Heading>

            <RadioButtonGroup
              direction="row"
              name="powerunit"
              wrap
              value={outputPower.unit || ""}
              options={[...Object.values(PowerUnit)]}
              onChange={(e) => {
                if (weight?.value && weight?.unit && outputPower?.value) {
                  const kgWeight = weight?.unit === WeightUnit.KG ? weight?.value : toStandardWeight(weight).value;
                  if (e.target.value === PowerUnit.WATTS && outputPower?.unit === PowerUnit.WATTS_KG) {
                    const newValue = outputPower?.value * kgWeight;
                    setOutputPower({ ...outputPower, value: newValue, unit: e.target.value });
                  }
                  if (e.target.value === PowerUnit.WATTS_KG && outputPower?.unit === PowerUnit.WATTS) {
                    const newValue = outputPower?.value / kgWeight;
                    setOutputPower({ ...outputPower, value: newValue, unit: e.target.value });
                  }
                }
              }}
            />
          </Box>
        </Box>
        <Box margin={{ top: "medium" }}>
          <Form validate="blur">
            <WeightFormField
              weight={weight}
              setWeight={(next) => {
                setWeight(next);
                setOutputPower({ ...outputPower, value: undefined });
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
                onChange={(e) => {
                  setRiegel(e.target.value);
                  setOutputPower({ ...outputPower, value: undefined });
                }}
                step="0.01"
                type="number"
                name="riegel"
              />
            </FormField>
            <PowerFormField
              valueLabel="Prior Race Avg Power (Pt)"
              weight={weight}
              power={priorPower}
              setPower={(next) => {
                setPriorPower(next);
                setOutputPower({ ...outputPower, value: undefined });
              }}
            />
            <DistanceFormField
              valueLabel="Prior Race distance"
              distance={priorDistance}
              setDistance={(next) => {
                setPriorDistance(next);
                setOutputPower({ ...outputPower, value: undefined });
              }}
            />
            <DistanceFormField
              valueLabel="Target distance"
              distance={targetDistance}
              setDistance={(next) => {
                setTargetDistance(next);
                setOutputPower({ ...outputPower, value: undefined });
              }}
            />
          </Form>
          <Box justify="center" align="end" margin={{ vertical: "medium" }}>
            <Button label="Calculate" onClick={onCalculate} />
          </Box>
        </Box>
      </Grid>

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

export default C10;
