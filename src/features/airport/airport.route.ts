import { airport_validate } from "./airport.dto";
import { validateDTO } from "@middleware/validateDTO";
import airportRouter from "@lib/router";
import { airportController } from "./airport.controller";

airportRouter.post(
  "/airport",
  validateDTO(airport_validate),
  airportController.createAirport
);

export default airportRouter;
