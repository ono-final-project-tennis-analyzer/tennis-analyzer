import SearchInput from "../../../SearchInput";
import React from "react";
import Styles from "./TableTop.styles.module.css";

interface Props {
  searchable?: boolean;
  rightSection?: React.ReactNode;
  searchValue: string;
  setSearchValue: (value: string) => void;
  suggestions: string[];
  resultCount: number;
}

const TableTop: React.FC<Props> = ({
  setSearchValue,
  searchValue,
  suggestions,
  searchable,
  rightSection,
  resultCount,
}) => (
  <div className={Styles.top}>
    <div className={Styles.search}>
      {searchable ? (
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          suggestions={suggestions}
          rightSection={<small>{`(${resultCount})`}</small>}
        />
      ) : null}
    </div>
    <div>{rightSection}</div>
  </div>
);

export default TableTop;
