import React from "react";
import { genres, status, lang, sort, Lang } from "../shared/data/anotherdata";
import { useAppSelector } from "../shared/Store/store";
import { Button } from "@/components/ui/button";

type Data = {
  text: string;
  img?: string;
  gap?: string;
  value?: string;
  color?: string;
  size?: string;
};
interface SelectDropBtnProps {
  type: string;
  click: (e: React.MouseEvent<HTMLButtonElement>, category: string) => void;
}
function SelectDropBtn({ type, click }: SelectDropBtnProps) {
  const data: Data[] =
    type == "genres"
      ? genres
      : type == "status"
        ? status
        : type == "lang"
          ? lang
          : sort;

  const { genresTag, langTag, statusTag, sortTag } = useAppSelector(
    (store) => store.tagSlice,
  );

  const allTags = [...genresTag, langTag, statusTag, sortTag];
  return (
    <div
      className={`flex w-full flex-col  items-center ${
        type === "genres" ? "md:grid md:grid-cols-2" : ""
      }`}
    >
      {data.map((g) => (
        <Button
          variant="ghost"
          key={g.text}
          onClick={(e) => click(e, type)}
          className={`select_btn_${type} ${
            allTags.includes(g.text)
              ? "text-green-500 hover:text-green-500"
              : "text-orange-500 hover:text-orange-500"
          }`}
        >
          {type == "lang" && (
            <img className="mr-2" src={g.img} width={22} height={22} />
          )}
          {g.text}
        </Button>
      ))}
    </div>
  );
}
export default SelectDropBtn;
