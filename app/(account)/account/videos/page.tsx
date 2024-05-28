import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { db } from "@/lib/drizzle";
import { videoUpload, analysisOutput, videoFrames } from "@/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

async function getData() {
  "use server";
  const supabaseUrl = "https://faaqjcsayuwzdwbipxru.supabase.co";
  const supabaseKey = process.env.SUPABASE_PASSWORD;

  const supabase = createClient(supabaseUrl, supabaseKey!);

  const currentSession = await getSession();

  if (!currentSession?.user) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("You must be logged in to view this page");
  }
  const { user } = currentSession;

  // use drizzle to get the user data
  const userVideos = await db
    .select()
    .from(videoUpload)
    .leftJoin(analysisOutput, eq(analysisOutput.videoId, videoUpload.id))
    .where(eq(videoUpload.userId, user.id))
    .orderBy(desc(videoUpload.createdAt));

  // loop over and get the signedUrl from them
  for (let i = 0; i < userVideos.length; i++) {
    const video = userVideos[i];
    const { data: poseSignedUrl, error: poseError } = await supabase.storage
      .from("pose_frame")
      .createSignedUrl(`/${video.video_upload.id}.jpg`, 3600);

    video.signedUrl = poseSignedUrl?.signedUrl;
  }

  return userVideos;
}

export default async function AccountVideos() {
  const userVideos = await getData();
  const session = await getSession();

  if (!session?.user || session?.user?.guest) {
    // Redirect to login page
    redirect("/login");
  }

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-4xl font-semibold">Your Videos</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link href="/account/videos" className="font-semibold text-primary">
            Your Videos
          </Link>
          <Link href="/account/credits">Credits</Link>
        </nav>
        <div className="grid gap-6">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Videos</CardTitle>
              <CardDescription>
                View your past videos and coaching feedback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created At
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userVideos.map((video, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {video?.signedUrl ? (
                            <Image
                              alt="Product image"
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={`${video?.signedUrl}&width=64`}
                              width="64"
                            />
                          ) : (
                            <div>X</div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link
                            className="underline"
                            href={`/analyze/${video?.video_upload.id}`}
                          >
                            {video?.video_upload?.originalVideoName}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="default"
                            className={`${video?.video_upload?.status === "failed" && "bg-red-500 text-white"} ${video?.video_upload?.status === "completed" && "bg-green-500 text-white"} ${video?.video_upload?.status === "analyzing" && "bg-yellow-500 text-white"} ${video?.video_upload?.status === "active" && "bg-yellow-500 text-white"}`}
                          >
                            {video?.video_upload?.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-fit hidden md:table-cell">
                          {new Date(
                            video?.video_upload?.createdAt
                          ).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{userVideos.length}</strong> videos
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
