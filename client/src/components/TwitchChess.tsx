import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface TwitchStream {
  title: string;
  url: string;
  author: string;
  viewCount: number;
  thumbnailURL: string;
}

const TwitchChess = () => {
  const [streams, setStreams] = useState<TwitchStream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await fetch("api/twitch");
        const data = await response.json();
        setStreams(data);
      } catch (error) {
        console.error("Error fetching Twitch streams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-center">
        <CardTitle className="text-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Twitch Streams
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : streams.length === 0 ? (
          <p>No chess streams found.</p>
        ) : (
          <div className="flex justify-center">
            <Carousel className="w-full">
              <CarouselContent className="flex gap-4">
                {streams.map(
                  (stream, index) =>
                    stream.title && (
                      <CarouselItem
                        key={index}
                        className="flex-none w-[calc(100%/1)] sm:w-[calc(100%/2)] md:w-[calc(100%/2)] lg:w-[calc(100%/2)]"
                      >
                        <div className="p-3">
                          <Card>
                            <CardHeader className="flex items-center justify-center p-6">
                              <span className="text-xl text-center font-semibold">
                                <a className="link" href={stream.url}>
                                  {stream.title}
                                </a>
                              </span>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center p-6">
                              <a href={stream.url}>
                                <img
                                  src={stream.thumbnailURL
                                    .replace("{width}", "320")
                                    .replace("{height}", "180")}
                                  alt={stream.title}
                                />
                              </a>
                            </CardContent>
                            <CardFooter className="flex items-center justify-center p-6">
                              <p>{stream.author}</p>
                              <p>{stream.viewCount}</p>
                            </CardFooter>
                          </Card>
                        </div>
                      </CarouselItem>
                    )
                )}
              </CarouselContent>
              <CarouselPrevious className="p-2 absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white px-4 py-2 rounded-full" />
              <CarouselNext className="p-2 absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white px-4 py-2 rounded-full" />
            </Carousel>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwitchChess;
