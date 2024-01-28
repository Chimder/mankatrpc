import {
  MangaDto,
  mangaControllerGetMangaRating,
} from "@/shared/Api/generated";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { StarFilledIcon } from "@radix-ui/react-icons";

const RatingStars = ({ ...manga }: MangaDto) => {
  const [rating, setRating] = useState<number>(manga.averageRating);
  const [hover, setHover] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ["rating"],
    mutationFn: (newRating: number) =>
      mangaControllerGetMangaRating({ name: manga?.name, rating: newRating }),
    onSuccess: () => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      const ratedAnimes = JSON.parse(
        localStorage.getItem("ratedAnimes") || "[]",
      );
      ratedAnimes.push(manga.name);
      localStorage.setItem("ratedAnimes", JSON.stringify(ratedAnimes));
    },
  });

  const hasRatedAnime = (animeName: string): boolean => {
    const ratedAnimes = JSON.parse(localStorage.getItem("ratedAnimes") || "[]");
    return ratedAnimes.includes(animeName);
  };

  const handleRatingClick = (newRating: number) => {
    if (hasRatedAnime(manga.name)) {
      console.log("Вы уже оценили это аниме!");
      return;
    }
    mutate(newRating);
  };

  return (
    <div className="flex flex-col items-center justify-center pl-8 lg:flex-row lg:pr-8 md:px-0 ">
      <h1 className="lg:hidden">Rating Manga</h1>
      <div className="md:">
        {[...Array(5)].map((_, index) => {
          const currentRating = index + 1;
          return (
            <label key={index} className="mr-2">
              <input
                type="radio"
                name="rating"
                value={currentRating}
                onChange={() => handleRatingClick(currentRating)}
                className="hidden"
              />
              <span
                className={`cursor-pointer text-2xl md:text-lg ${
                  currentRating <= (hover || rating)
                    ? "text-primary"
                    : "text-gray-400"
                }`}
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(null)}
              >
                ☆
              </span>
            </label>
          );
        })}
      </div>
      <span className="lg:text-xs md:hidden">
        by {manga.ratingCount} reviews
      </span>
      {showNotification && (
        <Alert className="fixed bottom-4 right-0 z-[1000] mr-4 w-[380px] border-primary md:fixed md:-right-4 md:-top-[16vh]  md:m-0 md:h-[7vh] md:w-[100vw] ">
          <StarFilledIcon className="z-999 -m-1 h-4 w-6 text-primary md:h-3 md:w-5" />
          <AlertTitle className="text-primary">Rating up!</AlertTitle>
          <AlertDescription>
            Thank you for appreciating the manga
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default RatingStars;
