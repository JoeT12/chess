import { Router } from "express";

const router = new Router();

router.get("/health", (req, res, next) => {
  res.status(200).send("Engine service is healthy!");
});

export default router;
