import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

const defaultProduct = Prisma.validator<Prisma.ProductsSelect>()({
  id: true,
  name: true,
  description: true,
  price: true,
  productTypeId: true,
  image: true,
});

const defaultOrderItem = Prisma.validator<Prisma.OrderItemSelect>()({
  id: true,
  quantity: true,
  price: true,
  product: true,
  order: true,
});

export const orderItemRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.orderItem.findMany({
        select: defaultOrderItem,
        where: {
          orderId: input.id,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.orderItem.findUnique({
        select: defaultOrderItem,
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
        orderId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const prodData = await ctx.prisma.products.findUnique({
        select: {
          price: true,
        },
        where: {
          id: input.productId,
        },
      });

      return ctx.prisma.orderItem.create({
        data: {
          product: {
            connect: {
              id: input.productId,
            },
          },
          quantity: input.quantity,
          order: {
            connect: {
              id: input.orderId,
            },
          },
          price: z.number().parse(prodData?.price),
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        quantity: z.number(),
        id: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.orderItem.update({
        data: {
          quantity: input.quantity,
        },
        where: {
          id: input.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.orderItem.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
