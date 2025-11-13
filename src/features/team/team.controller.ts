//team.controller.ts

import { successResponse } from '@middleware/successResponse';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import TeamEntity from './team.entity';
import TeamRepository from './team.repository';
import TeamService from './team.service';
import { Logger } from '@lib/logger';
import { IQuery } from '@features/vendor/vendor.types';
import { ITeam } from './team.types';

class TeamController {
  private teamService;
  constructor(serviceLayer: TeamService) {
    this.teamService = serviceLayer;
  }

  public findTeam: RequestHandler<{}, any, any, IQuery> = async (req: Request<{}, any, any, IQuery>, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      const { data, total } = await this.teamService.findAllTeamMembers(query);
     successResponse({ res, response: data, message: 'Team Members Fetched Successfully', total });
    } catch (error) {
      Logger.error('SERVER ERROR', error);
      next(error);
    }
  };

  public updateTeamMember: RequestHandler<{ id: string }, any, ITeam> = async (
    req: Request<{ id: string }, any, ITeam>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const teamUpdateBody = req.body;
      const id = req.params?.id;
      const teamRes = await this.teamService.updateTeamMember(id, teamUpdateBody);
     successResponse({ res, response: teamRes, message: 'Team member updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTeamMember: RequestHandler<{ id: string }> = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params?.id;
      const teamRes = await this.teamService.deleteTeamMember(id);
     successResponse({ res, response: teamRes, message: 'Team member deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public toggleActiveStatus: RequestHandler<{ id: string }> = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const id = req.params?.id;
      const teamRes = await this.teamService.toggleActivateStatus(id);
     successResponse({ res, response: teamRes, message: 'Team member status updated successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export const teamController = new TeamController(new TeamService(new TeamRepository(TeamEntity)));
