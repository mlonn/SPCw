import { Box, FormField, FormFieldProps, MaskedInput, TextInput } from "grommet";
import React, { useEffect, useState, useRef } from "react";
import { Duration, DurationUnit } from "../../../types";
import { durationToString, timeToSeconds } from "../../../util";

interface OwnProps {
  duration: Duration;
  valueLabel?: string;
  setDuration: (value: Duration) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DurationValueFormField = ({
  duration,
  setDuration,
  ref,
  name = "duration",
  valueLabel = "Duration",
  ...rest
}: Props) => {
  const [durationString, setDurationString] = useState("");
  const prevUnitRef = useRef<DurationUnit>();

  useEffect(() => {
    prevUnitRef.current = duration.unit;
  }, [duration.unit]);
  const prevUnit = prevUnitRef.current;
  useEffect(() => {
    setDurationString(durationToString(duration));
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (duration.unit === DurationUnit.HH_MM_SS) {
      if (duration.hours === undefined && duration.minutes === undefined && duration.seconds === undefined) {
        setDurationString("");
      } else if (prevUnit === DurationUnit.SECONDS) {
        setDurationString(durationToString(duration));
      }
    }
  }, [duration, prevUnit]);
  return (
    <Box fill>
      <FormField
        name={name}
        label={valueLabel}
        required
        {...rest}
        validate={[
          (value: any) => {
            const seconds = timeToSeconds(duration).value;
            if (seconds! < 120 || seconds! > 1800) return "Please enter duration between 2min and 30min";
            return undefined;
          }
        ]}
      >
        {duration?.unit === DurationUnit.SECONDS ? (
          <TextInput
            name={name}
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
            name={name}
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
  );
};

export default DurationValueFormField;
