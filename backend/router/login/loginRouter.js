import { loginUser, registerUser } from "../../controllers/login/loginCon.js";
import { Router } from "express";
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const router = Router()
router.post('/login', loginUser)
router.post('/register', upload.single('profileImage'), registerUser)

export { router }