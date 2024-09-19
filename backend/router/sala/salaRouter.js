import { Router } from "express";
import multer from "multer";
import {
  createRoom,
  deleteRoom,
  getAllRoom,
  getRoom,
  getRoomImage,
  updateRoom,
} from "../../controllers/sala/salaCon.js";

const storage = multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null, "uploads/")
  },
  filename: (req, file, cb)=>{
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const uploads = multer({storage: storage})
const router = Router();

router.get("/", getAllRoom);
router.get("/:id", getRoom);
router.get("/imageProfile/:id", getRoomImage)
router.post("/create", uploads.single("profileImage") ,createRoom);
router.put("/update/:id", updateRoom);
router.delete("/delete/:id", deleteRoom);

export { router };
