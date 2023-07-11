import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

const defaultCart = Prisma.validator<Prisma.CartSelect>()({
  id: true,
  userId: true,
  cartItems: true,
});

export const cartRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const cartId = await ctx.prisma.cart.findUnique({
      select: defaultCart,
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (!cartId) {
      return null;
    }

    return cartId;
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.cartItem.delete({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const cartId = await ctx.prisma.cart.findUnique({
      select: {
        id: true,
        userId: true,
      },
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (!cartId) {
      return await ctx.prisma.cart.create({
        data: {
          userId: ctx.session.user.id,
        },
      });
    }

    return cartId;
  }),
});
