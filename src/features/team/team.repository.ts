import { BaseRepository } from "@features/base.repository";
import { ITeam } from "./team.types";
import TeamModel from "./team.entity";

class TeamRepository extends BaseRepository<ITeam> {
  
}

const teamRepository = new TeamRepository(TeamModel);
export default teamRepository;
