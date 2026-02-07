import { Router } from "express";
import { registerController, loginController, logoutController, meController, registerValidators, loginValidators } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", registerValidators, registerController);
router.post("/login", loginValidators, loginController);
router.post("/logout", logoutController);
router.get("/me", authMiddleware, meController);

export default router;
