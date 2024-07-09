"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSession } from "@/lib/auth";
import { videoUpload } from "@/schema";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const getVideoStatus = async (videoId: string) => {
  const response = await fetch(`/api/videoStatus?videoId=${videoId}`);
  return response.json();
};

export const AnalyzeVideo = ({
  videoId,
  videoData,
}: {
  videoId: string;
  videoData: Record<string, any>;
}) => {
  const [progressBarValue, setProgressBarValue] = useState(0);
  const [videoFrames, setVideoFrames] = useState();

  const [intervalState, setIntervalState] = useState<NodeJS.Timeout | null>(
    null
  );

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["videoData"], // Add the initialData property with the value null
    queryFn: () => getVideoStatus(videoId),
  });

  useEffect(() => {
    const tt = setInterval(() => {
      refetch();
      console.log(data?.analysis_output?.output);
      if (data?.analysis_output?.output) {
        clearInterval(tt);
      }
    }, 3000);

    setIntervalState(tt);

    return () => clearInterval(tt);
  }, []);

  useEffect(() => {
    console.log(data?.video_upload?.status);

    if (data?.video_upload?.status === "active") {
      setProgressBarValue(10);
    }

    if (data?.video_upload?.status === "analyzing") {
      setProgressBarValue(77);
    }

    if (data?.video_upload?.status === "completed") {
      setProgressBarValue(100);
      return;
    }
  }, [data?.video_upload?.status]);

  useEffect(() => {
    if (
      data?.framesSignedUrl &&
      data?.framesSignedUrl.length > 0 &&
      !videoFrames
    ) {
      // Download the data and decode the base64 into an array of frames
      fetch(`${data.framesSignedUrl}`)
        .then((res) => {
          console.log(res);
          return res.blob();
        })
        .then((blob) => {
          const reader = new FileReader();
          reader.readAsText(blob, "utf-8");

          reader.onload = function () {
            // for each of the frames decode the bas e64 into a blob
            console.log(reader.result);
            // parse the json
            const parsedJson = JSON.parse(reader.result as string);

            setVideoFrames(parsedJson);
          };
        });
    }
  }, [data?.framesSignedUrl]);

  useEffect(() => {
    if (data?.analysis_output) {
      if (intervalState) {
        clearInterval(intervalState);
      }
    }
  }, [data]);

  console.log(data?.video_upload);

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight">Video Analysis</h1>
      {data?.video_upload?.status !== "completed" ? (
        <>
          <div>
            <span className="text-lg flex items-center gap-2 font-medium">
              Analysis status:{" "}
              <Badge className="text-lg">
                {data?.video_upload?.status || "loading"}
              </Badge>
            </span>
          </div>
          {data?.video_upload?.status && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Your video is in the queue and is being prepared for
                    analysis.
                    <div className="flex flex-col gap-6 justify-center items-center h-52">
                      {data?.video_upload?.status !== "completed" && (
                        <Loader2 className="animate-spin w-10 h-10 text-primary" />
                      )}
                      <Progress value={progressBarValue} max={100} />
                    </div>
                  </CardDescription>
                </CardContent>
              </Card>
              <p className="text-gray-500 dark:text-gray-500">
                Please be patient, on average an analysis takes 15 - 30 seconds
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <p>
                  <b>Video</b>: {data?.video_upload?.originalVideoName}
                </p>
                {/* {videoFrames &&
                  videoFrames?.map((frame) => {
                    return (
                      <img
                        className="rounded-md shadow-sm max-h-[500px] w-full"
                        src={`data:image/png;base64,${frame}`}
                      />
                    );
                  })} */}
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl rounded-full text-center font-semibold tracking-tight">
                      {data?.analysis_output?.output?.rating}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Swing Kinematics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      className="rounded-md shadow-sm max-h-[600px]"
                      src={data?.poseSignedUrl}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Swing Form Feedback</CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription>
                  <Markdown className="markdown">
                    {data?.analysis_output?.output?.swing_form_feedback}
                  </Markdown>
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>General Feedback</CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription>
                  <Markdown className="markdown">
                    {data?.analysis_output?.output?.general_feedback}
                  </Markdown>
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Drills</CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription>
                  <Markdown className="markdown">
                    {data?.analysis_output?.output?.improvement_advice}
                  </Markdown>
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Swing Frames</CardTitle>
              </CardHeader>

              <CardContent>
                <Carousel className="w-full">
                  <CarouselContent>
                    {videoFrames?.map((frame, index) => {
                      return (
                        <CarouselItem key={index} className="md:basis-1/2">
                          <p className="text-xs">Frame: {index + 1}</p>
                          <img
                            className="rounded-md shadow-sm"
                            src={`data:image/png;base64,${frame}`}
                          />
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
};
