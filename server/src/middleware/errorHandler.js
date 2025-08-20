import { ApiError } from "../utils/apiError.js";

export function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err.message);

  // if headers already sent, delegate to Express
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Fallback
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
}
