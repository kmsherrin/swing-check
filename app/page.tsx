import { homepageSearch } from "@/actions/search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSession } from "@/lib/auth";
import {
  ClockIcon,
  Fish,
  PackageIcon,
  Pizza,
  RefreshCwIcon,
  SearchIcon,
  ShieldIcon,
  Soup,
  TruckIcon,
  Salad,
  Video,
  CloudUpload,
  MessageSquareHeart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const userSession = await getSession();

  console.log(userSession);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <section className="w-full min-h-[80dvh] py-20 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-tr from-secondary to-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_700px]">
            <Image
              alt="Hero"
              quality={95}
              className="mx-auto aspect-video overflow-hidden rounded-lg object-cover object-center sm:w-full lg:order-last"
              height={300}
              src="/guy-swinging-edited.jpg"
              width={650}
            />
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Get instant analysis of your swing form
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Our AI-powered coach provides instant feedback on your swing
                  form, helping you improve your game.
                </p>
              </div>
              <div className="w-full max-w-lg space-y-2">
                {/* <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Get Started</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sign up to unlock the full potential of our platform.
                  <Link className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </Link>
                </p> */}
                <Link href="/analyze">
                  {" "}
                  <Button
                    type="submit"
                    className="animate-pulse font-medium text-lg py-6 px-28 w-full"
                  >
                    Analyze Swing
                  </Button>{" "}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Upload a short video of your swing form and get instant
                  feedback for less than the price of a golf ball, no expensive
                  LIDAR system necessary!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-tr from-muted to-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How it works
            </h2>
            <div className="max-w-3xl">
              <p className="text-gray-500 dark:text-gray-400">
                Swing Check uses both traditional video analysis techniques
                along with AI vision to analyze and generate feedback on your
                swing form. There's 3 easy steps to get started.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <Video className="h-12 w-12 text-primary" />
              <h3 className="text-2xl font-bold">Record Video</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Take a short 3-5 second video of your swing form. Make sure you
                are well lit and centered in the frame.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <CloudUpload className="h-12 w-12 text-primary" />
              <h3 className="text-2xl font-bold">Upload for Analysis</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Upload your video into Swing Check and we'll put the AI to work!
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <MessageSquareHeart className="h-12 w-12 text-primary" />
              <h3 className="text-2xl font-bold">
                Receive Assessment and Feedback
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Get a rating and detailed feedback on your swing form. Tailored
                drills will make sure you are on your way to becoming a better
                golfer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Popular Flavours
            </h2>
            <div className="max-w-3xl">
              <p className="text-gray-500 dark:text-gray-400">
                Find something to satify that craving with our most popular
                flavours, cuisines and dishes. Or, try something new!
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-12 gap-y-8">
              <Link href="#">
                <div className="flex flex-col gap-2 items-center border rounded-md p-6 cursor-pointer">
                  <Soup className="w-10 h-10 text-primary" />
                  <p className="font-medium">Chinese</p>
                </div>
              </Link>
              <Link href="#">
                <div className="flex flex-col gap-2 items-center border rounded-md p-6 cursor-pointer">
                  <Salad className="w-10 h-10 text-primary" />
                  <p className="font-medium">Thai</p>
                </div>
              </Link>
              <Link href="#">
                <div className="flex flex-col gap-2 items-center border rounded-md p-6 cursor-pointer">
                  <Fish className="w-10 h-10 text-primary" />
                  <p className="font-medium">Fish & Chips</p>
                </div>
              </Link>
              <Link href="#">
                <div className="flex flex-col gap-2 items-center border rounded-md p-6 cursor-pointer">
                  <Pizza className="w-10 h-10 text-primary" />
                  <p className="font-medium">Pizza</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-tr from-muted to-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Choose Our Ordering Service?
            </h2>
            <div className="max-w-3xl">
              <p className="text-gray-500 dark:text-gray-400">
                We pride ourselves on providing a fast, reliable, secure and
                cost-effective online ordering solution for small New Zealand
                businesses.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <ClockIcon className="h-12 w-12 text-primary" />
              <h3 className="text-2xl font-bold">Fast and Easy Ordering</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We think our online ordering system is easy and quick to use,
                even your nanna could work it out!
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <ShieldIcon className="h-12 w-12 text-primary" />
              <h3 className="text-2xl font-bold">Secure Handling</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your packages are in safe hands with our trained and experienced
                delivery team.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <TruckIcon className="h-12 w-12 text-primary" />
              <h3 className="text-2xl font-bold">Nationwide Coverage</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We deliver to all corners of the country, ensuring your
                customers can access your products.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-tr from-muted to-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Get Started Today
            </h2>
            <div className="max-w-3xl">
              <p className="text-gray-500 dark:text-gray-400">
                Sign up to get ordering! There's a tons of takeaways waiting for
                you to try!
              </p>
            </div>
            <div className="w-full max-w-md flex items-center justify-center">
              <Button
                className="rounded-md px-8 py-4 text-lg text-white bg-gradient-to-r from-primary to-primary animate-pulse "
                type="submit"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
}
