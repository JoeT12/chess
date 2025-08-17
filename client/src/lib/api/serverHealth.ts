const SERVER_HOST = process.env.SERVER_HOST ?? "localhost:8081";
const HEALTH_URL = `http://${SERVER_HOST}/api/health`;

export default async function isServerHealthy(): Promise<boolean> {
  try {
    const response = await fetch(HEALTH_URL);
    return response.ok;
  } catch (err) {
    console.warn("Server endpoint cannot be reached!", err);
    return false;
  }
}
