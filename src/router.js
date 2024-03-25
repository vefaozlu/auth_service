import { Router } from "express";
import Controller from "./controller.js";

const router = Router();

router.route("/start").get(Controller.start);

router.route("/refresh").post(Controller.refresh);

router.route("/token").post(Controller.token);

export default router;
