import { Router } from "express";
import { deleteUsuer, getAllUser, getUser, getUserByUsername, updateUser } from "../../controllers/user/userCon.js";

const router = Router()

router.get('/', getAllUser)
router.get('/:id', getUser)
router.post("/username", getUserByUsername)
router.put('/update/:id', updateUser)
router.delete('/delete/:id', deleteUsuer)

export { router }