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
  omnibus: true,
  attributeValues: {
    select: {
      attributeValue: {
        select: {
          value: true,
          attribute: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },
});

export const productsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.products.findMany({
      select: defaultProduct,
    });
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.products.findUnique({
        select: defaultProduct,
        where: {
          id: input.id,
        },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        description: z.string(),
        productType: z.string().optional(),
        image: z.string().optional(),
        attributes: z.array(
          z.object({
            name: z.string(),
            value: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.prisma.products.create({
        select: defaultProduct,
        data: {
          name: input.name,
          price: input.price,
          description: input.description,
          productType: {
            connect: {
              id: input.productType,
            },
          },
          image: input.image,
          omnibus: {
            create: {
              price: input.price,
            },
          },
        },
      });

      if (input.attributes && input.attributes.length === 0) return product;

      for (const item of input.attributes) {
        const attId = await ctx.prisma.attribute.findFirst({
          select: {
            id: true,
          },
          where: {
            name: item.name,
          },
        });

        if (!attId) throw new Error("Attribute not found");

        const value = await ctx.prisma.attributeValue.create({
          data: {
            attribute: {
              connect: {
                id: attId.id,
              },
            },
            value: item.value,
          },
        });

        await ctx.prisma.productAttributeValues.create({
          data: {
            attributeValue: {
              connect: {
                id: value.id,
              },
            },
            product: {
              connect: {
                id: product.id,
              },
            },
          },
        });
      }

      return await ctx.prisma.products.findUnique({
        select: defaultProduct,
        where: {
          id: product.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        price: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const product = await ctx.prisma.products.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!product) throw new Error("Product not found");
      const date = z.date().parse(product?.updatedAt);

      const timelimit = new Date().getTime() - 1000 * 60 * 60 * 24 * 30;

      if (!date && Date.parse(date) < timelimit) {
        await ctx.prisma.omnibus.create({
          data: {
            price: z.number().parse(product?.price),
            product: {
              connect: {
                id: input.id,
              },
            },
          },
        });
      }
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
});
