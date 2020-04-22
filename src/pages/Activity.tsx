import { Button } from "grommet";
import { Trash } from "grommet-icons";
import React, { memo } from "react";
import styled from "styled-components";
import DurationFormField from "../components/form/duration/DurationFormField";
import PowerFormField from "../components/form/power/PowerFormField";
import { IActivity, Weight } from "../types";

const ActivityContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-template-areas: "value value edit delete";
  grid-gap: 10px;
  @media only screen and (max-width: 600px) {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "value delete"
      "value delete";
  }
  align-items: center;
  margin-bottom: 10px;
`;
const EditButton = styled.div`
  grid-area: edit;
`;
const DeleteButton = styled.div`
  grid-area: delete;
`;
interface Props {
  activity: IActivity;
  canDelete?: boolean;
  weight?: Weight;
  updateActivity: (activity: IActivity) => void;
  removeActivity: (activity: IActivity) => void;
}
const Activity = ({ activity, weight, updateActivity, removeActivity, canDelete = true }: Props) => {
  return (
    <ActivityContainer key={activity.id}>
      <PowerFormField
        power={activity.power}
        label=""
        setPower={(newPower) => updateActivity({ ...activity, power: newPower })}
        weight={weight}
      />

      <DurationFormField
        duration={activity.duration}
        label=""
        setDuration={(newDuration) => {
          console.log(newDuration);
          updateActivity({ ...activity, duration: newDuration });
        }}
      />
      <DeleteButton>
        {canDelete && (
          <Button
            plain
            icon={<Trash />}
            onClick={() => {
              removeActivity(activity);
            }}
          />
        )}
      </DeleteButton>
    </ActivityContainer>
  );
};

export default Activity;
