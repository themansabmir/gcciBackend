import { airport_validate } from "./airport.dto";
import { validateDTO } from "@middleware/validateDTO";
import {defaultRouter} from "@lib/router";
import { airportController } from "./airport.controller";

const airportRouter = defaultRouter()
airportRouter.post(
  "/airport",
  validateDTO(airport_validate),
  airportController.createAirport
);

export default airportRouter;
