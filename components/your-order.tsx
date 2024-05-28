"use client";
import { Loader2Icon, ShoppingBag, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { removeFromOrder } from "@/actions/cart_remove";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { toast } from "./ui/use-toast";

const fetchCart = async (restaurant_id: string) => {
  const response = await fetch(
    "/api/cart/fetch?restaurant_id=" + restaurant_id
  );
  const data = await response.json();

  return data;
};

const SpinningTrash = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={"ghost"} className="p-2">
      {pending ? (
        <Loader2Icon className="animate-spin w-4" />
      ) : (
        <Trash className="w-4" />
      )}
    </Button>
  );
};

export const YourOrder = ({ restaurant_id }: { restaurant_id: string }) => {
  const {
    status,
    isLoading,
    isRefetching,
    isError,
    data: cart_items,
    error,
    refetch,
  } = useQuery({
    queryKey: [`cart-${restaurant_id}`],
    queryFn: () => fetchCart(restaurant_id),
  });

  const [message, formAction] = useFormState(removeFromOrder, null);

  useEffect(() => {
    if (message?.success) {
      toast({
        title: "✅ Success",
        description: message.success,
        variant: "default",
      });
    }
    refetch();
  }, [message]);

  console.log(cart_items);

  return (
    <div>
      <div className="sticky top-20 p-4 border rounded-md flex flex-col gap-4">
        <h1 className=" text-2xl font-semibold tracking-tight flex gap-2 text-nowrap items-center">
          {isLoading || isRefetching ? (
            <>
              <Loader2Icon className="animate-spin" />{" "}
            </>
          ) : (
            <>
              <ShoppingBag />
            </>
          )}
          Your Order{" "}
        </h1>
        <div className="flex flex-col gap-2">
          {cart_items &&
            Object.keys(cart_items).length > 0 &&
            Object.keys(cart_items).map((key, index) => {
              const product = cart_items[key];
              console.log(product);

              return (
                <div
                  key={index}
                  className="grid grid-cols-[1.4fr_0.5fr_0.3fr] justify-between gap-2 items-center text-left"
                >
                  <p>
                    {product.product_quantity}x {product.name}
                  </p>
                  <p>${product.basePrice * product.product_quantity}</p>
                  <form action={formAction}>
                    <input
                      type="hidden"
                      name="cart_id"
                      value={product.cart_id}
                    />
                    <input
                      type="hidden"
                      name="product_id"
                      value={product.product_id}
                    />
                    <input
                      type="hidden"
                      name="product_name"
                      value={product.name}
                    />
                    <input
                      type="hidden"
                      name="restaurant_id"
                      value={product.restaurant_id}
                    />
                    <input type="hidden" name="index" value={index} />
                    <SpinningTrash />
                  </form>
                </div>
              );
            })}
          <Button type="button" variant="default" className="mt-4">
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};
