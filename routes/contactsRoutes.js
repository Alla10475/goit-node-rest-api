import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import { isValidId } from "../middlewares/isValidId.js"
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../schemas/contactsSchemas.js";

const router = express.Router();

router.get("/", getAllContacts);
router.get("/:id", isValidId, getOneContact);
router.delete("/:id", isValidId, deleteContact);
router.post("/", validateBody(createContactSchema), createContact);
router.put("/:id", isValidId, validateBody(updateContactSchema), updateContact);
router.patch("/:id/favorite", isValidId, validateBody(updateFavoriteSchema), updateStatusContact);

export default router;
