//team.controller.ts

import { NextFunction, Request, RequestHandler, Response } from "express";
import TeamService from './team.service';
import { ITeam } from "./team.types";
import TeamRepository from "./team.repository";
import TeamEntity from "./team.entity";
import { loginDTO } from "./team.dto";

class TeamController {
  private teamService;
  constructor(teamService: TeamService) {
    this.teamService = teamService;
  }

  public createTeam: RequestHandler<{}, any, ITeam> = async (req: Request<{}, any, ITeam>, res: Response, next: NextFunction) => {
    try {
      const teamBody = req.body;
      const teamRes = await this.teamService.createTeamMemeber(teamBody);
      res.status(200).json({ message: 'Team created successfully', response: teamRes });
    } catch (error) {
      throw error;
    }
  };

  public login: RequestHandler<{}, any, loginDTO> = async (req:Request, res:Response, next:NextFunction) => {
    const loginBody = req.body
    const {} = await this.teamService.login(loginBody)

  }
}

const teamRepository = new TeamRepository(TeamEntity)
const teamService = new TeamService(teamRepository)
export const teamController = new TeamController(teamService)
