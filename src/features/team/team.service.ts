import { loginDTO } from "./team.dto";
import teamRepository from "./team.repository";
import { ITeam } from "./team.types";
class TeamService {
  async createTeamMemeber(createTeamDTO: ITeam) {
    try {
      return await teamRepository.create(createTeamDTO);
    } catch (error) {
      throw error;
    }
  }

    async login(login: loginDTO) {


  }
}

export const teamService = new TeamService();
