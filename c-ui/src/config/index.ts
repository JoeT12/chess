export const config = {
  // These could be different if you have separate servers for auth and game logic
  // For now, they point to the same server as we dont have the need for that additional complexity
  authServerHost:
    process.env.NEXT_PUBLIC_AUTH_SERVER_HOST ?? "http://localhost:8081",
  gameServerHost:
    process.env.NEXT_PUBLIC_GAME_SERVER_HOST ?? "http://localhost:8082",
  engineServerHost:
    process.env.NEXT_PUBLIC_ENGINE_SERVER_HOST ?? "http://localhost:8083",
  env: process.env.NODE_ENV ?? "development",
};
