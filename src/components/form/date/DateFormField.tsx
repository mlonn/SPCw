import { Box, BoxProps, Button, Calendar, DropButton, FormField, Layer, Text, TextInput } from "grommet";
import { Close, FormDown, StatusWarning } from "grommet-icons";
import React, { useState } from "react";
import { IActivity } from "../../../types";

interface OwnProps {
  activity: IActivity;
  index: number;
  onActivityChange: (index: number, activity: IActivity) => void;
}
type Props = OwnProps & BoxProps;
const DateFormField = (props: Props) => {
  const { activity, onActivityChange, index, ...rest } = props;
  const [showError, setShowError] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [dateString, setDateString] = useState("");
  const onSelect = (selectedDate: any) => {
    setOpen(false);
    setDateString(new Date(selectedDate).toLocaleDateString());
    const newActivity = { ...activity, date: selectedDate };
    onActivityChange(index, newActivity);
  };
  return (
    <Box gap="small" direction="row" align="start" fill {...rest}>
      <Box fill>
        <FormField label={"Date"}>
          <Box direction="row" align="start">
            <TextInput
              value={dateString}
              plain
              onChange={(e) => setDateString(e.target.value)}
              onBlur={() => {
                if (dateString.length > 0) {
                  const newDate = new Date(dateString);
                  if (newDate instanceof Date && !isNaN(newDate.valueOf())) {
                    const newActivity = { ...activity, date: newDate.toISOString() };
                    onActivityChange(index, newActivity);
                    setDateString(new Date(dateString).toLocaleDateString());
                  } else {
                    setShowError(true);
                  }
                }
              }}
            />
            <Box margin={{ horizontal: "small" }}>
              <DropButton
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                dropContent={
                  <Calendar date={activity.date ? activity.date : new Date().toISOString()} onSelect={onSelect} />
                }
              >
                <Box direction="row" justify="center" align="start">
                  <FormDown color="brand" />
                </Box>
              </DropButton>
            </Box>
          </Box>
        </FormField>
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
              <Text>Error: Invalid date</Text>
            </Box>
            <Button icon={<Close />} onClick={() => setShowError(false)} />
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default DateFormField;
