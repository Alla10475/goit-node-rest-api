import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

export const isValidId = (req, res, next) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        throw HttpError(400, `${id} is not valid`);
      }

      next();
    } catch (error) {
      next(error);
    }
}
