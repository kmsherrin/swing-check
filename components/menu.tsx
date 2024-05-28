"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "./ui/button";
import {
  CircleArrowDown,
  CircleArrowUp,
  Eye,
  Trash,
  SquareChevronDown,
  MoreHorizontal,
  ChevronDown,
  PencilRuler,
  ScanSearch,
  Loader2,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import Link from "next/link";

import Image from "next/image";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { Badge } from "./ui/badge";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "./ui/use-toast";
import { SubmitButton } from "./custom_ui/submit-button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { updateMenuOrder } from "@/app/(account)/account/restaurant/[restaurant_id]/menu/actions";
import { Input } from "./ui/input";
import { addToOrder } from "@/actions/cart_add";

import { useQuery, useQueryClient } from "@tanstack/react-query";

function array_move(arr: [], old_index: number, new_index: number) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
}

export type ProductType = {
  product_category: {
    id: string;
    name: string;
    restaurantId: string;
    deletedAt: any;
    menuOrder: number;
  };
  product: {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    image: string;
    basePrice: string;
    restaurantId: string;
    options: {
      "0"?: {
        name: string;
        type: string;
        values: {
          "0": {
            price: string;
            value: string;
          };
          "1": {
            price: string;
            value: string;
          };
          "2"?: {
            price: string;
            value: string;
          };
        };
      };
      "1"?: {
        name: string;
        type: string;
        values: {
          "0": {
            price: string;
            value: string;
          };
          "1": {
            price: string;
            value: string;
          };
        };
      };
    };
    category: string;
    status: string;
    createdAt: string;
    modifiedAt: string;
    deletedAt: any;
  };
};

export type MenuType = Array<{
  category: {
    id: string;
    name: string;
    restaurantId: string;
    deletedAt: any;
    menuOrder: number;
  };
  products: Array<ProductType>;
}>;

const SpinningAddToOrder = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={"default"}>
      {pending ? (
        <div className="flex gap-2 items-center">
          <Loader2 className="animate-spin w-5" /> Adding...{" "}
        </div>
      ) : (
        <>Add to Order</>
      )}
    </Button>
  );
};

