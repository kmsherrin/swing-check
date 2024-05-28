"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Home,
  LineChart,
  Loader,
  Loader2,
  MinusCircle,
  Package,
  Package2,
  PanelLeft,
  Plus,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Upload,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { product, productCategory } from "@/schema";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { NewCategoryDialog } from "./sub-components/add-new-category-dialog";
import { useFormState } from "react-dom";

import { toast } from "./ui/use-toast";
import { addProduct } from "@/app/(account)/account/restaurant/[restaurant_id]/products/new/actions";
import { SubmitButton } from "./custom_ui/submit-button";

export const NewProduct = ({
  restaurantId,
  existingCategories,
}: {
  restaurantId: string;
  existingCategories: any;
}) => {
  const [productOptions, setProductOptions] = useState([]);

  const [message, formAction] = useFormState(addProduct, null);

  useEffect(() => {
    if (message?.success) {
      toast({
        title: "✅ Success",
        description: message.success,
        variant: "default",
      });
    }
  }, [message]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 lg:gap-8 max-w-screen-md">
        <form action={formAction} id="new-product-form">
          <Input type="hidden" name="restaurantId" value={restaurantId} />
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  These are the base details for a product.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      className="w-full"
                      defaultValue="Gamer Gear Pro Controller"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      name="subtitle"
                      id="subtitle"
                      form="new-product-form"
                      type="text"
                      className="w-full"
                      defaultValue="The proest controller"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      name="description"
                      id="description"
                      defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                      className="min-h-32"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="productImage">Image</Label>
                    <Input
                      name="productImage"
                      type="file"
                      id="productImage"
                      accept=".png,.jpeg,.jpg,.webp"
                      capture="environment"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="productBasePrice">Base Price ($)</Label>
                    <Input
                      placeholder="12.50"
                      name="basePrice"
                      type="number"
                      id="productBasePrice"
                      min="0.00"
                      max="10000.00"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle>Additional Product Options</CardTitle>
                <CardDescription>
                  Specify the details for your product options. This can be the
                  size, flavour or any variations available for a product.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {productOptions.map((option, index) => (
                    <div key={index} className="grid gap-3 border-b-2 pb-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="optionName">Option Name</Label>
                          <Input
                            name={`optionName-${index}`}
                            id="optionName"
                            type="text"
                            className="w-full"
                            defaultValue="Color"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="optionType">Option Type</Label>
                          <Select
                            name={`optionType-${index}`}
                            defaultValue="single-select"
                            onValueChange={(val) => {
                              const currentOptions = [];

                              productOptions.forEach((option, i) => {
                                currentOptions.push(option);
                              });

                              currentOptions[index].type = val;
                              setProductOptions(currentOptions);
                            }}
                          >
                            <SelectTrigger
                              id="optionType"
                              aria-label="Select option type"
                            >
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single-select">
                                Single Select
                              </SelectItem>
                              <SelectItem value="multi-select">
                                Multi Select
                              </SelectItem>
                              <SelectItem value="acc">Accessories</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {/* #region: Single Select */}
                      {productOptions[index].type === "single-select" ? (
                        <div className="grid gap-3">
                          <Label htmlFor="optionType">
                            Option Values (only one can be chosen)
                          </Label>

                          <RadioGroup
                            defaultValue="option-one"
                            name={`optionValues-${index}`}
                          >
                            {Array.from(
                              { length: productOptions[index].numberOfOptions },
                              (x, i) => i
                            ).map((option, i) => (
                              <div
                                className="grid grid-cols-[1fr_150px] items-center space-x-2"
                                key={i}
                              >
                                <div className="flex gap-2 items-center">
                                  <RadioGroupItem
                                    value={`option-${i}`}
                                    id={`option-${i}`}
                                  />
                                  <Input
                                    type="text"
                                    className="w-full"
                                    name={`optionValue-${index}-${i}`}
                                    required
                                  />
                                </div>
                                <div className="flex gap-2 items-center">
                                  <Label className="text-sm text-nowrap">
                                    Price +/-
                                  </Label>
                                  <Input
                                    type="number"
                                    defaultValue={0}
                                    step="0.01"
                                    name={`optionPrice-${index}-${i}`}
                                  />
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                          <div className="flex justify-center items-center gap-1">
                            <p className="text-xs">
                              Number of selections:{" "}
                              {productOptions[index]?.numberOfOptions}
                            </p>
                            <Button
                              type="button"
                              variant={"ghost"}
                              onClick={() => {
                                const currentOptions = [];

                                productOptions.forEach((option, i) => {
                                  currentOptions.push(option);
                                });

                                currentOptions[index].numberOfOptions += 1;
                                setProductOptions(currentOptions);
                              }}
                            >
                              <PlusCircle className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant={"ghost"}
                              disabled={
                                productOptions[index].numberOfOptions === 1
                              }
                              onClick={() => {
                                const currentOptions = [];

                                productOptions.forEach((option, i) => {
                                  currentOptions.push(option);
                                });

                                if (
                                  currentOptions[index].numberOfOptions === 1
                                ) {
                                  return;
                                }
                                currentOptions[index].numberOfOptions -= 1;
                                setProductOptions(currentOptions);
                              }}
                            >
                              <MinusCircle className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      {productOptions[index].type === "multi-select" ? (
                        <div className="grid gap-3">
                          <Label htmlFor="optionType">
                            Option Values (multiple can be chosen)
                          </Label>
                          <div className="grid gap-2">
                            {Array.from(
                              { length: productOptions[index].numberOfOptions },
                              (x, i) => i
                            ).map((option, i) => (
                              <div
                                className="grid grid-cols-[1fr_150px] items-center space-x-2"
                                key={i}
                              >
                                <div className="flex gap-2 items-center">
                                  <Checkbox
                                    value={`option-${i}`}
                                    id={`option-${i}`}
                                  />
                                  <Input
                                    type="text"
                                    className="w-full"
                                    name={`optionValue-${index}-${i}`}
                                    required
                                  />
                                </div>
                                <div className="flex gap-2 items-center">
                                  <Label className="text-sm text-nowrap">
                                    Price +/-
                                  </Label>
                                  <Input
                                    className="w-full"
                                    type="number"
                                    defaultValue={0}
                                    step="0.01"
                                    name={`optionPrice-${index}-${i}`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-center items-center gap-1">
                            <p className="text-xs">
                              Number of selections:{" "}
                              {productOptions[index]?.numberOfOptions}
                            </p>
                            <Button
                              type="button"
                              variant={"ghost"}
                              onClick={() => {
                                const currentOptions = [];

                                productOptions.forEach((option, i) => {
                                  currentOptions.push(option);
                                });

                                currentOptions[index].numberOfOptions += 1;
                                setProductOptions(currentOptions);
                              }}
                            >
                              <PlusCircle className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant={"ghost"}
                              disabled={
                                productOptions[index].numberOfOptions === 1
                              }
                              onClick={() => {
                                const currentOptions = [];

                                productOptions.forEach((option, i) => {
                                  currentOptions.push(option);
                                });

                                if (
                                  currentOptions[index].numberOfOptions === 1
                                ) {
                                  return;
                                }
                                currentOptions[index].numberOfOptions -= 1;
                                setProductOptions(currentOptions);
                              }}
                            >
                              <MinusCircle className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                  onClick={() =>
                    setProductOptions([
                      ...productOptions,
                      {
                        id: productOptions.length + 1,
                        name: "",
                        type: "single-select",
                        numberOfOptions: 1,
                        values: "",
                      },
                    ])
                  }
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Product Option
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product Category</CardTitle>
                <CardDescription>
                  Assign a category to your product. Product categories make it
                  easier for customers to find what they're looking for.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger id="category" aria-label="Select category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingCategories.map((category, index) => (
                          <SelectItem key={index} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center border-t p-4 flex flex-col gap-2">
                <CardDescription>
                  Can't find the category you're looking for?
                </CardDescription>
                <NewCategoryDialog restaurantId={restaurantId} />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
                <CardDescription>
                  By default new products are saved as draft. A product will not
                  be visible on menus until it is set to available.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="productStatus">Status</Label>
                    <Select
                      name="productStatus"
                      required
                      defaultValue={"draft"}
                    >
                      <SelectTrigger
                        id="productStatus"
                        aria-label="Select product status"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SubmitButton
              normalElement={
                <span className="flex gap-2 items-center">Create Product</span>
              }
              pendingElement={
                <span className="flex gap-2 items-center">
                  <Loader2 className="animate-spin w-4" /> Creating Product...
                </span>
              }
            />
          </div>
        </form>
      </div>
    </>
  );
};
