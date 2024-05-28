"use server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { product, productCategory, restaurant, cart } from "@/schema";
import { eq, and, desc, asc, or, ilike } from "drizzle-orm";

export const removeFromOrder = async (prevState, formData) => {
  const userSession = await getSession();

  // Is guest?
  const guestStatus = userSession?.user.guest;

  const cartId = formData.get("cart_id");
  const productId = formData.get("product_id");
  const cartIndex = formData.get("index");

  console.log(cartIndex);

  let activeCart = await db
    .select()
    .from(cart)
    .where(eq(cart.id, cartId))
    .execute();
  console.log(activeCart);
  const existingProducts = activeCart[0].products;

  // Check the product ID matches the product ID in the cart
  if (existingProducts[cartIndex].id !== productId) {
    return {
      error: "Product ID mismatch",
    };
  }

  console.log(existingProducts);

  const filteredProducts = existingProducts.filter(
    (product) => product.id !== productId
  );

  console.log(filteredProducts);

  const updatedCart = await db
    .update(cart)
    .set({
      products: filteredProducts,
      modifiedAt: new Date(),
    })
    .where(eq(cart.id, cartId))
    .execute();

  console.log(updatedCart);

  return {
    success: `Removed ${formData.get("product_name")} from your order`,
  };
};
