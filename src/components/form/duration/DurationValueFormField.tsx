import { Box, FormField, FormFieldProps, MaskedInput, TextInput } from "grommet";
import React, { useEffect, useRef, useState } from "react";
import { Duration, DurationUnit } from "../../../types";
import { durationToString } from "../../../util";

interface OwnProps {
  duration: Duration;
  valueLabel?: string;
  setDuration: (value: Duration) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DurationValueFormField = ({ duration, setDuration, ref, valueLabel = "Duration", ...rest }: Props) => {
  const [durationString, setDurationString] = useState("");
  const [value, setValue] = useState<number>();
  const prevUnitRef = useRef<DurationUnit>();

  useEffect(() => {
    prevUnitRef.current = duration.unit;
  }, [duration.unit]);
  const prevUnit = prevUnitRef.current;
  useEffect(() => {
    if (duration.unit) {
      setDurationString(durationToString(duration));
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (duration.unit === DurationUnit.HH_MM_SS) {
      if (duration.hours === undefined && duration.minutes === undefined && duration.seconds === undefined) {
        setDurationString("");
      } else if (prevUnit === DurationUnit.SECONDS) {
        setDurationString(durationToString(duration));
      }
    } else if (duration.unit === DurationUnit.SECONDS) {
      setValue(duration.value);
    }
  }, [duration, prevUnit]);

  return (
    <Box fill>
      <FormField label={valueLabel} required {...rest}>
        {duration?.unit === DurationUnit.SECONDS ? (
          <TextInput
            plain
            type="number"
            value={value}
            onChange={(e) => {
              setValue(parseFloat(e.target.value));
            }}
            onBlur={() => setDuration({ ...duration, value })}
          />
        ) : duration?.unit === DurationUnit.HH_MM_SS ? (
          <MaskedInput
            plain
            mask={[
              {
                length: [1, 2],
                regexp: /^[0-9]{1,2}$/,
                placeholder: "hh",
              },
              { fixed: ":" },
              {
                length: [1, 2],
                regexp: /^[0-5][0-9]$|^[0-9]$/,
                placeholder: "mm",
              },
              { fixed: ":" },
              {
                length: [1, 2],
                regexp: /^[0-5][0-9]$|^[0-9]$/,
                placeholder: "ss",
              },
            ]}
            value={durationString}
            onChange={(e) => {
              setDurationString(e.target.value);
            }}
            onBlur={() => {
              const split = durationString.split(":");
              const seconds = parseInt(split[2]);
              const minutes = parseInt(split[1]);
              const hours = parseInt(split[0]);
              const newDuration = { ...duration, hours, minutes, seconds };
              setDuration(newDuration);
              setDurationString(durationToString(newDuration));
            }}
          />
        ) : (
          <TextInput disabled value={"Select a unit"} />
        )}
      </FormField>
    </Box>
  );
};

export default DurationValueFormField;
