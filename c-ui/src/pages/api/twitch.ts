import { NextApiRequest, NextApiResponse } from "next";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_SECRET = process.env.TWITCH_SECRET;
const TWITCH_API_URL = "https://api.twitch.tv/helix/streams?game_id=743&language=en&&sort=views&first=10";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get access token from Twitch using Client ID and Secret
    const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: TWITCH_CLIENT_ID || '',
            client_secret: TWITCH_SECRET || '',
            grant_type: "client_credentials",
        }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch Reddit posts (r/chess) using the access token
    const response = await fetch(TWITCH_API_URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`, // Corrected Authorization header
            "Client-ID": TWITCH_CLIENT_ID || '', // Include Client-ID for Twitch API
          },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching streams:", errorData);
      throw new Error(`Failed to fetch twitch streams. Status: ${response.status} - ${errorData.message || errorData.error}`);
    }
    
    const data = await response.json();
    console.log("Twitch data fetched:", data);
    
    const streams = data.data.map((stream: any) => ({
      title: stream.title,
      url: "https://www.twitch.tv/" + stream.user_name,
      author: stream.user_name,
      viewCount: stream.view_count,
      thumbnailURL: stream.thumbnail_url,   
    }));

   res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
