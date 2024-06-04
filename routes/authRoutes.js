import express from "express";
import {
  updateSubscr,
  userCurrent,
  userLogin,
  userLogout,
  userRegister,
  changeAvatar,
  verifyEmail,
  resendVerifyEmail,
} from "../controllers/authControllers.js";

import {
  userRegistrationSchema,
  loginSchema,
  updateSubscrSchema,
  emailSchema,
} from "../schemas/usersSchemas.js";
import { validateBody } from "../middlewares/validateBody.js";
import auth from "../middlewares/auth.js";
import uploadMiddleware from "../middlewares/upload.js";

const router = express.Router();

// signup
router.post("/register", validateBody(userRegistrationSchema), userRegister);

//verify
router.get("/verify/:verificationToken", verifyEmail);
router.post(
  "/verify", validateBody(emailSchema),
  resendVerifyEmail
);

//signin
router.post("/login", validateBody(loginSchema), userLogin);
router.post("/logout", auth, userLogout);
router.get("/current", auth, userCurrent);
router.patch("/current", auth, validateBody(updateSubscrSchema), updateSubscr);

//avatar
router.patch("/avatars", auth, uploadMiddleware.single("avatar"), changeAvatar);

export default router;
