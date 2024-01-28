import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import SelectDropChapter from "@/components/select-drop-chapter";
import SelectDropBtn from "@/components/select-drop";
import { cn } from "@/shared/lib/utils";

interface Props {
  text?: string | string[];
  clsn?: string;
  ctgr?: "genres" | "status" | "lang" | "sort" | "chapter";
  click?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => void;
  data?: any;
}
const DropDownN = ({ text, clsn, ctgr, click, data }: Props) => {
  const [position, setPosition] = React.useState("bottom");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {ctgr == "chapter" ? (
          <div className="nav_icon text-white">{text}</div>
        ) : (
          <Button
            className="ml-3 rounded-lg bg-button px-10 py-4 text-primary hover:text-primary-foreground md:my-[1px] md:ml-0"
            variant="outline"
          >
            <span>{text}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn(clsn)}>
        {ctgr == "chapter" && (
          <SelectDropChapter data={data}></SelectDropChapter>
        )}
        {ctgr == "genres" && (
          <SelectDropBtn click={click!} type="genres"></SelectDropBtn>
        )}
        {ctgr == "status" && (
          <SelectDropBtn click={click!} type="status"></SelectDropBtn>
        )}
        {ctgr == "lang" && (
          <SelectDropBtn click={click!} type="lang"></SelectDropBtn>
        )}
        {ctgr == "sort" && (
          <SelectDropBtn type="sort" click={click!}></SelectDropBtn>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownN;
