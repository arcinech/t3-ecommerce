import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";
const defaultOrder = Prisma.validator<Prisma.OrderSelect>()({
  id: true,
  userId: true,
  orderItems: true,
  status: true,
});

export const orderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.order.findMany({
      select: defaultOrder,
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.order.findUnique({
        select: {
          id: true,
          userId: true,
          orderItems: true,
          status: true,
        },
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        orderItems: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      /*
       * prepare order items
       */
      const items = [];
      for (const item of input.orderItems) {
        const product = await ctx.prisma.products.findUnique({
          select: {
            price: true,
          },
          where: {
            id: item.productId,
          },
        });

        if (!product) throw new Error("No item found");

        items.push({
          quantity: item.quantity,
          productId: item.productId,
          price: product.price,
        });
      }

      return await ctx.prisma.order.create({
        data: {
          userId: ctx.session.user.id,
          orderItems: {
            create: items,
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        orderStatus: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.orderStatus,
        },
      });
    }),
});
