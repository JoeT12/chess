import { config } from "../../config";
const HEALTH_URL = `${config.gameServerHost}/api/health`;

export default async function isServerHealthy(): Promise<boolean> {
  try {
    const response = await fetch(HEALTH_URL);
    return response.ok;
  } catch (err) {
    console.warn("Server endpoint cannot be reached!", err);
    return false;
  }
}
