import {
  Box,
  Button,
  Form,
  FormField,
  Grid,
  Heading,
  Layer,
  RadioButtonGroup,
  ResponsiveContext,
  TextInput,
} from "grommet";
import { Clear } from "grommet-icons";
import React, { useContext, useState } from "react";
import DurationFormField from "../components/form/duration/DurationFormField";
import PowerFormField from "../components/form/power/PowerFormField";
import WeightFormField from "../components/form/weight/WeightFormField";
import { TypeKeys } from "../hooks/useAthlete/types";
import useAthleteAction from "../hooks/useAthleteAction";
import useAthleteState from "../hooks/useAthleteState";
import { DurationUnit, Gender, PowerMeter, PowerUnit, WeightUnit } from "../types";
interface Props {}

const Profile = (props: Props) => {
  const {
    id,
    weight: initialWeight,
    tte: initialTte,
    ftp: initialFtp,
    name: initialName,
    riegel: initialRiegel,
    gender: initialGender,
    powerMeter: initialPowerMeter,
    units: initialUnits,
  } = useAthleteState();
  const [weight, setWeight] = useState(initialWeight);
  const [tte, setTte] = useState(initialTte);
  const [ftp, setFtp] = useState(initialFtp);
  const [name, setName] = useState(initialName);
  const [gender, setGender] = useState(initialGender);
  const [powerMeter, setPowerMeter] = useState(initialPowerMeter);
  const [units, setUnits] = useState(initialUnits);
  const [riegel, setRiegel] = useState(initialRiegel);
  const [showDialog, setShowDialog] = useState(false);

  const dispatch = useAthleteAction();

  const size = useContext(ResponsiveContext);

  return (
    <Box alignSelf="center" width="xlarge">
      <Heading level="2">Profile</Heading>
      <Form
        onReset={() => {
          dispatch({ type: TypeKeys.CLEAR_PROFILE });
          setWeight(undefined);
          setTte({ hours: 0, minutes: 50, seconds: 0, unit: DurationUnit.HH_MM_SS });
          setFtp(undefined);
          setName(undefined);
          setGender(undefined);
          setPowerMeter(undefined);
          setUnits(undefined);
          setRiegel(undefined);
        }}
        onSubmit={() => {
          dispatch({
            type: TypeKeys.SET_PROFILE,
            profile: {
              id,
              weight,
              tte,
              ftp,
              riegel,
              name,
              gender,
              powerMeter,
              units,
            },
          });
          setShowDialog(true);
          setTimeout(() => setShowDialog(false), 1000);
        }}
      >
        <Grid columns={size !== "small" ? ["1fr", "1fr"] : undefined} gap="medium">
          <Box>
            <Heading level="3">Athlete info</Heading>
            <FormField label="Athelete Name" name="name">
              <TextInput name="name" value={name || ""} onChange={(e) => setName(e.target.value)} />
            </FormField>
            <WeightFormField weight={weight} setWeight={setWeight} />
            <PowerFormField power={ftp} setPower={setFtp} weight={weight} valueLabel={"FTP/CP"} />
            <DurationFormField duration={tte} setDuration={setTte} valueLabel={"Time To Exhaustion"} />
            {/* <FormField
              label="Riegel Exponent"
              validate={[
                (number) =>
                  number < -0.25 ? (
                    <Box>
                      <Text color="status-critical">Riegel too low</Text>
                      <Text color="status-critical">Valid range (-0.25 to -0.02)</Text>
                    </Box>
                  ) : undefined,
                (number) =>
                  number > -0.02 ? (
                    <Box>
                      <Text color="status-critical">Riegel too high</Text>
                      <Text color="status-critical">Valid range (-0.25 to -0.02)</Text>
                    </Box>
                  ) : undefined,
              ]}
            >
              <TextInput
                value={riegel}
                onChange={(e) => setRiegel(parseFloat(e.target.value))}
                step="0.01"
                type="number"
                name="riegelfrom"
              />
            </FormField> */}
            <Box direction="row" align="center">
              <Box fill>
                <FormField label="Gender">
                  <RadioButtonGroup
                    direction="row"
                    name="gender"
                    wrap
                    value={gender || ""}
                    options={[...Object.values(Gender)]}
                    onChange={(e) => setGender(e.target.value as Gender)}
                  />
                </FormField>
              </Box>
              <Button icon={<Clear />} onClick={() => setGender(undefined)} />
            </Box>

            <Box direction="row" align="center">
              <Box fill>
                <FormField label="Power meter">
                  <RadioButtonGroup
                    direction="row"
                    name="powermeter"
                    wrap
                    value={powerMeter || ""}
                    options={[...Object.values(PowerMeter)]}
                    onChange={(e) => setPowerMeter(e.target.value as PowerMeter)}
                  />
                </FormField>
              </Box>
              <Button icon={<Clear />} onClick={() => setPowerMeter(undefined)} />
            </Box>
          </Box>
          <Box>
            <Heading level="3">Standard Units</Heading>
            <Box direction="row" align="center">
              <Box fill>
                <FormField label="Weight unit">
                  <RadioButtonGroup
                    direction="row"
                    name="powerunitforallactivities"
                    wrap
                    value={units?.weight || ""}
                    options={[...Object.values(WeightUnit)]}
                    onChange={(e) => {
                      setUnits({ ...units, weight: e.target.value as WeightUnit });
                    }}
                  />
                </FormField>
              </Box>
              <Button icon={<Clear />} onClick={() => setUnits({ ...units, weight: undefined })} />
            </Box>
            <Box direction="row" align="center">
              <Box fill>
                <FormField label="Power unit">
                  <RadioButtonGroup
                    direction="row"
                    width="medium"
                    name="powerunitforallactivities"
                    wrap
                    value={units?.power || ""}
                    options={[...Object.values(PowerUnit)]}
                    onChange={(e) => {
                      setUnits({ ...units, power: e.target.value as PowerUnit });
                    }}
                  />
                </FormField>
              </Box>
              <Button icon={<Clear />} onClick={() => setUnits({ ...units, power: undefined })} />
            </Box>
            <Box direction="row" align="center">
              <Box fill>
                <FormField label="Duration unit">
                  <RadioButtonGroup
                    direction="row"
                    name="durationunitforallactivities"
                    wrap
                    value={units?.duration || ""}
                    options={[...Object.values(DurationUnit)]}
                    onChange={(e) => {
                      setUnits({ ...units, duration: e.target.value as DurationUnit });
                    }}
                  />
                </FormField>
              </Box>
              <Button icon={<Clear />} onClick={() => setUnits({ ...units, duration: undefined })} />
            </Box>
          </Box>
        </Grid>
        <Box gap="medium" direction="row">
          <Button primary label="Save profile" type="submit" />
          <Button label="Clear profile" type="reset" />
        </Box>
      </Form>
      {showDialog && (
        <Layer
          position="bottom"
          modal={false}
          margin={{ vertical: "xlarge", horizontal: "small" }}
          onEsc={() => setShowDialog(false)}
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
            background="brand"
          >
            <Box align="center" direction="row" gap="xsmall">
              Profile saved
            </Box>
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default Profile;
