import React from "react";

type Props = {};

const AnimeRating = ({ anime }: any) => {
  return (
    <div className="flex  items-center justify-center">
      <div className="flex-row items-center justify-center pr-4 drop-shadow-2xl">
        <img src="/shikimori.svg" width={30} height={30} alt="" />
        <span className="pl-1 text-white">{anime?.shikimori_rating}</span>
      </div>
      <div className="flex-row items-center justify-center pr-4 drop-shadow-2xl">
        <img src="/IMDB.svg" width={30} height={30} alt="" />
        <span className="pl-1 text-white">{anime?.imdb_rating}</span>
      </div>
    </div>
  );
};

export default AnimeRating;
