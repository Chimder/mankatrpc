import React from "react";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { Badge } from "./ui/badge";

type Props = {
  status: string;
  year: number | string;
};

const DotPublication = ({ status, year }: Props) => {
  let iconColor: string;
  let badgeBg: string;

  if (status === "Ongoing" || status === "ongoing") {
    iconColor = "text-green-600";
    badgeBg = "bg-green-600 hover:bg-green-800";
  } else if (status === "Finished" || status === "released") {
    iconColor = "text-red-600";
    badgeBg = "bg-red-600 hover:bg-red-800";
  } else {
    iconColor = "text-purple-600";
    badgeBg = "bg-purple-600 hover:bg-purple-800";
  }

  return (
    <div className="relative flex items-center justify-center">
      <DotFilledIcon
        className={`ml-3 h-6 w-6 fill-current lg:hidden ${iconColor}`}
      />
      <span className="text-[12px] lg:hidden">PUBLICATION: {year}</span>
      <Badge
        className={`ml-3 text-white lg:px-[3px] lg:py-[1px] md:mt-2 ${badgeBg}`}
      >
        {status}
      </Badge>
    </div>
  );
};

export default DotPublication;
