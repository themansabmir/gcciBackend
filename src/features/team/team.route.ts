import { defaultRouter } from '@lib/router';

import { teamController } from './team.controller';

const teamRouter = defaultRouter()
teamRouter.get('/', teamController.findTeam);



export default teamRouter;
