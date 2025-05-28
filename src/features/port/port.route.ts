import { port_validate, update_port_validate } from './port.dto';
import { validateDTO } from '@middleware/validateDTO';
import { defaultRouter } from '@lib/router';
import { portController } from './port.controller';

const portRouter = defaultRouter();
portRouter.post('/', validateDTO(port_validate), portController.createAirport);
portRouter.get('/', portController.getAllPorts);
portRouter.put('/:id', validateDTO(update_port_validate), portController.updatePort);
portRouter.delete('/:id', portController.deletePort);

export default portRouter;
