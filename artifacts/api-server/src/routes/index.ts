import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import classesRouter from "./classes";
import projectsRouter from "./projects";
import submissionsRouter from "./submissions";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(classesRouter);
router.use(projectsRouter);
router.use(submissionsRouter);
router.use(analyticsRouter);

export default router;
