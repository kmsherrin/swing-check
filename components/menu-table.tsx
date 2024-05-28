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
} from "lucide-react";
import Link from "next/link";

import Image from "next/image";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "./ui/use-toast";
import { SubmitButton } from "./custom_ui/submit-button";
import { updateMenuOrder } from "@/app/(account)/account/restaurant/[restaurant_id]/menu/actions";

function array_move(arr: [], old_index: number, new_index: number) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
}

const ProductsDialog = ({ restaurant_id, productsData }) => {
  return (
    <DialogContent className="max-w-[96vw] sm:max-w-fit">
      <DialogHeader className="text-left">
        <DialogTitle>View Products</DialogTitle>
        <DialogDescription>
          These products are in the category. Only products marked available
          will be shown in the customers menu.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead className="hidden md:table-cell">
                Modified at
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsData.map((productData, index) => (
              <TableRow
                className={`${productData.product.status !== "available" && "bg-gray-200"}`}
              >
                <TableCell className="hidden sm:table-cell">
                  <img
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={`https://rmwcpbyosokvrolseohk.supabase.co/storage/v1/object/public/restaurant-images/restaurant-${restaurant_id}/${productData.product.image}.webp?width=64&height=64`}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {productData.product.title}
                </TableCell>
                <TableCell className="font-medium hidden md:table-cell">
                  {productData.product_category?.name}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="default"
                    className={`capitalize whitespace-nowrap ${productData.product.status === "available" && "bg-green-500 hover:bg-green-600"} ${productData.product.status === "out of stock" && "bg-yellow-500 hover:bg-yellow-600"}`}
                  >
                    {productData.product.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  ${productData.product.basePrice}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {productData.product.createdAt.toLocaleString()}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {productData.product.modifiedAt?.toLocaleString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <Link href={`#`}>
                        <DropdownMenuItem className="cursor-pointer flex gap-2">
                          <Eye className="w-3" /> Preview
                        </DropdownMenuItem>
                      </Link>
                      <Link
                        href={`/account/restaurant/${restaurant_id}/products/${productData.product.id}/edit`}
                      >
                        <DropdownMenuItem className="cursor-pointer flex gap-2">
                          <PencilRuler className="w-3" /> Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer flex gap-2">
                        <Trash className="w-3" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  );
};

export const MenuTable = ({
  restaurant_id,
  fmtdCategoryData,
}: {
  restaurant_id: string;
  fmtdCategoryData: any;
}) => {
  const [animationParent] = useAutoAnimate();

  const [formattedCategoryData, setFormattedCategoryData] =
    useState(fmtdCategoryData);

  const [activeProductData, setActiveProductData] = useState(
    formattedCategoryData[0].products
  );

  const [productOptions, setProductOptions] = useState([]);

  const [message, formAction] = useFormState(updateMenuOrder, null);

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
    <Card>
      <CardHeader>
        <CardTitle>Menu Order</CardTitle>
        <CardDescription>
          Reorder the categories to decide on how they're seen by customers
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <input type="hidden" name="restaurant_id" value={restaurant_id} />
        <CardContent>
          <Dialog>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead>Menu Position</TableHead>
                  <TableHead>Number Of Products</TableHead>
                  <TableHead>View Products</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody ref={animationParent}>
                {formattedCategoryData.map((data, index) => (
                  <TableRow>
                    <input
                      type="hidden"
                      name={`category_id-${index}`}
                      value={`${data.category.id}`}
                    />
                    <TableCell className="font-medium">
                      {data.category.name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex gap-2 items-center">
                        <Button
                          type="button"
                          variant={"ghost"}
                          className={`${index === 0 ? "cursor-not-allowed" : ""}`}
                          disabled={index === 0}
                          onClick={() => {
                            const currentOrder = formattedCategoryData.map(
                              (x) => x
                            );
                            array_move(currentOrder, index, index - 1);
                            setFormattedCategoryData(currentOrder);
                          }}
                        >
                          <CircleArrowUp className="h-6 w-6" />
                        </Button>
                        {index + 1}
                        <Button
                          type="button"
                          variant={"ghost"}
                          className={`${index + 1 === formattedCategoryData.length ? "cursor-not-allowed" : ""}`}
                          disabled={index + 1 === formattedCategoryData.length}
                          onClick={() => {
                            console.log("helo");
                            const currentOrder = formattedCategoryData.map(
                              (x) => x
                            );
                            array_move(currentOrder, index, index + 1);
                            setFormattedCategoryData(currentOrder);
                          }}
                        >
                          <CircleArrowDown className="h-6 w-6" />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="font-medium hidden md:table-cell">
                      <div className="flex gap-2 items-center">
                        {data.products.length}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DialogTrigger
                        asChild
                        onClick={() => setActiveProductData(data.products)}
                      >
                        {/* Rotate 180 when data-state is open */}
                        <Button type="button" variant="ghost">
                          <ScanSearch className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </TableCell>
                    <ProductsDialog
                      restaurant_id={restaurant_id}
                      productsData={activeProductData}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Dialog>
        </CardContent>
        <CardFooter className="justify-end">
          <SubmitButton
            normalElement={
              <span className="flex gap-2 items-center">Update Menu</span>
            }
            pendingElement={
              <span className="flex gap-2 items-center">
                <Loader2 className="animate-spin w-4" /> Updating Menu...
              </span>
            }
          />
        </CardFooter>
      </form>
    </Card>
  );
};
