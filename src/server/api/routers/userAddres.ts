import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userAddresRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.userAddress.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.userAddres.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        country: z.string(),
        city: z.string(),
        street: z.string(),
        buldingNumber: z.string(),
        flatNumber: z.string(),
        postalCode: z.string(),
      })
    )
    .mutate(({ input, ctx }) => {
      return ctx.prisma.userAddres.create({
        data: {
          country: input.country,
          city: input.city,
          street: input.street,
          buldingNumber: input.buldingNumber,
          flatNumber: input.flatNumber,
          postalCode: input.postalCode,
          userId: ctx.session.user.id,
        },
      });
    }),
});
