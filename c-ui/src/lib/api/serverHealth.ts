import { config } from "../../config";
const GAME_SERVER_HEALTH_ENDPOINT = `${config.gameServerHost}/api/health`;
const ENGINE_SERVER_HEALTH_ENDPOINT = `${config.engineServerHost}/api/health`;

export async function isGameServerHealthy(): Promise<boolean> {
  try {
    const response = await fetch(GAME_SERVER_HEALTH_ENDPOINT);
    return response.ok;
  } catch (err) {
    console.warn("Game server is unhealthy!", err);
    return false;
  }
}

export async function isEngineServerHealthy(): Promise<boolean> {
  try {
    const response = await fetch(ENGINE_SERVER_HEALTH_ENDPOINT);
    return response.ok;
  } catch (err) {
    console.warn("Engine server is unhealthy!", err);
    return false;
  }
}
