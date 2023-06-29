import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const productsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.products.findMany();
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.products.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        description: z.string(),
        productType: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.products.create({
        name: input.name,
        price: input.price,
        description: input.description,
        productType: input.productType,
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string(), price: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.products.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          price: input.price,
        },
      });
    }),
  delete: protectedProcedure

    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.product.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
