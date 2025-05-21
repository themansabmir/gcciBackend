import { NextFunction, Request, RequestHandler, Response } from 'express';
import { VendorService } from './vendor.service';
import { IQuery, IVendor } from './vendor.types';
import { VendorRepository } from './vendor.repository';
import { VendorEntity } from './vendor.entity';
class VendorController {
  private vendorService;
  constructor(vendorService: VendorService) {
    this.vendorService = vendorService;
  }

  public createVendor: RequestHandler<{}, any, IVendor> = async (req: Request<{}, any, IVendor>, res: Response, next: NextFunction) => {
    try {
      const vendorBody = req.body;
      const vendorRes = await this.vendorService.createVendor(vendorBody);

      res.status(200).json({ message: 'Airport Created Successfully', response: vendorRes });
    } catch (error) {
      next(error);
    }
  };

  public updateVendor: RequestHandler<{}, any, IVendor> = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendorUpdateBody = req.body;
      const vendorRes = await this.vendorService.updateVendor(vendorUpdateBody);
      res.status(200).json({ message: 'Vendor updated successfully', response: vendorRes });
    } catch (error) {
      next(error);
    }
  };

  public findVendors: RequestHandler<{}, any, any, IQuery> = async (req: Request<any, any, any, IQuery>, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      const vendorResponse = await this.vendorService.findAllVendors(query);
      res.status(200).json({ response: vendorResponse });
    } catch (error) {
      throw error;
    }
  };

  public deleteVendor: RequestHandler<{ id: string }> = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.vendorService.deleteVendor(id);
      res.status(200).json({ message: 'Vendor deleted successfully', response: { id } });
    } catch (error) {
      next(error);
    }
  };
}

export const vendorController = new VendorController(new VendorService(new VendorRepository(VendorEntity)));