export const Menu = ({
  restaurant_id,
  formattedCategoryData,
}: {
  restaurant_id: string;
  formattedCategoryData: MenuType;
}) => {
  const [animationParent] = useAutoAnimate();
  const queryClient = useQueryClient();

  const selectedProductOptionsForm = useRef<undefined | HTMLFormElement>(
    undefined
  );

  const [productOptions, setProductOptions] = useState({});

  const [selectedProduct, setSelectedProduct] = useState<null | ProductType>(
    null
  );

  const [selectProductOptions, setSelectedProductOptions] = useState([]);

  const [selectedProductExtraPrice, setSelectedProductExtraPrice] = useState(0);

  const [selectedProductQuantity, setSelectedProductQuantity] = useState(1);

  const [message, formAction] = useFormState(addToOrder, null);

  useEffect(() => {
    if (message?.success) {
      toast({
        title: "✅ Success",
        description: message.success,
        variant: "default",
      });
    }

    queryClient.invalidateQueries({ queryKey: [`cart-${restaurant_id}`] });
  }, [message]);

  const computeTotal = () => {
    if (!selectedProductOptionsForm) return;
    const formData = new FormData(selectedProductOptionsForm.current);
    // Get all options based form options
    let extraCost = 0;
    for (const [key, value] of formData.entries()) {
      if (key.includes("option")) {
        const cost = value.split("-")[1];

        if (cost) {
          extraCost += parseFloat(cost);
        }
      }
    }

    console.log(extraCost);
    setSelectedProductExtraPrice(extraCost);
  };

  useEffect(() => {
    setSelectedProductExtraPrice(0);
    setSelectedProductQuantity(1);
  }, [selectedProduct]);

  return (
    <>
      <div className="flex gap-2 flex-col py-2">
        <h3 className="font-semibold ">Find</h3>
        <div className="flex gap-2">
          {formattedCategoryData.map((data, index) => (
            <a href={`#${data.category.name}`}>
              <Badge key={index} className="border-0">
                {data.category.name}
              </Badge>
            </a>
          ))}
        </div>
      </div>
      {formattedCategoryData.map((data, index) => (
        <div className="py-2 grid gap-2 pb-6">
          <Dialog>
            <h2
              className="text-3xl tracking-tight font-semibold"
              id={data.category.name}
            >
              {data.category.name}
            </h2>

            {data.products.map((product) => (
              <DialogTrigger asChild>
                <Card
                  className="cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardContent>
                    <div className="grid grid-cols-[1fr_0.3fr] gap-4 pt-6">
                      <div className="flex flex-col gap-4 justify-start">
                        <h3 className="text-2xl tracking-tight font-semibold">
                          {product.product.title}
                        </h3>
                        <p className="font-medium tracking-tight">
                          {product.product.shortDescription}
                        </p>
                        <p className="text-lg mt-auto font-medium">
                          <span className="text-md font-normal">from </span>
                          {new Intl.NumberFormat("en-AU", {
                            style: "currency",
                            currency: "AUD",
                          }).format(parseFloat(product.product.basePrice))}
                        </p>
                      </div>
                      <div>
                        <Image
                          src={`https://rmwcpbyosokvrolseohk.supabase.co/storage/v1/object/public/restaurant-images/${product.product.image}?width=200&height=200`}
                          alt={product.product.title}
                          width={200}
                          height={200}
                          className="rounded-md shadow-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
            ))}
            <DialogContent className="rounded-lg max-w-[96vw] sm:max-w-[500px] p-0">
              <form
                className="grid max-w-[96vw] sm:max-w-[500px]"
                onChange={(e) => computeTotal()}
                ref={selectedProductOptionsForm}
                action={formAction}
              >
                <Input
                  type="hidden"
                  name="product_id"
                  value={selectedProduct?.product.id}
                />
                <Input
                  type="hidden"
                  name="product_name"
                  value={selectedProduct?.product.title}
                />
                <Input
                  type="hidden"
                  name="restaurant_id"
                  value={restaurant_id}
                />
                <ScrollArea className="max-h-[75vh]">
                  {selectedProduct && (
                    <>
                      <DialogHeader className="text-left p-6 bg-muted border-b">
                        <DialogTitle
                          id={selectedProduct.product.title}
                          className="text-2xl tracking-tight font-semibold"
                        >
                          {selectedProduct.product.title}
                        </DialogTitle>
                        <p>{selectedProduct.product.shortDescription}</p>
                        <p className="text-lg mt-auto font-medium ml-auto">
                          <span className="text-md font-normal">from </span>
                          {new Intl.NumberFormat("en-AU", {
                            style: "currency",
                            currency: "AUD",
                          }).format(
                            parseFloat(selectedProduct.product.basePrice)
                          )}
                        </p>
                      </DialogHeader>
                      <DialogDescription className="gap-1 grid px-6">
                        {Object.keys(selectedProduct.product.options).length >
                          0 && (
                          <h3 className="text-2xl font-semibold tracking-tight pt-4 text-center">
                            Options
                          </h3>
                        )}
                        <div className="grid gap-4">
                          {Object.keys(selectedProduct.product.options).map(
                            (optionKey, optionIndex) => {
                              const option =
                                selectedProduct.product.options[optionKey];
                              const selectType = option.type;
                              return (
                                <div className=" py-4 flex flex-col gap-2 border-b pb-6">
                                  <h3 className="text-xl font-semibold tracking-tight">
                                    {option.name}{" "}
                                    {selectType === "single-select" ? (
                                      <span className="text-md ml-auto">
                                        (select one){" "}
                                        <span className="text-red-500">*</span>
                                      </span>
                                    ) : (
                                      <span className="text-md ml-auto">
                                        (select multiple){" "}
                                      </span>
                                    )}
                                  </h3>
                                  {selectType === "single-select" && (
                                    <RadioGroup
                                      className="flex flex-col gap-2"
                                      name={`single-option-${optionIndex}-${option.name}`}
                                      required
                                    >
                                      {Object.keys(option.values).map(
                                        (valueKey, i) => {
                                          const value = option.values[valueKey];
                                          return (
                                            <div className="flex items-center space-x-2 w-full">
                                              <RadioGroupItem
                                                className="text-xl"
                                                value={`${value.value}-${value.price}`}
                                                id={`option-${optionIndex}-${i}`}
                                              ></RadioGroupItem>
                                              <Label
                                                className="text-lg cursor-pointer"
                                                htmlFor={`option-${optionIndex}-${i}`}
                                              >
                                                {value.value}
                                              </Label>
                                              <div className="ml-auto w-full">
                                                <p className="ml-auto text-md">
                                                  {parseInt(value.price) === 0
                                                    ? ""
                                                    : parseInt(value.price) > 0
                                                      ? `+${new Intl.NumberFormat(
                                                          "en-AU",
                                                          {
                                                            style: "currency",
                                                            currency: "AUD",
                                                          }
                                                        ).format(
                                                          parseFloat(
                                                            value.price
                                                          )
                                                        )}`
                                                      : `-${new Intl.NumberFormat(
                                                          "en-AU",
                                                          {
                                                            style: "currency",
                                                            currency: "AUD",
                                                          }
                                                        ).format(
                                                          parseFloat(
                                                            value.price
                                                          )
                                                        )}`}
                                                </p>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </RadioGroup>
                                  )}

                                  {selectType === "multi-select" && (
                                    <div className="flex flex-col gap-2">
                                      {Object.keys(option.values).map(
                                        (valueKey, i) => {
                                          const value = option.values[valueKey];
                                          return (
                                            <div className="flex items-center space-x-2">
                                              <Checkbox
                                                className="text-xl"
                                                value={`${value.value}-${value.price}`}
                                                id={`multi-option-${optionIndex}-${i}`}
                                                name={`multi-option-${optionIndex}-${i}-${option.name}`}
                                              ></Checkbox>

                                              <Label
                                                className="text-lg cursor-pointer"
                                                htmlFor={`multi-option-${optionIndex}-${i}`}
                                              >
                                                {value.value}
                                              </Label>
                                              <p className="ml-auto text-md">
                                                {parseInt(value.price) === 0
                                                  ? ""
                                                  : parseInt(value.price) > 0
                                                    ? `+${new Intl.NumberFormat(
                                                        "en-AU",
                                                        {
                                                          style: "currency",
                                                          currency: "AUD",
                                                        }
                                                      ).format(
                                                        parseFloat(value.price)
                                                      )}`
                                                    : `-${new Intl.NumberFormat(
                                                        "en-AU",
                                                        {
                                                          style: "currency",
                                                          currency: "AUD",
                                                        }
                                                      ).format(
                                                        parseFloat(value.price)
                                                      )}`}
                                              </p>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </DialogDescription>
                      <DialogFooter className="sticky bottom-0 flex flex-row gap-4 pt-6 pb-6 px-6 items-center justify-end border-t bg-muted/50">
                        {Object.keys(selectedProduct.product.options).length ===
                          0 && (
                          <div className="flex gap-0 mr-auto">
                            <Button
                              className="w-10 p-0"
                              type="button"
                              variant="ghost"
                              disabled={selectedProductQuantity === 1}
                              onClick={() =>
                                setSelectedProductQuantity(
                                  selectedProductQuantity - 1
                                )
                              }
                            >
                              {" "}
                              <MinusCircle className="w-5" />
                            </Button>
                            {/*quantity selector */}
                            <div className="flex items-center gap-2">
                              <Input
                                className="text-lg border-none bg-transparent text-center w-11"
                                name="quantity"
                                id="quantity"
                                min="1"
                                defaultValue="1"
                                value={selectedProductQuantity}
                                required
                                readOnly
                                onChange={() => computeTotal()}
                              />
                            </div>

                            <Button
                              className="w-10 p-0"
                              type="button"
                              variant="ghost"
                              disabled={selectedProductQuantity === 10}
                              onClick={() =>
                                setSelectedProductQuantity(
                                  selectedProductQuantity + 1
                                )
                              }
                            >
                              {" "}
                              <PlusCircle className="w-5" />
                            </Button>
                          </div>
                        )}

                        <p className="text-xl font-medium">
                          <span className="font-normal pr-1">Total:</span>
                          {selectedProduct &&
                            new Intl.NumberFormat("en-AU", {
                              style: "currency",
                              currency: "AUD",
                            }).format(
                              (parseFloat(selectedProduct.product.basePrice) +
                                selectedProductExtraPrice) *
                                selectedProductQuantity
                            )}
                        </p>
                        <SpinningAddToOrder />
                        {/* <Button type="submit">Add to Order</Button> */}
                      </DialogFooter>
                    </>
                  )}
                </ScrollArea>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </>
  );
};
