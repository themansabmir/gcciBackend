import { defaultRouter } from "@lib/router";
import { excelController } from "./excel.controller";
import { uploadExcel } from "@middleware/upload";

const excelRouter = defaultRouter();

excelRouter.post('/bulk-insert/:module', uploadExcel, excelController.uploadExcel);
excelRouter.get('/template/:module', excelController.downloadTemplate);

export default excelRouter;
