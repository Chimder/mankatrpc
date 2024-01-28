import { z } from "zod";
import { procedure, router } from "../trpc";
import { mangaRouter } from "./manga";
import { userRouter } from "./user";

export const appRouter = router({
  manga: mangaRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
