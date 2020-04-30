import { Button } from "grommet";
import { Trash } from "grommet-icons";
import React, { memo } from "react";
import styled from "styled-components";
import { IActivity, Weight } from "../types";
import DurationValueFormField from "./form/duration/DurationValueFormField";
import PowerValueFormField from "./form/power/PowerValueFormField";

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

const DeleteButton = styled.div`
  grid-area: delete;
`;
interface Props {
  activity: IActivity;
  index: number;
  canDelete?: boolean;
  weight?: Weight;
  onActivityChange: (index: number, activity: IActivity) => void;
  onDelete: (index: number) => void;
}
const Activity = (props: Props) => {
  const { activity, weight, onActivityChange, onDelete, canDelete = true, index } = props;

  return (
    <ActivityContainer>
      <PowerValueFormField
        power={activity.power}
        setPower={(newPower) => {
          const newActivity = { ...activity, power: newPower };
          onActivityChange(index, newActivity);
        }}
        weight={weight}
      />
      <DurationValueFormField
        duration={activity.duration}
        setDuration={(newDuration) => {
          const newActivity = { ...activity, duration: newDuration };
          onActivityChange(index, newActivity);
        }}
      />
      <DeleteButton>
        {canDelete && (
          <Button
            plain
            icon={<Trash />}
            onClick={() => {
              onDelete(index);
            }}
          />
        )}
      </DeleteButton>
    </ActivityContainer>
  );
};

export default memo(Activity);