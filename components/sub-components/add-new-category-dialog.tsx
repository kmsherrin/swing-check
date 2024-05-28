import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { productCategory } from "@/schema";
import { PlusCircle } from "lucide-react";

import { useFormState, useFormStatus } from "react-dom";
import { SubmitButton } from "../custom_ui/submit-button";
import { addCategory } from "@/app/(account)/account/restaurant/[restaurant_id]/products/new/actions";

export function NewCategoryDialog({ restaurantId }: { restaurantId: string }) {
  const [message, formAction] = useFormState(addCategory, null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          Add New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <Input type="hidden" name="restaurantId" value={restaurantId} />
          <DialogHeader>
            <DialogTitle>Add a New Product Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                name="category"
                id="category"
                placeholder="Drinks"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            {message && message.success ? (
              <DialogDescription className="text-green-500 my-auto">
                {message.success}
              </DialogDescription>
            ) : null}
            {message && message.error ? (
              <DialogDescription className="text-red-500 my-auto">
                {message.error}
              </DialogDescription>
            ) : null}
            <SubmitButton
              normalElement={"Create"}
              pendingElement={"Creating..."}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
