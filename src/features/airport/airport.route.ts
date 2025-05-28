import { airport_validate, update_airport_validate } from './airport.dto';
import { validateDTO } from '@middleware/validateDTO';
import { defaultRouter } from '@lib/router';
import { airportController } from './airport.controller';

const airportRouter = defaultRouter();
airportRouter.post('/', validateDTO(airport_validate), airportController.createAirport);
airportRouter.get('/', airportController.getAllAirports);
airportRouter.put('/:id', validateDTO(update_airport_validate), airportController.updateAirport);
airportRouter.delete('/:id', airportController.deleteAirport);

export default airportRouter;
