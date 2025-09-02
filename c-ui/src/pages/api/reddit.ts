import { NextApiRequest, NextApiResponse } from "next";

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_SECRET = process.env.REDDIT_SECRET;
const REDDIT_USER_AGENT = process.env.REDDIT_USER_AGENT;  // Change to your app's name
const REDDIT_API_URL = "https://www.reddit.com/r/chess.json";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get access token from Reddit using Client ID and Secret
    const tokenResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch Reddit posts (r/chess) using the access token
    const response = await fetch(REDDIT_API_URL, {
      headers: {
        Authorisation: `Bearer ${accessToken}`,
        "User-Agent": REDDIT_USER_AGENT || "chesswebsite/1.0",
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching posts:", errorData);
      throw new Error(`Failed to fetch Reddit posts. Status: ${response.status} - ${errorData.message || errorData.error}`);
    }
    
    const data = await response.json();
    console.log("Reddit data fetched:", data);
    
    const posts = data.data.children.map((post: any) => ({
      title: post.data.title,
      url: post.data.url,
      content: post.data.selftext,
      author: post.data.author,
    }));

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
