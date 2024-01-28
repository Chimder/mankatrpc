import FavoriteList from "@/components/manga-favorite-list";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

const Favorite = () => {
  const path = useRouter();
  const { data: session } = useSession();

  return (
    <section className="containerM overflow-x-hidden">
      <h1 className="py-4 text-3xl">Favorite Manga</h1>
      <FavoriteList></FavoriteList>
    </section>
  );
};

export default Favorite;
