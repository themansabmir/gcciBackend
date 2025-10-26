
import { portService } from '@features/port/port.controller';
import { rateMasterService } from '@features/ratemaster/ratemaster.service';
import { vendorService } from '@features/vendor/vendor.controller';
import XLSXService from '@lib/excel';
import { templateConfig, TemplateModule } from 'constants/excel_maps';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { IExcelRow } from '../ratemaster/ratesheetmaster.types';
class ExcelController {

    private parseFile(file: Buffer, module: string) {

        if (!module || !templateConfig[module as TemplateModule]) {
            throw new Error('Invalid module');
        }
        const moduleConfig = templateConfig[module as TemplateModule];
        const xlsxService = new XLSXService();
        // Parse Excel file
        const parsedData = xlsxService.parseExcel(file, moduleConfig.headers, moduleConfig.map);
        return parsedData;
    }

    public uploadExcel: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const module = req.params.module as string;
            console.log("Module", module)
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }
            const parsedData = this.parseFile(req.file.buffer, module);
            // depending on the different module, we will pass this parsed rows of objects to different service layer
            // these services will tc of data transformation, validation & insertion/rejection. 
            // finally we will return the response to the user.
            console.log("PARSED EXCEL FILE START")
            console.log(parsedData)
            console.log("PARSED EXCEL FILE END")
            switch (module) {
                case 'vendor':
                    await vendorService.bulkImportVendors(parsedData);
                    break;
                case 'port':
                    await portService.bulkUploadPorts(parsedData);
                    break;
                case 'rate-master':
                    await rateMasterService.bulkImportRates(parsedData as IExcelRow[]);
                    break;
                default:
                    throw new Error('Invalid module');
            }


            res.status(200).json({ message: 'Excel uploaded successfully' });

        } catch (error) {
            throw error;
        }
    }

    public downloadTemplate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const module = req.params.module as string;
            if (!module || !templateConfig[module as TemplateModule]) {
                throw new Error('Invalid module');
            }
            const moduleConfig = templateConfig[module as TemplateModule];
            const xlsxService = new XLSXService();
            const templateBuffer = xlsxService.generateTemplateAsBuffer(moduleConfig.headers);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${moduleConfig.fileName}`);
            res.send(templateBuffer);
        } catch (error) {
            throw error;
        }
    }

}


export const excelController = new ExcelController();