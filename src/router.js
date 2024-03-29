import { Router } from "express";
import Controller from "./controller.js";

const router = Router();

router.route("/token").post(Controller.token);

export default router;
