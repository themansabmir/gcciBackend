import BcryptService from '@lib/bcrypt';
import { loginDTO } from './team.dto';
import TeamRepository from './team.repository';
import { ITeam } from './team.types';
import { IQuery } from '@features/vendor/vendor.types';
import { isValidObjectId } from 'mongoose';
import { Logger } from '@lib/logger';

class TeamService {
  private teamRepository;
  constructor(teamRepo: TeamRepository) {
    this.teamRepository = teamRepo;
  }
  public async findAllTeamMembers(query: IQuery) {
    try {
      const { page, limit, search, sortBy, sortOrder } = query;

      let skip, sort: Record<string, 1 | -1>;

      const filter: any = {};

      if (search) {
        filter.$or = [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { first_name: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } },
        ];
      }

      const searchQueryBuilder = this.teamRepository.find(filter);
      if (limit) {
        searchQueryBuilder.limit(limit);
      }
      if (limit && page) {
        skip = (page - 1) * limit;
        searchQueryBuilder.skip(skip);
      }
      if (sortBy && sortOrder) {
        sort = {
          [sortBy]: sortOrder === 'asc' ? 1 : -1,
        };
        searchQueryBuilder.sort(sort);
      }
      const countPromise = this.teamRepository.count(filter);
      const [data, total] = await Promise.all([searchQueryBuilder, countPromise]);

      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  public async deleteTeamMember(id: string) {
    try {
      if (!isValidObjectId(id)) throw new Error('Incorrect DB id');
      await this.teamRepository.deleteById(id);
      Logger.info('Team member deleted successfully', { id });
      return id;
    } catch (error) {
      throw error;
    }
  }

  public async updateTeamMember(_id: string, teamUpdateBody: ITeam) {
    try {
      if (!isValidObjectId(_id)) throw new Error('Invalid Id');
      return await this.teamRepository.updateById(_id, teamUpdateBody);
    } catch (error) {
      throw error;
    }
  }

  public async toggleActivateStatus(id: string) {
    try {
      if (!isValidObjectId(id)) throw new Error('Invalid Id');

      const team = await this.teamRepository.findById(id);
      if (!team) throw new Error('Team not found');

      const newStatus = !team.is_active;

      await this.teamRepository.updateById(id, { is_active: newStatus });

      return { id, is_active: newStatus };
    } catch (error) {
      throw error;
    }
  }
}

export default TeamService;
