import { Router } from 'express';
import mediaController from './media.controller';
import { validateDTO } from '../../middleware/validateDTO';
import { mediaRequestBody } from './media.dto';

const mediaRouter = Router();

mediaRouter.post(
  '/',
  validateDTO(mediaRequestBody),
  mediaController.create
);
mediaRouter.get('/', mediaController.find);
mediaRouter.get('/:id', mediaController.findOne);
mediaRouter.put('/:id', mediaController.updateOne);
mediaRouter.delete('/:id', mediaController.deleteOne);

export default mediaRouter;
