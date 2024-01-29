import { db } from '@/shared/utils/db'
import { z } from 'zod'

import { procedure, router } from '../trpc'
import { getUserFavorite } from './user'

export const mangaRouter = router({
  getAllManga: procedure.query(() => {
    return db.anime.findMany({ include: { chapters: true } })
  }),
  getMangaByName: procedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .query(opts => {
      return db.anime.findFirst({
        where: { name: { contains: opts.input.name, mode: 'insensitive' } },
        include: { chapters: true },
      })
    }),
  getMangaChapter: procedure
    .input(
      z.object({
        name: z.string(),
        chapter: z.number(),
      }),
    )
    .query(opts => {
      return db.chapter.findFirst({
        where: {
          animeName: opts.input.name,
          chapter: opts.input.chapter,
        },
      })
    }),
  getMangaPopular: procedure.query(opts => {
    return db.anime.findMany({
      take: 10,
      orderBy: { popularity: { sort: 'desc' } },
    })
  }),

  getMangaByGenres: procedure
    .input(
      z.object({
        genres: z.array(z.string()).optional(),
        name: z.string().optional(),
        status: z.string().optional(),
        country: z.string().optional(),
        orderField: z.string().optional(),
        orderSort: z.enum(['asc', 'desc']).optional(),
        cursor: z.number().optional(),
        perPage: z.number(),
      }),
    )
    .query(async opts => {
      const { genres, name, status, country, orderField, orderSort, cursor, perPage } = opts.input
      const skip = cursor ? cursor * perPage : 0


      let orderBy: { [key: string]: 'asc' | 'desc' | undefined } = {}
      if (orderField && orderSort) {
        orderBy[orderField] = orderSort
      }
      const items = await db.anime.findMany({
        where: {
          name: { contains: name, mode: 'insensitive' },
          genres: { hasEvery: genres },
          status: { contains: status },
          country: { contains: country },
        },
        orderBy: orderBy,
        skip: skip,
        take: perPage + 1, // получить дополнительный элемент в конце, который мы будем использовать как следующий курсор
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > perPage) {
        const nextItem = items.pop()
        nextCursor = cursor ? cursor + 1 : 1 // увеличиваем cursor на 1 с каждым новым запросом
      }

      return {
        items,
        nextCursor,
      }
    }),

  addMangaRating: procedure
    .input(
      z.object({
        name: z.string(),
        rating: z.number(),
      }),
    )
    .mutation(async opts => {
      const { name, rating } = opts.input
      const anime = await db.anime.findFirst({
        where: {
          name: name,
        },
      })
      if (!anime?.averageRating) {
        await db.anime.update({
          where: {
            name: name,
          },
          data: {
            averageRating: rating,
            ratingCount: 1,
          },
        })
      } else {
        const totalRating = anime.averageRating * anime.ratingCount! + rating
        const newRatingCount = anime.ratingCount! + 1
        const newAverageRating = totalRating / newRatingCount

        await db.anime.update({
          where: {
            name: name,
          },
          data: {
            averageRating: newAverageRating,
            ratingCount: newRatingCount,
          },
        })
      }
    }),

  getUserFavorite: procedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
      }),
    )
    .query(async opts => {
      const user = await db.user.findFirst({
        where: { email: opts.input.email },
        select: { favorite: true },
      })
      if (!user?.favorite || user?.favorite.length === 0) {
        return null
      }
      const favoriteList = await db.anime.findMany({
        where: { name: { in: user?.favorite } },
        select: { name: true },
      })

      const favoriteNames = favoriteList.map(anime => anime.name)

      return favoriteNames.includes(opts.input.name)
    }),

  getUserFavoriteManga: procedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async opts => {
      const { email } = opts.input
      const user = await db.user.findFirst({
        where: { email: email },
        select: { favorite: true },
      })

      if (!user?.favorite || user?.favorite.length === 0) {
        return []
      }
      return db.anime.findMany({
        where: { name: { in: user?.favorite } },
      })
    }),

  addRating: procedure
    .input(
      z.object({
        rating: z.number(),
        name: z.string(),
      }),
    )
    .query(async opts => {
      const { name, rating } = opts.input
      const anime = await db.anime.findFirst({
        where: {
          name: name,
        },
      })
      if (!anime?.averageRating) {
        await db.anime.update({
          where: {
            name: name,
          },
          data: {
            averageRating: rating,
            ratingCount: 1,
          },
        })
      } else {
        const totalRating = anime.averageRating * anime.ratingCount! + rating
        const newRatingCount = anime.ratingCount! + 1
        const newAverageRating = totalRating / newRatingCount

        await db.anime.update({
          where: {
            name: name,
          },
          data: {
            averageRating: newAverageRating,
            ratingCount: newRatingCount,
          },
        })
      }
    }),
})
