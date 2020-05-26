import { Box, Button, Keyboard, TextInput } from "grommet";
import { Search as SearchIcon } from "grommet-icons";
import React, { createRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import calculators from "../resources/calculators";
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Search = ({ open, setOpen }: Props) => {
  const history = useHistory();
  const [value] = useState("");
  const [suggestions] = useState(
    calculators
      .filter((c) => c.active)
      .map((calculator) => ({
        label: (
          <Box align="start" pad="small">
            {calculator.title}
          </Box>
        ),
        value: calculator.id,
      }))
  );
  const inputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (inputRef.current && open) {
      inputRef.current.focus();
    }
  }, [inputRef, open]);

  const onChange = (event: any) => {};

  const onEnter = () => {};

  const onSelect = (event: any) => {
    history.push(`/calculators/${event.suggestion.value}`);
  };

  if (open) {
    return (
      <Keyboard
        onEsc={() => {
          setOpen(false);
        }}
        onEnter={onEnter}
      >
        <TextInput
          //@ts-ignore
          ref={inputRef}
          dropAlign={{ top: "bottom", right: "right" }}
          name="search-components"
          dropHeight="medium"
          placeholder="search..."
          value={value}
          suggestions={suggestions}
          onChange={onChange}
          onSelect={onSelect}
          onSuggestionsOpen={() => {
            setOpen(true);
          }}
          onSuggestionsClose={() => {
            setOpen(false);
          }}
        />
      </Keyboard>
    );
  }

  return (
    <Button
      plain
      onClick={() => {
        setOpen(true);
      }}
    >
      {({ hover }: { hover: boolean }) => (
        <Box round="xlarge" pad="small" background={hover ? "active" : undefined}>
          <SearchIcon />
        </Box>
      )}
    </Button>
  );
};

export default Search;
