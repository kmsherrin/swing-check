import Link from "next/link";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="w-full bg-card text-gray-400 py-2">
      {/* <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-6">
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-col gap-2 justify-center w-full">
            <p>Partner with us</p>
            <div className="flex items-center w-full justify-center">
              <Button
                variant="outline"
                className="hover:animate-shimmer w-full bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:250%_100%] px-6 transition-colors"
              >
                <span className="font-semibold inline-block bg-gradient-to-br from-primary to-muted-foreground dark:to-gray-100 bg-clip-text text-transparent">
                  List your restaurant
                </span>
              </Button>
            </div>
          </div>
          <Link
            className="flex items-center gap-2 text-white text-lg font-semibold"
            href="#"
          >
            <MountainIcon className="w-6 h-6" />
            <span>Acme SAAS</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Streamline your restaurant's order management with our powerful SAAS
            platform.
          </p>
        </div>
        <div className="grid gap-2">
          <Link className="hover:underline hover:text-white" href="#">
            About
          </Link>
          <Link className="hover:underline hover:text-white" href="#">
            Contact
          </Link>
          <Link className="hover:underline hover:text-white" href="#">
            Terms of Service
          </Link>
          <Link className="hover:underline hover:text-white" href="#">
            Privacy Policy
          </Link>
        </div>
        <div className="grid gap-2">
          <Link className="hover:underline hover:text-white" href="#">
            Features
          </Link>
          <Link className="hover:underline hover:text-white" href="#">
            Pricing
          </Link>
          <Link className="hover:underline hover:text-white" href="#">
            Integrations
          </Link>
          <Link className="hover:underline hover:text-white" href="#">
            Support
          </Link>
        </div>
        <div className="grid gap-2">
          <Link className="hover:underline hover:text-white" href="#">
            Blog
          </Link>
          <Link className="hover:underline hover:text-white" href="#">
            Careers
          </Link>
          <Link className="hover:underline hover:text-white" href="#">
            Status
          </Link>
          <Link className="hover:underline hover:text-white" href="#">
            Press
          </Link>
        </div>
      </div> */}
      <div className="container px-4 md:px-6 text-center text-sm">
        <p>
          © 2024 Shot Check |{" "}
          <Link
            href="https://www.follow-through-labs.online"
            className="text-primary"
          >
            Follow Through Labs 🧪
          </Link>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
