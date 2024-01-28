import React, { ReactElement, useEffect } from "react";
import {
  mangaControllerGetAllManga,
  mangaControllerGetMangaChapter,
} from "@/shared/Api/generated";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import AsideBarChapter from "@/components/aside-bar-chapter";

export type ChapterDto = {
  animeName: string;
  chapter: number;
  img: string[];
  name: string;
  createdAt: string;
};
type Props = {
  data: ChapterDto;
};
export const getStaticPaths = async () => {
  const data = await mangaControllerGetAllManga();
  const paths = data?.flatMap((anime) => {
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
  const data = await mangaControllerGetMangaChapter({
    name: params?.manka as string,
    chapter: params?.chapter as string,
  });
  return { props: { data } };
};

const Chapter = ({ data: chapter }: Props) => {
  const router = useRouter();
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
        <AsideBarChapter name={chapter.animeName} />
      </div>
    </>
  );
};

Chapter.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Chapter;
