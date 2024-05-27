import express from "express";
import { updateSubscr, userCurrent, userLogin, userLogout, userRegister } from "../controllers/authControllers.js";

import { userRegistrationSchema, loginSchema, updateSubscrSchema } from "../schemas/usersSchemas.js";
import { validateBody } from "../middlewares/validateBody.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// signup
router.post('/register', validateBody(userRegistrationSchema), userRegister);

//signin
router.post('/login', validateBody(loginSchema), userLogin);
router.post('/logout', auth, userLogout);
router.get('/current', auth, userCurrent);
router.patch("/current", auth, validateBody(updateSubscrSchema), updateSubscr);

export default router;