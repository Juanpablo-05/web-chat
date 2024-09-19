import { Router } from "express";
import {
  createSalaUsuario,
  deleteSalaUsuario,
  getAllSalaUsuarios,
  getSalaUsuario,
  getUserRoom,
  updateSalaUsuario,
} from "../../controllers/sala_user/sala_userCon.js";

const router = Router();

router.get("/:id", getAllSalaUsuarios);
router.get("/", getSalaUsuario);
router.get("/userRoom/:id", getUserRoom)
router.post("/create", createSalaUsuario);
router.put("/update/:id", updateSalaUsuario);
router.delete("/delete/:id", deleteSalaUsuario);

export { router };
