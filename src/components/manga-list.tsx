import { mangaControllerGetMangaByGenres } from "@/shared/Api/generated";
import { useAppSelector } from "@/shared/Store/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";

type pageParam = {
  pageParam: number;
};

export const MangaList = () => {
  const {
    genresTag,
    langTag,
    sortName,
    sortValue,
    statusTag,
    sortTag,
    inputValue,
  } = useAppSelector((store) => store.tagSlice);

  const fetchAnimePages = async ({ pageParam }: pageParam) => {
    const response = await mangaControllerGetMangaByGenres({
      name: inputValue,
      genres: genresTag,
      status: statusTag,
      country: langTag,
      orderField: sortName,
      orderDirection: sortValue,
      page: pageParam,
      perPage: 30,
    });

    return response;
  };
  const {
    data: mangas,
    refetch,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["mangas"],
    queryFn: fetchAnimePages,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [genresTag, langTag, statusTag, sortTag, inputValue, refetch]);

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="containerM px-0 pt-8">
      <div className="grid w-full grid-cols-6 gap-5 xl:grid-cols-5 xl:gap-4 lg:grid-cols-4 lg:gap-3 md:grid-cols-3 md:gap-2 md:px-10 sm:px-1">
        {isFetching && !isFetchingNextPage
          ? Array.from({ length: 20 }, (_, index) => (
              <React.Fragment key={`skeleton-${index}`}>
                <div
                  className="relative w-full overflow-hidden rounded-sm"
                  style={{ paddingBottom: "142%" }}
                >
                  <div className="absolute inset-0">
                    <Skeleton className="h-full w-full" />
                  </div>
                </div>
              </React.Fragment>
            ))
          : mangas?.pages?.flat().map((manga) => (
              <Link
                className="relative z-50"
                key={manga?.name}
                href={`/manka/${manga?.name}`}
              >
                <img
                  ref={ref}
                  src={manga?.img}
                  alt=""
                  className="h-full w-full rounded"
                />
                <div
                  className="absolute bottom-1 z-50 flex w-full px-3 py-0 font-medium text-white sm:hidden "
                  style={{ WebkitTextStroke: "0.2px black" }}
                >
                  <img src="/img/lang/JP.svg" width={20} height={20} alt="" />
                  <div>{manga?.name}</div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};
