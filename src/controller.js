import Joi from "joi";
import getEpoch from "./utils/epoch.js";
import token from "./utils/token.js";
import client from "../redis/config.js";

export default class Controller {
  static async start(req, res) {
    try {
      
    } catch (error) {
      console.log(error);
      return res.status(501).json({ message: "Internal server error" });
    }
  }

  static async token(req, res) {
    try {
      const now = await getEpoch({ seconds: true });

      const refreshToken = token();

      await client.hSet("response", {
        issued: now,
        expires: now + 600,
        refresh_token: refreshToken,
      });

      return res.status(200).json({
        expires_in: 600,
        expires: now + 600,
        refresh_token: refreshToken,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({ message: "Internal server error" });
    }
  }

  static async refresh(req, res) {
    try {
      const schema = Joi.object({
        refresh_token: Joi.string().required(),
      });

      const { error } = schema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const now = await getEpoch({ seconds: true });
      const response = await client.hGetAll("response");

      if (now > response.expires || now < response.issued + 570) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (req.body.refresh_token !== response.refresh_token) {
        return res.status(400).json({ message: "Invalid refresh token" });
      }

      const refreshToken = token();

      await client.hSet("response", {
        issued: now,
        expires: now + 600,
        refresh_token: refreshToken,
      });

      return res.status(200).json({
        expires_in: 600,
        expires: now + 600,
        refresh_token: refreshToken,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({ message: "Internal server error" });
    }
  }
}
