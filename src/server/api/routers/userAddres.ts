import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

const defaultAddres = Prisma.validator<Prisma.UserAddresSelect>()({
  id: true,
  street: true,
  city: true,
  country: true,
  buldingNumber: true,
  flatNumber: true,
  postCode: true,
});

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
        select: defaultAddres,
        where: {
          id: input.id,
        },
      });
    }),
  createAddress: protectedProcedure
    .input(
      z.object({
        street: z.string(),
        city: z.string(),
        country: z.string(),
        buldingNumber: z.string(),
        flatNumber: z.string(),
        postCode: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.userAddres.create({
        data: {
          street: input.street,
          city: input.city,
          country: input.country,
          buldingNumber: input.buldingNumber,
          flatNumber: input.flatNumber,
          postCode: input.postCode,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
