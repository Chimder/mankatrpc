import React, { useEffect } from "react";
import Link from "next/link";
import { RecomendAnim } from "@/shared/data/PopRecod";
import { useQuery } from "@tanstack/react-query";
import { mangaControllerGetMangaByName } from "@/shared/Api/generated";
import { useRouter } from "next/router";

const AnimeRecomend = ({ name }: any) => {
  const param = useRouter();

  console.log("param", name);
  const {
    data: manga,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["isAnime"],
    queryFn: () => mangaControllerGetMangaByName({ name: name as string }),
    staleTime: 0,
  });

  useEffect(() => {
    refetch();
  }, [param.query]);

  if (isFetching) {
    return <div></div>;
  }
  return (
    <div className=" z-100 -my-2  mt-0.5 flex-col md:my-2 md:flex md:items-center md:justify-center ">
      <span className="text-xl font-semibold lg:text-sm">
        {manga ? "This Anime has Manga" : "Recommended Anime"}
      </span>
      <div className="md:flex">
        {manga ? (
          <Link
            key={manga.name}
            href={`/manka/${manga.name}`}
            className="float-left ml-[0.5px] mt-2 w-full rounded-2xl bg-transparent no-underline  md:flex md:items-center md:justify-center"
          >
            <div className="relative mx-2 flex ">
              <div className="z-0 m-0 w-16 shrink-0 overflow-hidden rounded-sm ">
                <div className="relative box-border">
                  <img
                    className="left-0  top-0 h-full w-full"
                    src={manga.img}
                    alt="#"
                  />
                </div>
              </div>
              <div className="flex items-center  px-3 text-sm lg:text-[12px] md:hidden">
                <span>{manga.name}</span>
              </div>
            </div>
          </Link>
        ) : (
          RecomendAnim.map((manga) => (
            <>
              <Link
                key={manga.name}
                href={`/manka/${manga.name}`}
                className="float-left ml-[0.5px] mt-2 w-full  rounded-2xl bg-transparent no-underline "
              >
                <div className="relative mx-2 flex ">
                  <div className="z-0 m-0 w-16 shrink-0 overflow-hidden rounded-sm ">
                    <div className="relative box-border">
                      <img
                        className="left-0  top-0 h-full w-full"
                        src={manga.img}
                        alt={manga.name}
                      />
                    </div>
                  </div>
                  <div className="flex items-center  px-3 text-sm lg:text-[12px] md:hidden">
                    <span>{manga.name}</span>
                  </div>
                </div>
              </Link>
            </>
          ))
        )}
      </div>
    </div>
  );
};

export default AnimeRecomend;
