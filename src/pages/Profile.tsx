import { Box, Button, Form, FormField, Heading, RadioButtonGroup, TextInput } from "grommet";
import { Clear } from "grommet-icons";
import React from "react";
import DurationFormField from "../components/form/duration/DurationFormField";
import PowerFormField from "../components/form/power/PowerFormField";
import WeightFormField from "../components/form/weight/WeightFormField";
import { TypeKeys } from "../hooks/useAthlete/types";
import useAthleteAction from "../hooks/useAthleteAction";
import useAthleteState from "../hooks/useAthleteState";
import { Duration, Gender, Power, PowerMeter, Weight } from "../types";
interface Props {}

const Profile = (props: Props) => {
  const { weight, tte, ftp, name, gender, powerMeter } = useAthleteState();
  const dispatch = useAthleteAction();

  const setWeight = (newWeight: Weight) => {
    dispatch({ type: TypeKeys.SET_WEIGHT, weight: newWeight });
  };

  const setTte = (newTte: Duration) => {
    dispatch({ type: TypeKeys.SET_TTE, tte: newTte });
  };

  const setFtp = (newPower: Power) => {
    dispatch({ type: TypeKeys.SET_FTP, ftp: newPower });
  };

  return (
    <Box alignSelf="center" width="xlarge">
      <Heading level="2">Profile</Heading>
      <Form
        onReset={() => {
          dispatch({ type: TypeKeys.CLEAR_PROFILE });
        }}
      >
        <FormField label="Athelete Name" name="name">
          <TextInput
            name="name"
            value={name || ""}
            onChange={(e) => dispatch({ type: TypeKeys.SET_NAME, name: e.target.value })}
          />
        </FormField>
        <WeightFormField weight={weight} setWeight={setWeight} />
        <PowerFormField power={ftp} setPower={setFtp} weight={weight} valueLabel={"FTP/CP"} />
        <DurationFormField duration={tte} setDuration={setTte} valueLabel={"Time To Exhaustion"} />
        <Form onReset={() => dispatch({ type: TypeKeys.CLEAR_GENDER })}>
          <Box direction="row" align="center">
            <Box fill>
              <FormField label="Gender">
                <RadioButtonGroup
                  direction="row"
                  name="gender"
                  value={gender}
                  options={[...Object.values(Gender)]}
                  onChange={(e) => dispatch({ type: TypeKeys.SET_GENDER, gender: e.target.value as Gender })}
                />
              </FormField>
            </Box>
            <Button type="reset" icon={<Clear />} />
          </Box>
        </Form>
        <Form onReset={() => dispatch({ type: TypeKeys.CLEAR_POWER_METER })}>
          <Box direction="row" align="center">
            <Box fill>
              <FormField label="Power meter">
                <RadioButtonGroup
                  direction="row"
                  name="powermeter"
                  value={powerMeter}
                  options={[...Object.values(PowerMeter)]}
                  onChange={(e) =>
                    dispatch({ type: TypeKeys.SET_POWER_METER, powerMeter: e.target.value as PowerMeter })
                  }
                />
              </FormField>
            </Box>
            <Button icon={<Clear />} type="reset" />
          </Box>
        </Form>
        <Button label="Clear profile" type="reset" />
      </Form>
    </Box>
  );
};

export default Profile;