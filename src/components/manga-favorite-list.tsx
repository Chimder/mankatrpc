import { Skeleton } from "@/components/ui/skeleton";
import { mangaControllerGetUserManga } from "@/shared/Api/generated";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const FavoriteList = () => {
  const path = useRouter();
  const { data: session } = useSession();

  const { data: mangas, isFetching } = useQuery({
    queryKey: ["user-favorite"],
    queryFn: () =>
      mangaControllerGetUserManga({ email: session?.user?.email as string }),
    staleTime: 0,
  });

  return (
    <div className="">
      <div className="grid w-full grid-cols-6 gap-5 xl:grid-cols-5 xl:gap-4 lg:grid-cols-4 lg:gap-3 lg:px-6 md:grid-cols-3 md:gap-4 md:px-12 sm:gap-4 sm:p-0 sm:px-4">
        {isFetching
          ? Array.from({ length: 18 }, (_, index) => (
              <React.Fragment key={`skeleton-${index}`}>
                <div
                  className="relative h-full w-full overflow-hidden rounded-sm"
                  style={{ paddingBottom: "142%" }}
                >
                  <div className="absolute inset-0">
                    <Skeleton className="h-full w-full" />
                  </div>
                </div>
              </React.Fragment>
            ))
          : mangas?.map((manga) => (
              <Link
                className="relative z-50 flex h-full w-full"
                key={manga?.name}
                href={`/manka/${manga?.name}`}
              >
                <img
                  src={manga?.img}
                  alt=""
                  className="block h-full  max-w-full rounded"
                />
                <div
                  className="absolute bottom-1 z-50 flex w-full px-3 py-0 font-medium text-white sm:hidden "
                  style={{ WebkitTextStroke: "0.2px black" }}
                >
                  <img src="/img/lang/JP.svg" width={20} height={20} alt="" />
                  <div className="">{manga?.name}</div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default FavoriteList;
