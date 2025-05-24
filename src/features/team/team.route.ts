import {defaultRouter} from '@lib/router';
import { createTeamSchema, loginschema } from './team.dto';

import { validateDTO } from 'middleware/validateDTO';
import { teamController } from './team.controller';

const teamRouter = defaultRouter()
teamRouter.post('/', validateDTO(createTeamSchema), teamController.createTeam);
teamRouter.post('/login', validateDTO(loginschema),);



export default teamRouter;
