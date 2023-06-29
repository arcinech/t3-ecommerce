import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const orderItemRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.orderItem.findMany({
        where: {
          orderId: input.id,
        },
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.orderItem.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number(),
        order: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.orderItem.create({
        data: {
          product: ctx.prisma.products.findUnique({
            where: {
              id: input.productId,
            },
          }),
          quantity: input.quantity,
          price: ctx.prisma.products.findUnique({
            where: {
              id: input.productId,
            },
          })?.price,
          order: input.order,
        },
      });
    }),
});
