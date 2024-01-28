import React from "react";
import { useAppDispatch, useAppSelector } from "@/shared/Store/store";
import {
  resetTag,
  setGenresTag,
  setInputValue,
  setLangTag,
  setSort,
  setStatus,
} from "@/shared/Store/Slices/tagSlice";
import { MangaList } from "@/components/manga-list";
import { Input } from "@/components/ui/input";
import { BadgeList } from "@/components/badge-list";
import { DropDownMenuN } from "@/components/drop-down-menu";
import { Button } from "@/components/ui/button";

function mangaSearch() {
  const { inputValue } = useAppSelector((store) => store.tagSlice);
  const dispatch = useAppDispatch();
  const handleTag = (tag: string, category: string) => {
    if (category === "genres") {
      dispatch(setGenresTag(tag));
    } else if (category === "lang") {
      dispatch(setLangTag(tag));
    } else if (category === "status") {
      dispatch(setStatus(tag));
    } else if (category === "sort") {
      dispatch(setSort(tag));
    }
  };
  const on = (e: React.MouseEvent<HTMLButtonElement>, category: string) => {
    const button = e.target as HTMLButtonElement;
    handleTag(button.innerText, category);
  };

  const reset = () => {
    dispatch(resetTag());
  };

  return (
    <main className="containerM h-full w-full overflow-x-hidden">
      <section className="w-full md:block md:px-10 sm:px-4">
        <h1 className="pb-2 text-2xl">Advaced Manga Search</h1>

        <div className="flex w-full items-center justify-between pb-4 md:block md:pb-0">
          <div className="w-full">
            <Input
              className="focus:border-1 w-full bg-button focus:border-primary"
              value={inputValue}
              onChange={(e) => dispatch(setInputValue(e.target.value))}
            />
          </div>
          <div className="flex md:flex md:flex-col">
            <DropDownMenuN on={on} />
          </div>
        </div>

        <div className="flex w-full justify-between md:mt-[2px]">
          <div className="md:hidden">
            <BadgeList handleTag={handleTag} />
          </div>
          <div className="md:w-full">
            <Button
              onClick={() => reset()}
              className="rounded-lg bg-red-800/80  px-12 py-4 text-red-400 hover:bg-red-800/40 md:w-full "
            >
              Reset
            </Button>
          </div>
        </div>
      </section>

      <MangaList />
    </main>
  );
}

export default mangaSearch;
