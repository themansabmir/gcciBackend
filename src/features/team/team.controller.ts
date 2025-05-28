//team.controller.ts

import { successResponse } from '@middleware/successResponse';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import TeamEntity from './team.entity';
import TeamRepository from './team.repository';
import TeamService from './team.service';
import { Logger } from '@lib/logger';
import { IQuery } from '@features/vendor/vendor.types';

class TeamController {
  private teamService;
  constructor(serviceLayer: TeamService) {
    this.teamService = serviceLayer;
  }

  public findTeam: RequestHandler<{}, any, any, IQuery> = async (req: Request<{}, any, any, IQuery>, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      const { data, total } = await this.teamService.findAllTeamMembers(query);
      return successResponse({ res, response: data, message: 'Team Members Fetched Successfully', total });
    } catch (error) {
      Logger.error('SERVER ERROR', error);
      next(error);
    }
  };

  // public async findTeam(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     // const
  //     const requestParam = req.params;
  //     const { data, total } = await this.teamService.findAllTeamMembers(req.body);
  //     return successResponse({ res, response: 'data', message: 'Team Members Fetched Successfully', total: 0 });
  //   } catch (error) {
  //     Logger.error('SERVER ERROR', error);
  //     next(error);
  //   }
  // }
}

// const teamRepository = new TeamRepository(TeamEntity)
// const teamService = new TeamService(teamRepository)
export const teamController = new TeamController(new TeamService(new TeamRepository(TeamEntity)));
