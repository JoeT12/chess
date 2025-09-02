import Router from "express";
import { catchAsync } from "../../../c-common/src/utils/catchAsync.js";
import { engineService } from "../service/engineService.js";

const router = Router();

router.post(
  "/getBestMove",
  catchAsync(async (req, res, next) => {
    const { fen, aiConfig } = req.body;
    const move = await engineService.getBestMove(fen, aiConfig);
    res.json({ move: move });
  })
);

export default router;
