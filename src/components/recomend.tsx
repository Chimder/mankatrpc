import React, { useEffect } from "react";
import Link from "next/link";
import { RecomendAnim } from "@/shared/data/PopRecod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

const Recomend = () => {
  const name = useParams();
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["isAnime"],
    queryFn: () =>
      axios.get("/api/proxyAnimeSearch", { params: { name: name?.manka } }),
    // staleTime: 0,
  });

  const anime = data?.data?.results[0];
  useEffect(() => {
    refetch();
  }, [name?.manka]);

  if (isFetching) {
    return <div></div>;
  }
  return (
    <div className=" z-100 -my-2  mt-0.5 flex-col md:my-2 md:flex-grow md:items-center md:justify-center ">
      <span className="text-xl font-semibold lg:text-sm">
        {anime ? "This manga has Anime" : "Recommended Manga"}
      </span>
      <div className="md:flex">
        {anime ? (
          <Link
            key={anime.id}
            href={`/anime/${anime.id}`}
            className="float-left ml-[0.5px] mt-2 w-full rounded-2xl bg-transparent no-underline  md:flex md:items-center md:justify-center "
          >
            <div className="relative mx-2 flex ">
              <div className="z-0 m-0 w-16 shrink-0 overflow-hidden rounded-sm ">
                <div className="relative box-border">
                  <img
                    className="left-0  top-0 h-full w-full"
                    src={anime.material_data.poster_url}
                    alt="If you cant see the image, turn on VPN"
                  />
                </div>
              </div>
              <div className="flex items-center  px-3 text-sm lg:text-[12px] md:hidden">
                <span>{anime.title_orig}</span>
              </div>
            </div>
          </Link>
        ) : (
          RecomendAnim.map((manga) => (
            <Link
              key={manga.name}
              href={`/manka/${manga.name}`}
              className="float-left ml-[0.5px] mt-2  w-full  rounded-2xl bg-transparent no-underline "
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
          ))
        )}
      </div>
    </div>
  );
};

export default Recomend;
