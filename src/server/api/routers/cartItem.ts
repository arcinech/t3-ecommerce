import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

const defaultCartItem = Prisma.validator<Prisma.CartItemSelect>()({
  id: true,
  cartId: true,
  productId: true,
  quantity: true,
});

export const cartItemRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
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
      return [];
    }

    return await ctx.prisma.cartItem.findMany({
      where: {
        cartId: cartId.id,
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.cartItem.findUnique({
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
      })
    )
    .mutation(async ({ input, ctx }) => {
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
            cartItems: {
              create: {
                productId: input.productId,
                quantity: input.quantity,
              },
            },
          },
        });
      }

      const cartItem = await ctx.prisma.cartItem.findFirst({
        select: defaultCartItem,
        where: {
          cartId: cartId.id,
          productId: input.productId,
        },
      });

      if (cartItem) {
        return await ctx.prisma.cartItem.update({
          where: {
            id: cartItem.id,
          },
          data: {
            quantity: input.quantity,
          },
        });
      }

      return await ctx.prisma.cartItem.create({
        data: {
          cartId: cartId.id,
          productId: input.productId,
          quantity: input.quantity,
        },
      });
    }),

  update: protectedProcedure

    .input(
      z.object({
        id: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const cartItem = await ctx.prisma.cartItem.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      return await ctx.prisma.cartItem.update({
        where: {
          id: input.id,
        },
        data: {
          quantity: input.quantity,
        },
      });
    }),
});
