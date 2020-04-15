import React, { createRef, useEffect, useState } from "react";
import { Keyboard, TextInput, Button, Box } from "grommet";
import { Search as SearchIcon } from "grommet-icons";
import { useHistory } from "react-router-dom";
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Search = ({ open, setOpen }: Props) => {
  const history = useHistory();
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState(["Calculate FTP/CP and RWC (W') from a CP test"]);
  const inputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (inputRef.current && open) {
      inputRef.current.focus();
    }
  }, [inputRef, open]);

  const onChange = (event: any) => {};

  const onEnter = () => {};

  const onSelect = (event: any) => {
    history.push("ftp");
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
