import { Box, FormField, FormFieldProps, MaskedInput, Select, TextInput } from "grommet";
import React, { useEffect, useState } from "react";
import { Duration, DurationUnit } from "../../types";
import { secondsToTime, timeToSeconds } from "../../util";

interface OwnProps {
  duration: Duration;
  setDuration: (value: React.SetStateAction<Duration>) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DurationFormField = ({ duration, setDuration, ref, name, label, ...rest }: Props) => {
  const [durationString, setDurationString] = useState("");
  useEffect(() => {
    console.log(duration);
    if (duration.unit === DurationUnit.HH_MM_SS) {
      if (!duration.hours && !duration.minutes && !duration.seconds) {
        setDurationString("");
      }
    }
    if (duration.unit === DurationUnit.SECONDS && !duration.value) {
      setDurationString("");
    } else {
    }
  }, [duration]);
  return (
    <Box gap="small" direction="row" align="start">
      <Box fill>
        <FormField name="duration" label="Duration" required {...rest}>
          {duration?.unit === DurationUnit.SECONDS ? (
            <TextInput
              name="duration"
              plain
              type="number"
              value={duration.value ? duration.value : ""}
              onChange={e => {
                setDuration({ ...duration, value: parseFloat(e.target.value) });
              }}
            />
          ) : (
            <MaskedInput
              plain
              name="duration"
              mask={[
                {
                  length: [1, 2],
                  regexp: /^[0-9]{1,2}$/,
                  placeholder: "hh"
                },
                { fixed: ":" },
                {
                  length: [1, 2],
                  regexp: /^[0-5][0-9]$|^[0-9]$/,
                  placeholder: "mm"
                },
                { fixed: ":" },
                {
                  length: [1, 2],
                  regexp: /^[0-5][0-9]$|^[0-9]$/,
                  placeholder: "ss"
                }
              ]}
              value={durationString}
              onChange={e => {
                const split = e.target.value.split(":");
                if (split.length >= 1) {
                  setDuration({ ...duration, hours: parseInt(split[0]) });
                }
                if (split.length >= 2) {
                  setDuration({ ...duration, minutes: parseInt(split[1]) });
                }
                if (split.length >= 3) {
                  setDuration({ ...duration, seconds: parseInt(split[2]) });
                }
                setDurationString(e.target.value);
              }}
            />
          )}
        </FormField>
      </Box>
      <Box justify="end">
        <FormField label="Time unit" name="timeunit" {...rest}>
          <Select
            name="timeunit"
            value={duration?.unit}
            onChange={({ option }) => {
              if (option === DurationUnit.HH_MM_SS && duration.unit === DurationUnit.SECONDS) {
                // setDurationString(durationToString(duration));
                setDuration(secondsToTime(duration));
              }
              if (option === DurationUnit.SECONDS && duration.unit === DurationUnit.HH_MM_SS) {
                setDuration(timeToSeconds(duration));
              }
            }}
            options={[...Object.values(DurationUnit)]}
          />
        </FormField>
      </Box>
    </Box>
  );
};

export default DurationFormField;
