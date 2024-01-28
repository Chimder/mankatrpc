import { z } from "zod";
import { procedure, router } from "../trpc";
import { db } from "@/shared/utils/db";
import { getUserFavorite } from "./user";

export const mangaRouter = router({
  getAllManga: procedure.query(() => {
    console.log("ONEMOREFETCH");
    return db.anime.findMany({ include: { chapters: true } });
  }),
  getMangaByName: procedure
    .input(
      z.object({
        name: z.string().optional(),
      })
    )
    .query((opts) => {
      console.log("FETCHMANKA");
      return db.anime.findFirst({
        where: { name: { contains: opts.input.name, mode: "insensitive" } },
        include: { chapters: true },
      });
    }),
  getMangaChapter: procedure
    .input(
      z.object({
        name: z.string(),
        chapter: z.number(),
      })
    )
    .query((opts) => {
      return db.chapter.findFirst({
        where: {
          animeName: opts.input.name,
          chapter: opts.input.chapter,
        },
      });
    }),
  getMangaPopular: procedure.query((opts) => {
    return db.anime.findMany({
      take: 10,
      orderBy: { popularity: { sort: "desc" } },
    });
  }),

  getMangaByGenres: procedure
    .input(
      z.object({
        genres: z.array(z.string()).optional(),
        name: z.string().optional(),
        status: z.string().optional(),
        country: z.string().optional(),
        orderField: z.string().optional(),
        orderSort: z.enum(["asc", "desc"]).optional(),
        page: z.number(),
        perPage: z.number(),
      })
    )
    .query((opts) => {
      const {
        genres,
        name,
        status,
        country,
        orderField,
        orderSort,
        page,
        perPage,
      } = opts.input;
      const skip = (page - 1) * perPage;

      let orderBy: { [key: string]: "asc" | "desc" | undefined } = {};
      if (orderField && orderSort) {
        orderBy[orderField] = orderSort;
      }

      return db.anime.findMany({
        where: {
          name: { contains: name, mode: "insensitive" },
          genres: { hasEvery: genres },
          status: { contains: status },
          country: { contains: country },
        },
        orderBy: orderBy,
        skip: skip,
        take: perPage,
      });
    }),

  addMangaRating: procedure
    .input(
      z.object({
        name: z.string(),
        rating: z.number(),
      })
    )
    .query(async (opts) => {
      const { name, rating } = opts.input;
      const anime = await db.anime.findFirst({
        where: {
          name: name,
        },
      });
      if (!anime?.averageRating) {
        await db.anime.update({
          where: {
            name: name,
          },
          data: {
            averageRating: rating,
            ratingCount: 1,
          },
        });
      } else {
        const totalRating = anime.averageRating * anime.ratingCount! + rating;
        const newRatingCount = anime.ratingCount! + 1;
        const newAverageRating = totalRating / newRatingCount;

        await db.anime.update({
          where: {
            name: name,
          },
          data: {
            averageRating: newAverageRating,
            ratingCount: newRatingCount,
          },
        });
      }
    }),

  getUserFavoriteManga: procedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(async (opts) => {
      const { email } = opts.input;
      const user = await getUserFavorite(email);

      if (!user?.favorite || user?.favorite.length === 0) {
        return [];
      }
      return db.anime.findMany({
        where: { name: { in: user?.favorite } },
      });
    }),

  addRating: procedure
    .input(
      z.object({
        rating: z.number(),
        name: z.string(),
      })
    )
    .query(async (opts) => {
      const { name, rating } = opts.input;
      const anime = await db.anime.findFirst({
        where: {
          name: name,
        },
      });
      if (!anime?.averageRating) {
        await db.anime.update({
          where: {
            name: name,
          },
          data: {
            averageRating: rating,
            ratingCount: 1,
          },
        });
      } else {
        const totalRating = anime.averageRating * anime.ratingCount! + rating;
        const newRatingCount = anime.ratingCount! + 1;
        const newAverageRating = totalRating / newRatingCount;

        await db.anime.update({
          where: {
            name: name,
          },
          data: {
            averageRating: newAverageRating,
            ratingCount: newRatingCount,
          },
        });
      }
    }),
});