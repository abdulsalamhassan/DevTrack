import { Router } from "express";
import { createProjectController, getProjectsController, getProjectController, addMemberController, createValidators } from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateProjectIdParam, validateMemberIdBody, projectOwnerOnly } from "../middleware/project.middleware";

const router = Router();

router.post("/", authMiddleware, createValidators, createProjectController);
router.get("/", authMiddleware, getProjectsController);
router.get("/:projectId", authMiddleware, validateProjectIdParam, getProjectController);
router.post(
    "/:projectId/members",
    authMiddleware,
    validateProjectIdParam,
    projectOwnerOnly,
    validateMemberIdBody,
    addMemberController
);

export default router;
