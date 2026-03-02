import express from "express";
import { googleLogin, registerUser, emailLogin, getAdminStats } from "./auth.controller.js";

const router = express.Router();

router.post("/google", googleLogin);
router.post("/register", registerUser);
router.post("/login", emailLogin);
router.get("/users", getAdminStats); 

export default router;