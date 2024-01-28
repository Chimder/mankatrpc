import React from "react";
import DropDownN from "./drop-down";

interface DropMenuProps {
  on: (e: React.MouseEvent<HTMLButtonElement>, category: string) => void;
}
export const DropDownMenuN = ({ on }: DropMenuProps) => {
  return (
    <>
      <DropDownN
        text="Genres"
        click={on}
        ctgr="genres"
        clsn="min-w-[18vw] md:min-w-[68vw] w-36 bg-accent mb-30"
      ></DropDownN>
      <DropDownN
        text="Status"
        click={on}
        ctgr="status"
        clsn="min-w-[20vh] w-36 bg-accent"
      ></DropDownN>
      <DropDownN
        text="Lang"
        click={on}
        ctgr="lang"
        clsn="min-w-[20vh] w-36 bg-accent"
      ></DropDownN>
      <DropDownN
        text="Sort By"
        click={on}
        ctgr="sort"
        clsn="min-w-[20vh] w-36 bg-accent"
      ></DropDownN>
    </>
  );
};
