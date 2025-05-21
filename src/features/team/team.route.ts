import express from "express";
import { createTeamDTO } from "./team.dto";

import { validateDTO } from "middleware/validateDTO";
import { createTeam } from "./team.controller";

const router = express.Router();

router.post("/team",validateDTO(createTeamDTO),   createTeam);

export default router