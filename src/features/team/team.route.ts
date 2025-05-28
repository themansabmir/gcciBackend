import { defaultRouter } from '@lib/router';

import { teamController } from './team.controller';

const teamRouter = defaultRouter();
teamRouter.get('/', teamController.findTeam);
teamRouter.put('/:id', teamController.updateTeamMember);
teamRouter.put('/toggle/:id', teamController.toggleActiveStatus);
teamRouter.delete('/:id', teamController.deleteTeamMember);

export default teamRouter;
