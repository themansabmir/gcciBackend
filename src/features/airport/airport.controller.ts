import { Request, Response, NextFunction, RequestHandler } from "express";
import { IAirport } from "./airport.types";
import { airportService } from "./airport.service";

class AirportController {
  public  createAirport: RequestHandler<{}, any, IAirport> = async (
    req: Request<{}, any, IAirport>,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const airportBody = req.body;
        const airportRes =  await airportService.createAirport(airportBody)

      res.status(200).json({ message: "Airport Created Successfully",  response: airportRes });
    } catch (error) {
      next(error);
    }
  };
}

export const airportController = new AirportController();
