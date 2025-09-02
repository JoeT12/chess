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

interface RedditPost {
  title: string;
  url: string;
  author: string;
  content?: string;
}

const RedditChess = () => {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("api/reddit");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching Reddit posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-center">
        <CardTitle className="text-center">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
            Reddit Threads
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No chess Reddit threads found.</p>
        ) : (
          <div className="flex justify-center">
            <Carousel className="w-full">
              <CarouselContent className="flex gap-4 overflow-hidden">
                {posts.map(
                  (post, index) =>
                    post.title && (
                      <CarouselItem
                        key={index}
                        className="flex-none w-full sm:w-1/2 md:w-1/2 lg:w-1/2"
                      >
                        <div className="p-3 w-full">
                          <Card>
                            <CardHeader className="flex items-center justify-center p-6">
                              <a href={post.url}>
                                <span className="text-xl font-semibold">
                                  {post.title}
                                </span>
                              </a>
                            </CardHeader>
                            <CardContent className="w-full p-6 max-w-full overflow-hidden">
                              <p className="break-words overflow-hidden max-w-full">
                                {post?.content?.length &&
                                post.content.length > 200
                                  ? post.content
                                      ?.slice(0, 200)
                                      .replaceAll("\n", " ") +
                                    " ...[Truncated]."
                                  : post.content}
                              </p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-center p-6">
                              <p>{post.author}</p>
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

export default RedditChess;
