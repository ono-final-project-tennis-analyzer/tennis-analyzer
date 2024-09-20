import { Autocomplete } from "@mantine/core";
import React from "react";
import clsx from "clsx";
import { IconSearch } from "@tabler/icons-react";
import Styles from "./SearchInput.styles.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  suggestions?: string[];
  placeholder?: string;
  rightSection?: React.ReactNode;
}

const SearchInput: React.FC<Props> = ({
  value,
  onChange,
  suggestions,
  className,
  label,
  placeholder = "Search...",
  rightSection,
}) => {
  return (
    <Autocomplete
      label={label}
      className={clsx(Styles.search, className)}
      value={value}
      data={suggestions}
      onChange={onChange}
      leftSection={<IconSearch className={Styles.icon} />}
      placeholder={placeholder}
      rightSection={rightSection}
    />
  );
};

export default SearchInput;
