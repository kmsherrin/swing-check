// "use client";

import {
  Activity,
  CircleUser,
  Menu,
  Package2,
  Search,
  Video,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getSession } from "@/lib/auth";
import { ModeToggle } from "./sub-components/theme-toggle-button";
import { useParams } from "next/navigation";
import { Separator } from "./ui/separator";
import { SignoutButton } from "./custom_ui/signout-button";

export const Navbar = async () => {
  const session = await getSession();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-4 z-50">
      <nav className="hidden flex-col gap-4 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
        <Link href="/" className="min-w-fit w-10 h-10 flex gap-2 items-center">
          <Image
            className="w-10 h-10 brightness-90 outline"
            src="/swing-check-logo.png"
            alt="Logo"
            width={40}
            height={40}
          />
          <span className="sr-only">Logo</span>

          <span className="text-lg min-w-fit font-semibold tracking-tight">
            Swing Check
          </span>
        </Link>

        <Link
          href="/analyze"
          className="min-w-fit text-muted-foreground transition-colors hover:text-foreground"
        >
          Analyze Video
        </Link>

        {session?.user && !session.user.guest ? (
          <Link
            href="/account/videos"
            className="min-w-fit text-muted-foreground transition-colors hover:text-foreground"
          >
            Your Videos
          </Link>
        ) : null}

        {/* <Link
          href="#"
          className="text-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Orders
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Products
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Customers
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Analytics
        </Link> */}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="w-10 h-10 min-w-fit flex items-center gap-2"
            >
              <Image
                className="w-10 h-10"
                src="/swing-check-logo.png"
                alt="Logo"
                width={40}
                height={40}
              />
              <span className="text-lg min-w-fit font-semibold tracking-tight">
                Swing Check
              </span>
              <span className="sr-only">Logo</span>
            </Link>

            <Link
              href="/analyze"
              className="hover:text-foreground flex items-center gap-2"
            >
              <Activity /> Analyze Video
            </Link>

            {session?.user && !session.user.guest ? (
              <Link
                href="/account/videos"
                className="hover:text-foreground flex items-center gap-2"
              >
                <Video /> Your Videos
              </Link>
            ) : null}
          </nav>
        </SheetContent>
      </Sheet>
      <span className="md:hidden text-lg min-w-fit font-semibold tracking-tight">
        Swing Check
      </span>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {/* <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form> */}
        <div className="ml-auto flex-1 sm:flex-initial"></div>
        <div className="block md:block">
          <ModeToggle />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              {session?.user && !session.user.guest ? (
                <div>
                  <img
                    className="rounded-full p-[1px]"
                    src={session?.user?.image}
                  />
                </div>
              ) : (
                <CircleUser className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/account">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/contact">Support</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {session && !session.user.guest ? (
              <SignoutButton />
            ) : (
              <Link className="cursor-pointer" href="/login">
                <DropdownMenuItem className="cursor-pointer">
                  Login
                </DropdownMenuItem>
              </Link>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
