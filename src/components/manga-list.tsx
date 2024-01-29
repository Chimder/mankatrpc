import { useAppSelector } from "@/shared/Store/store";
import React, { useEffect } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";
import { trpc } from "@/shared/utils/trpc";


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

  const {
    data: mangas,
    refetch,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = trpc.manga.getMangaByGenres.useInfiniteQuery(
    {
      genres: genresTag,
      name: inputValue,
      status: statusTag,
      country: langTag,
      orderField: sortName,
      orderSort: sortValue,
      perPage: 30,
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.items.length === 0) {
          return undefined;
        }
        return lastPage?.nextCursor;
      },
      refetchOnWindowFocus: false,
    }
  );

  console.log("INFIN", mangas?.pages);
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
        {/* {isFetching && !isFetchingNextPage */}
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
          : mangas?.pages?.flat().map((page) =>
              page.items.map((manga) => (
                <Link
                  className="relative z-50"
                  key={manga.name}
                  href={`/manka/${manga.name}`}
                >
                  <img
                    ref={ref}
                    src={manga.img}
                    alt=""
                    className="h-full w-full rounded"
                  />
                  <div
                    className="absolute bottom-1 z-50 flex w-full px-3 py-0 font-medium text-white sm:hidden "
                    style={{ WebkitTextStroke: "0.2px black" }}
                  >
                    <img src="/img/lang/JP.svg" width={20} height={20} alt="" />
                    <div>{manga.name}</div>
                  </div>
                </Link>
              ))
            )}
      </div>
    </div>
  );
};
