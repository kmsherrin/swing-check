import { getSession } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { restaurant, users } from "@/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export async function getData() {
  const currentSession = await getSession();

  if (!currentSession) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("You must be logged in to view this page");
  }

  const { user } = currentSession;

  // use drizzle to get the user data
  const userData = await db
    .select()
    .from(users)
    .leftJoin(restaurant, eq(users.id, restaurant.ownerId))
    .where(eq(users.id, user.id));

  console.log(userData);

  if (userData) {
    const result = userData.reduce((acc, row) => {
      const user = row.user;
      const restaurant = row.restaurant;
      if (!acc.user) {
        acc = { user, restaurants: [] };
      }
      if (restaurant) {
        acc.restaurants.push(restaurant);
      }
      return acc;
    }, {});

    return result;
  }

  return userData[0];
}
