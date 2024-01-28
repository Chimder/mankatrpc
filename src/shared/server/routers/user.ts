import { z } from "zod";
import { procedure, router } from "../trpc";
import { db } from "@/shared/utils/db";

const isUser = (email: string) => {
  return db.user.findUnique({
    where: {
      email: email,
    },
  });
};
export const getUserFavorite = (email: string) => {
  return db.user.findFirst({
    where: { email: email },
    select: { favorite: true },
  });
};
export const userRouter = router({
  checkOrCreateUser: procedure
    .input(
      z.object({
        id: z.string(),
        email: z
          .string()
          .min(1, { message: "This field has to be filled." })
          .email("This is not a valid email."),
        name: z.string(),
        image: z.string().url({ message: "Invalid IMG Url" }),
      })
    )
    .mutation(async (opts) => {
      console.log("REGINP", opts.input);
      const user = await isUser(opts.input.email);
      if (!user) {
        console.log("No User REggggg");
        return db.user.create({ data: opts.input });
      } else {
        return console.log("already created");
      }
    }),

  toggleUserFavoriteManga: procedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { name, email } = opts.input;
      const user = await getUserFavorite(email);
      if (!user) {
        throw new Error("User not found");
      }

      const isAnimeInFavorites = await user.favorite.includes(name);
      console.log("ISANIMEFAV", isAnimeInFavorites);

      if (!isAnimeInFavorites) {
        const addpopular = await db.anime.update({
          where: { name: name },
          data: {
            popularity: +1 as number,
          },
        });
        return db.user.update({
          where: { email: email },
          data: {
            favorite: {
              push: name,
            },
          },
        });
      } else {
        return db.user.update({
          where: { email: email },
          data: {
            favorite: {
              set: user.favorite.filter((anime) => anime !== name),
            },
          },
        });
      }
    }),

  deleteUserAccount: procedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async (opts) => {
      const user = await isUser(opts.input.email);
      if (!user) {
        return console.log("User not found");
      }
      return db.user.delete({
        where: {
          email: opts.input.email,
        },
      });
    }),
});
