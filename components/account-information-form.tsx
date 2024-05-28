"use client";

import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function AccountInformationForm({
  userInformation,
}: {
  userInformation: any;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: userInformation.user.name,
      email: userInformation.user.email,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form>
      <div className="grid gap-3">
        <Label htmlFor="name">Name</Label>
        <Input
          {...register("name")}
          type="text"
          className="w-full"
        />
        <div className="grid gap-3">
          <Label htmlFor="name">Email</Label>
          <Input
            {...register("email")}
            type="email"
            className="w-full"
          />
        </div>
      </div>
    </form>
  );
}
