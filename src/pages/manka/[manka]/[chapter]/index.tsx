import React, { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import AsideBarChapter from "@/components/aside-bar-chapter";
import { trpc } from "@/shared/utils/trpc";
import { db } from "@/shared/utils/db";
import { appRouter } from "@/shared/server/routers/_app";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

export const getStaticPaths = async () => {
  const data = await db.anime.findMany({ include: { chapters: true } });
  const paths = data.flatMap((anime) => {
    return anime?.chapters?.map((chapterNumber) => ({
      params: { manka: anime.name, chapter: chapterNumber.chapter.toString() },
    }));
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {},
    transformer: SuperJSON,
  });
  const data = await helpers.manga.getMangaChapter.prefetch({
    name: params?.manka as string,
    chapter: Number(params?.chapter),
  });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      // manka,
    },
    revalidate: 10,
  };
};

const Chapter = (props: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { data: chapter } = trpc.manga.getMangaChapter.useQuery(
    {
      name: "",
      chapter: 0,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex flex-col ">
          {chapter?.img?.map((chap, i) => (
            <div key={i}>
              <img src={chap} alt="chap" />
            </div>
          ))}
        </div>
        <AsideBarChapter name={chapter?.animeName} />
      </div>
    </>
  );
};

Chapter.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Chapter;
