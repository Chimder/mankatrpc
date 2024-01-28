import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Recomend from "@/components/recomend";
import { signIn, useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";
import DotPublication from "@/components/dot-publication";
import RatingStars from "@/components/rating-stars";
import { formatCreatedAt } from "@/shared/lib/data-format";
import useWindowSize from "@/shared/lib/isMobile";
import { ReloadIcon } from "@radix-ui/react-icons";
import { db } from "@/shared/utils/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/shared/server/routers/_app";
import SuperJSON from "superjson";
import { trpc } from "@/shared/utils/trpc";

export const getStaticPaths = async () => {
  const data = await db.anime.findMany({ select: { name: true } });
  const paths = data.map((manga) => ({ params: { manka: manga.name } }));
  return {
    paths,
    fallback: false,
  };
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {},
    transformer: SuperJSON, // optional - adds superjson serialization
  });
  const manka = params?.manka as string;
  await helpers.manga.getMangaByName.prefetch({
    name: manka,
  });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      manka,
    },
    revalidate: 10,
  };
};

const Manga = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { manka } = props;
  const router = useRouter();
  const { data: session } = useSession();

  const { data: manga } = trpc.manga.getMangaByName.useQuery(
    {
      name: manka,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
  console.log("MAINMANKA", manga);

  const {
    data: favorite,
    refetch: refetchFavorite,
    isPending,
  } = trpc.manga.getUserFavoriteManga.useQuery(
    {
      email: session?.user?.email as string,
    },
    {
      enabled: !!session,
      staleTime: 0,
    }
  );
  // console.log("favorite", favorite);

  const { mutate } = trpc.user.toggleUserFavoriteManga.useMutation({
    onSuccess: () => {
      refetchFavorite();
    },
  });

  const addFavorite = (name: string | undefined) => {
    if (!session?.user?.email) {
      signIn();
    } else {
      mutate({ email: session?.user?.email as string, name: name! });
    }
  };

  const isMobile = useWindowSize();
  return (
    <main className="overflow-x-hidden ">
      {/* <section className="relative z-40 flex max-h-[480px] items-center overflow-y-hidden  lg:absolute  lg:-z-10 "> */}
      <section className="max-h-[480px] lg:-z-10">
        {/* <div className="w-full lg:fixed  lg:top-0 lg:-z-40 lg:h-[48vh] md:w-[100vw] "> */}
        <div className="absolute left-0 top-[-80px] z-[-2] h-[640px] w-full">
          <img
            className="z-0 h-full w-full "
            src={isMobile ? manga?.img : manga?.imgHeader}
            alt=""
          />
          <div className="absolute inset-x-0 bottom-0 h-full bg-black/30 lg:z-40 lg:backdrop-blur-[1px] md:bg-gradient-light dark:md:bg-gradient-dark"></div>
        </div>
      </section>
      <section className="z-100 flex h-full w-full pt-[36vh] lg:pt-[30vh] md:pt-40 ">
        <div className="containerM flex w-full bg-background md:bg-transparent md:p-4">
          <div className="z-90 -mt-28 w-1/5 lg:mt-0 lg:backdrop-blur-md md:backdrop-blur-none">
            <img
              className="md: z-999 w-full self-end rounded-lg lg:rounded-none"
              src={manga?.img}
              alt=""
            />
          </div>
          <div className="z-100 w-4/5 lg:backdrop-blur-md md:backdrop-blur-none">
            <div className="flex items-center justify-between pt-2 ">
              <h1 className="relative flex px-5 py-0 text-3xl  drop-shadow-2xl lg:text-2xl md:px-2 md:text-lg md:text-white">
                {manga?.name}
              </h1>
              {/* <RatingStars {...manga}></RatingStars> */}
            </div>
            <div className="relative my-2.5 ml-5 flex w-full flex-wrap items-center lg:ml-2 md:ml-1">
              <Button
                onClick={() => addFavorite(manga?.name)}
                className={cn(
                  favorite
                    ? "bg-primary hover:bg-primary-foreground"
                    : "bg-teal-600 hover:bg-teal-600/60",
                  "z-10 text-white md:py-0 sm:mr-3 sm:w-full"
                )}
              >
                {favorite ? "Favorite" : "Add To Favorite"}
                {isPending && (
                  <ReloadIcon className="ml-1 h-4 w-4 animate-spin" />
                )}
              </Button>
              {manga?.genres.map((genres, i) => (
                <Badge
                  className="lg:-py-0 z-10 ml-3 cursor-default bg-badge text-white hover:bg-badge/70 lg:rounded-md lg:px-1 md:mt-2 sm:mt-1"
                  key={i}
                >
                  {genres}
                </Badge>
              ))}
              {/* <DotPublication year={manga?.published} status={manga?.status} /> */}
            </div>
            <div className="mx-5 text-lg xl:text-[16px] lg:text-sm md:hidden">
              {manga?.describe}
            </div>
          </div>
        </div>
      </section>
      <section className="containerM z-100 mx-auto h-full w-full bg-background md:bg-transparent pt-2.5">
        <div className="flex md:flex-col ">
          <aside className="w-1/5 flex-col md:flex md:w-full md:items-center md:pt-4">
            <Recomend />
          </aside>
          <div className="w-4/5 px-5 md:w-full md:px-0">
            <span className="lg:text-md text-xl font-semibold md:px-4">
              Chapters
            </span>
            <div className="pt-3 md:px-4 md:pb-14">
              {manga?.chapters?.map((chap) => (
                <Link
                  className="my-2 flex items-center justify-between rounded-sm bg-accent p-4 md:my-1 md:py-3"
                  key={chap.name}
                  href={`/manka/${manga?.name}/${chap.chapter}`}
                >
                  <div className="lg:text-sm">
                    Ch. {chap.chapter} - {chap.name}
                  </div>
                  <div className="lg:text-sm">
                    {formatCreatedAt(Number(chap.createdAt))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Manga;
