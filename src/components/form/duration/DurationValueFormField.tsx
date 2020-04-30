import { FormField, FormFieldProps, MaskedInput, TextInput } from "grommet";
import React, { useEffect, useRef, useState } from "react";
import { Duration, DurationUnit } from "../../../types";
import { durationToString, secondsToTime, timeToSeconds } from "../../../util";

interface OwnProps {
  duration: Duration;
  valueLabel?: string;
  setDuration: (value: Duration) => void;
}

type Props = OwnProps & FormFieldProps & Omit<JSX.IntrinsicElements["input"], "placeholder">;

const DurationValueFormField = ({ duration, setDuration, ref, valueLabel = "Duration", ...rest }: Props) => {
  const [durationString, setDurationString] = useState(durationToString(duration));
  const [value, setValue] = useState<string>("");
  const prevUnitRef = useRef<DurationUnit>();

  useEffect(() => {
    prevUnitRef.current = duration.unit;
  }, [duration.unit]);
  const prevUnit = prevUnitRef.current;

  useEffect(() => {
    if (prevUnit === DurationUnit.HH_MM_SS && duration.unit === DurationUnit.SECONDS) {
      const newDuration = timeToSeconds({ ...duration, unit: prevUnit });
      setDuration(newDuration);
      setValue(newDuration.value?.toString() || "");
    }
    if (prevUnit === DurationUnit.SECONDS && duration.unit === DurationUnit.HH_MM_SS) {
      const newDuration = secondsToTime({ ...duration, unit: prevUnit });
      setDuration(newDuration);
      setDurationString(durationToString(newDuration));
    }
  }, [duration, prevUnit, setDuration]);

  return (
    <FormField label={valueLabel} required {...rest}>
      {duration?.unit === DurationUnit.SECONDS ? (
        <TextInput
          plain
          type="number"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onBlur={() => {
            const v = parseFloat(value || "");
            if (!isNaN(v)) {
              const newDuration = { ...duration, value: v };
              setDuration(newDuration);
              setDurationString(durationToString(newDuration));
              setValue(v.toString());
            } else {
              setDuration({ ...duration, value: undefined });
              setValue(v.toString());
            }
          }}
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
            if (split.length > 0) {
              const seconds = parseInt(split[2]);
              const minutes = parseInt(split[1]);
              const hours = parseInt(split[0]);
              const newDuration = { ...duration, hours, minutes, seconds };
              setDuration(newDuration);
              setDurationString(durationToString(newDuration));
            }
          }}
        />
      ) : (
        <TextInput disabled value={"Select a unit"} />
      )}
    </FormField>
  );
};

export default DurationValueFormField;
