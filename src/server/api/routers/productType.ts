import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

const defaultProductType = Prisma.validator<Prisma.ProductTypeSelect>()({
  id: true,
  name: true,
  description: true,
  products: true,
});

export const productTypeRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.productType.findMany({
      select: defaultProductType,
    });
  }),
  getOneById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.productType.findUnique({
        select: defaultProductType,
        where: {
          id: input.id,
        },
      });
    }),

  getOneByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.productType.findFirst({
        select: defaultProductType,
        where: {
          name: input.name,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.productType.create({
        select: defaultProductType,
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
});
