import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

const defaultAttribute = Prisma.validator<Prisma.AttributeSelect>()({
  id: true,
  name: true,
  description: true,
});

export const attributeRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.attribute.findMany({
      select: defaultAttribute,
    });
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.attribute.findUnique({
        select: defaultAttribute,
        where: {
          id: input.id,
        },
      });
    }),

  getOneByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.attribute.findFirst({
        select: defaultAttribute,
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
      return ctx.prisma.attribute.create({
        select: defaultAttribute,
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
});
