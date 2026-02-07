import { Router } from "express";
import { createIssueController, listIssuesController, updateStatusController, assignController, createValidators, listValidators, statusValidators, assignValidators } from "../controllers/issue.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateProjectIdParam, validateIssueIdParam, ensureProjectMember, ensureIssueBelongsToProject } from "../middleware/issue.middleware";

const router = Router();

// POST /projects/:projectId/issues
router.post("/projects/:projectId/issues", authMiddleware, validateProjectIdParam, ensureProjectMember, createValidators, createIssueController);
// GET /projects/:projectId/issues
router.get("/projects/:projectId/issues", authMiddleware, validateProjectIdParam, ensureProjectMember, listValidators, listIssuesController);
// PATCH /issues/:issueId/status
router.patch("/issues/:issueId/status", authMiddleware, validateIssueIdParam, statusValidators, updateStatusController);
// PATCH /issues/:issueId/assign
router.patch(
    "/issues/:issueId/assign",
    authMiddleware,
    validateIssueIdParam,
    assignValidators,
    async (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => {
        // ensure issue belongs to project if projectId provided via query or body
        // rely on service to validate membership for assignee
        return assignController(req, res as any);
    }
);

export default router;
