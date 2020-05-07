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
import DurationUnitFormField from "../components/form/duration/DurationUnitFormField";
import PowerFormField from "../components/form/power/PowerFormField";
import PowerUnitFormField from "../components/form/power/PowerUnitFormField";
import WeightFormField from "../components/form/weight/WeightFormField";
import WeightUnitFormField from "../components/form/weight/WeightUnitFormField";
import { TypeKeys } from "../hooks/useAthlete/types";
import useAthleteAction from "../hooks/useAthleteAction";
import useAthleteState from "../hooks/useAthleteState";
import { DurationUnit, Gender, PowerMeter } from "../types";
interface Props {}

const Profile = (props: Props) => {
  const {
    id,
    weight: initialWeight,
    tte: initialTte,
    ftp: initialFtp,
    name: initialName,
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
        }}
        onSubmit={() => {
          dispatch({
            type: TypeKeys.SET_PROFILE,
            profile: {
              id,
              weight,
              tte,
              ftp,
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
            <WeightUnitFormField
              name="weightUnit"
              weight={{ unit: units?.weight }}
              setWeight={(w) => {
                setUnits({ ...units, weight: w?.unit });
              }}
            />
            <PowerUnitFormField
              name="powerUnit"
              power={{ unit: units?.power }}
              setPower={(p) => {
                setUnits({ ...units, power: p?.unit });
              }}
              weight={weight}
            />
            <DurationUnitFormField
              name="durationUnit"
              duration={{ unit: units?.duration }}
              unitLabel="Duration unit"
              setDuration={(newDuration) => {
                setUnits({ ...units, duration: newDuration?.unit });
              }}
            />
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
