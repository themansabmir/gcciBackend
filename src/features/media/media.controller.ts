import { Request, Response, NextFunction } from 'express';
import mediaService from './media.service';
import { mediaRequestBody } from './media.dto';
import { IMedia } from './media.types';

class MediaController {
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const media = await mediaService.create(req.body);
      res.status(201).json({
        success: true,
        data: media,
      });
    } catch (error) {
      next(error);
    }
  }

  async find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const media = await mediaService.find(req.query);
      res.status(200).json({
        success: true,
        data: media,
      });
    } catch (error) {
      next(error);
    }
  }

  async findOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const media = await mediaService.findOne({ _id: req.params.id });
      res.status(200).json({
        success: true,
        data: media,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const media = await mediaService.updateOne(
        { _id: req.params.id },
        req.body
      );
      res.status(200).json({
        success: true,
        data: media,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await mediaService.deleteOne({ _id: req.params.id });
      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MediaController();
