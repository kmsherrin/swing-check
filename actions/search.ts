"use server";

import { db } from "@/lib/drizzle";
import { product, productCategory, restaurant } from "@/schema";
import { eq, and, desc, asc, or, ilike } from "drizzle-orm";

import { redirect } from "next/navigation";

export const homepageSearch = async (formData) => {
  // Strip out any special characters

  console.log(formData.get("location"));

  const cleanedLocation = formData
    .get("location")
    .replace(/[^a-zA-Z0-9]/g, "")
    .trim()
    .toLowerCase();

  return redirect(`/search/${cleanedLocation}`);
};

export const searchRestaurantsByLocation = async (location: string) => {
  const result = await db
    .select()
    .from(restaurant)
    .where(
      or(
        ilike(restaurant.city, location),
        ilike(restaurant.state, location),
        ilike(restaurant.postalCode, location),
        ilike(restaurant.country, location)
      )
    );

  return result;
};
