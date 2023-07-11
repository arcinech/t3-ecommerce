import { exampleRouter } from "~/server/api/routers/example";
import { orderRouter } from "~/server/api/routers/order";
import { createTRPCRouter } from "~/server/api/trpc";
import { productsRouter } from "~/server/api/routers/products";
import { orderItemRouter } from "~/server/api/routers/orderItem";
import { userAddresRouter } from "~/server/api/routers/userAddres";
import { productTypeRouter } from "~/server/api/routers/productType";
import { attributeRouter } from "~/server/api/routers/attribute";
import { cartItemRouter } from "~/server/api/routers/cartItem";
import { cartRouter } from "~/server/api/routers/cart";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  order: orderRouter,
  products: productsRouter,
  orderItem: orderItemRouter,
  userAddres: userAddresRouter,
  productType: productTypeRouter,
  attribute: attributeRouter,
  cartItem: cartItemRouter,
  cart: cartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
