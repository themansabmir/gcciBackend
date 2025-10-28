// In a separate config file:
import multer from 'multer';

const storage = multer.memoryStorage(); // Store as Buffer, ready for ExcelUtility

// Export the configured instance
export const uploadExcelMiddleware = multer({ storage: storage });