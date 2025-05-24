import BcryptService from '@lib/bcrypt';
import { loginDTO } from './team.dto';
import TeamRepository from './team.repository';
import { ITeam } from './team.types';

class TeamService {
  private teamRepository;
  constructor(teamRepo: TeamRepository,) {
    this.teamRepository = teamRepo;
  }
  async createTeamMemeber(createTeamDTO: ITeam): Promise<ITeam> {
    try {
      return await this.teamRepository.create(createTeamDTO);
    } catch (error) {
      throw error;
    }
  }

}

export default TeamService;
