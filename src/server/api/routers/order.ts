import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

const defaultOrder = Prisma.validator<Prisma.OrderSelect>()({
  id: true,
  userId: true,
  orderItems: true,
  orderStatus: true,
});

export const orderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.order.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.order.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      userId: z.string(),
      orderItems: z.array(z.object({
        productId: z.string(),
        quantity: z.number(),
        price: z.number(),
      })),
    }))
    .mutation(({input , ctx}) => {
      return ctx.prisma.order.create({
        select: defaultOrder,
        data: {
          userId: input.userId,
          orderItems: {
            create: input.orderItems,
          },
        },
      });
    })

    update: protectedProcedure
    .input(z.object({
      id: z.string(),
      orderStatus: z.string(),
    }))
    .mutation(({input , ctx}) => {
      return ctx.prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          orderStatus: input.orderStatus,
        },
      });
    }),

});
