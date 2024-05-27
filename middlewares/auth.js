import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";

import User from "../models/user.js";

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (typeof authorizationHeader !== "string") {
    next(HttpError(401,"Not authorized"));
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      next(HttpError(401, "Not authorized"));
    }

    try {
      const user = await User.findById(decode.id);

      if (user === null) {
        next(HttpError(401, "Not authorized"));
        }
        
      if (user.token !== token) {
        next(HttpError(401, "Not authorized"));
      }

      req.user = { id: decode.id };

      next();
    } catch (error) {
      next(error);
    }
  });
}

export default auth;
