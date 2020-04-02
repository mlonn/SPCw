import { Box, Form, Heading, FormField, RadioButtonGroup, Button } from "grommet";
import React, { useState, useEffect } from "react";
import WeightFormField from "../components/form/weight/WeightFormField";
import useAthleteState from "../hooks/useAthleteState";
import { Duration, DurationUnit, Power, PowerUnit, Weight, WeightUnit, Gender, PowerMeter } from "../types";
import DurationFormField from "../components/form/duration/DurationFormField";
import PowerFormField from "../components/form/power/PowerFormField";
import useAthleteAction from "../hooks/useAthleteAction";
import { TypeKeys } from "../hooks/useAthlete/types";
import { Clear } from "grommet-icons";
interface Props {}

const Profile = (props: Props) => {
  const athlete = useAthleteState();
  const dispatch = useAthleteAction();

  const weight = athlete.weight;
  const setWeight = (newWeight: Weight) => {
    dispatch({ type: TypeKeys.SET_WEIGHT, weight: newWeight });
  };
  const tte = athlete.tte;
  const setTte = (newTte: Duration) => {
    dispatch({ type: TypeKeys.SET_TTE, tte: newTte });
  };
  const ftp = athlete.ftp;
  const setFtp = (newPower: Power) => {
    dispatch({ type: TypeKeys.SET_FTP, ftp: newPower });
  };

  return (
    <Box alignSelf="center" width="xlarge">
      <Heading level="2">Profile</Heading>
      <Form>
        <FormField
          label="Athelete Name"
          value={athlete.name}
          onChange={e => dispatch({ type: TypeKeys.SET_NAME, name: e.target.value })}
        />
        <WeightFormField weight={athlete.weight} setWeight={setWeight} />
        <PowerFormField power={ftp} setPower={setFtp} weight={weight} valueLabel={"FTP/CP"} />
        <DurationFormField duration={tte} setDuration={setTte} valueLabel={"Time To Exhaustion"} />
        <Form onReset={() => dispatch({ type: TypeKeys.CLEAR_GENDER })}>
          <Box direction="row" align="center">
            <Box fill>
              <FormField label="Gender">
                <RadioButtonGroup
                  direction="row"
                  name="gender"
                  value={athlete.gender}
                  options={[...Object.values(Gender)]}
                  onChange={e => dispatch({ type: TypeKeys.SET_GENDER, gender: e.target.value as Gender })}
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
                  value={athlete.powerMeter}
                  options={[...Object.values(PowerMeter)]}
                  onChange={e => dispatch({ type: TypeKeys.SET_POWER_METER, powerMeter: e.target.value as PowerMeter })}
                />
              </FormField>
            </Box>
            <Button icon={<Clear />} type="reset" />
          </Box>
        </Form>
      </Form>
    </Box>
  );
};

export default Profile;
