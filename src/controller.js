import Joi from "joi";
import getEpoch from "./utils/epoch.js";
import token from "./utils/token.js";
import client from "../redis/config.js";

export default class Controller {
  static async token(req, res) {
    try {
      const grantType = req.body.grant_type;
      if (!grantType) {
        return res.status(400).json({ message: "grant_type is required" });
      }

      if (req.body.grant_type === "refresh_token") return refresh(req, res);

      if (req.body.grant_type === "access_token") return access(req, res);

      return res.status(400).json({ message: "Invalid grant_type" });
    } catch (error) {
      console.log(error);
      return res.status(501).json({ message: "Internal server error" });
    }
  }
}

async function access(req, res) {
  try {
    const schema = Joi.object({
      grant_type: Joi.string().required(),
      code: Joi.string().required(),
      redirect_uri: Joi.string().required(),
      client_id: Joi.string().required(),
      client_secret: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const now = await getEpoch({ seconds: true });

    const refreshToken = token();

    await client.hSet("server", {
      issued: now,
      expires: now + 600,
      refresh_token: refreshToken,
    });

    return res.status(200).json({
      expires: 600,
      token_type: "Bearer",
      access_token: token(),
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "Internal server error" });
  }
}

async function refresh(req, res) {
  try {
    const schema = Joi.object({
      grant_type: Joi.string().required(),
      refresh_token: Joi.string().required(),
      client_id: Joi.string().required(),
      client_secret: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const now = await getEpoch({ seconds: true });
    const response = await client.hGetAll("server");

    if (now > response.expires || now < response.issued + 570) {
      return res.status(401).json({
        message:
          "Request should be made after 570 seconds from previous request.",
      });
    }

    if (req.body.refresh_token !== response.refresh_token) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }

    const refreshToken = token();

    await client.hSet("server", {
      issued: now,
      expires: now + 600,
      refresh_token: refreshToken,
    });

    return res.status(200).json({
      expires: 600,
      token_type: "Bearer",
      access_token: token(),
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "Internal server error" });
  }
}
