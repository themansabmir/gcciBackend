//team.controller.ts

import { Request, RequestHandler, Response } from "express";
import { teamService } from "./team.service";
import { ITeam } from "./team.types";
export const createTeam: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teamDTO: ITeam = req.body;
    const newTeam = await teamService.createTeamMemeber(teamDTO);
    res
      .status(200)
      .json({ message: "Team member created successfully", data: newTeam });
  } catch (error) {
    throw error;
  }
};
