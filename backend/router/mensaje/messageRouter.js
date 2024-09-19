import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
} from "../../controllers/mensaje/message.js";

const router = Router();

router.get("/", getAllMessages);
router.get("/:id", getMessageById);
router.post("/create", createMessage);
router.put("/update/:id", updateMessage);
router.delete("/delete/:id", deleteMessage);

export { router };
