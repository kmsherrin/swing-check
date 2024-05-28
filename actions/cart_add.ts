"use server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { product, productCategory, restaurant, cart } from "@/schema";
import { eq, and, desc, asc, or, ilike } from "drizzle-orm";

export const addToOrder = async (prevState, formData) => {
  const userSession = await getSession();

  // Is guest?
  const guestStatus = userSession?.user.guest;

  const inputQuantity = formData.get("quantity")
    ? parseFloat(formData.get("quantity"))
    : 1;

  // Check if existing cart for user/guest id
  let activeCart;
  if (guestStatus) {
    activeCart = await db
      .select()
      .from(cart)
      .where(
        and(
          eq(cart.guestUserId, userSession?.user?.id),
          eq(cart.status, "active"),
          eq(cart.restaurantId, formData.get("restaurant_id"))
        )
      )
      .execute();
  } else {
    activeCart = await db
      .select()
      .from(cart)
      .where(
        and(
          eq(cart.userId, userSession?.user?.id!),
          eq(cart.status, "active"),
          eq(cart.restaurantId, formData.get("restaurant_id"))
        )
      )
      .limit(1)
      .execute();
  }

  if (activeCart.length === 0) {
    // Create new cart
    const newCart = await db
      .insert(cart)
      .values({
        userId: guestStatus ? null : userSession?.user.id,
        guestUserId: guestStatus ? userSession?.user.id : null,
        restaurantId: formData.get("restaurant_id"),
        status: "active",
        products: [
          {
            id: formData.get("product_id"),
            quantity: inputQuantity,
            options: [],
          },
        ],
        createdAt: new Date(),
        modifiedAt: new Date(),
      })
      .execute();
  } else {
    // Update products
    const products = activeCart[0].products;

    const productIndex = products.findIndex(
      (product) => product.id === formData.get("product_id")
    );

    if (productIndex !== -1) {
      products[productIndex].quantity += inputQuantity;
    } else {
      products.push({
        id: formData.get("product_id"),
        quantity: inputQuantity,
        options: [],
      });
    }

    const updatedCart = await db
      .update(cart)
      .set({
        products: products,
        modifiedAt: new Date(),
      })
      .where(eq(cart.id, activeCart[0].id))
      .execute();
  }

  return {
    success: `Added ${formData.get("product_name")} to your order`,
  };
};
