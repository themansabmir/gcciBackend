import * as XLSX from "xlsx";

type ExcelRow = Record<string, any>;

type HeaderMap = Record<string, string>;

export default class XLSXService {
    private options: Record<string, any>;
    constructor(options: Record<string, any> = {}) {
        this.options = options;
    }

    /**
     * 1️⃣ Parses an Excel file buffer into an array of objects.
     * Performs optional header validation and applies header mapping.
     *
     * @param fileBuffer The raw Buffer containing the Excel file data.
     * @param expectedHeaders An optional array of headers that MUST be present.
     * @param headerMap An optional map to rename headers (e.g., {"Old Name": "newKey"}).
     * @returns An array of objects representing the rows of the Excel sheet.
     */
    public parseExcel(
        fileBuffer: Buffer,
        expectedHeaders: string[] = [],
        headerMap: HeaderMap = {}
    ): ExcelRow[] {
        // 1. Read the workbook from the buffer
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // 2. Convert sheet to JSON array
        const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

        if (rows.length === 0) {
            // Handle empty sheet case
            if (expectedHeaders.length > 0) {
                throw new Error("File is empty and cannot be validated against required headers.");
            }
            return [];
        }

        // 3. Extract and validate headers
        const actualHeaders = Object.keys(rows[0]);
        this.validateHeaders(actualHeaders, expectedHeaders);

        // 4. Apply header mapping
        const mappedRows: ExcelRow[] = rows.map((row) => {
            const mappedRow: ExcelRow = {};
            for (const [header, value] of Object.entries(row)) {
                // Use the mapped key, or fall back to the original header if no map exists
                const mappedKey = headerMap[header] || header;
                mappedRow[mappedKey] = value;
            }
            return mappedRow;
        });

        return mappedRows;
    }

    /**
     * 2️⃣ Validates that all expected headers are present in the actual headers.
     * Throws an error if any required headers are missing.
     *
     * @param actualHeaders The headers found in the Excel file.
     * @param expectedHeaders The headers that are required.
     * @returns void
     */
    private validateHeaders(actualHeaders: string[], expectedHeaders: string[]): void {
        if (!expectedHeaders || expectedHeaders.length === 0) return;

        const missing = expectedHeaders.filter(
            (h) => !actualHeaders.includes(h)
        );

        if (missing.length > 0) {
            throw new Error(
                `Missing required headers: ${missing.join(", ")}`
            );
        }
    }

    /**
     * 3️⃣ Generates a simple Excel template file containing only headers.
     *
     * @param headers An array of strings to be used as column headers.
     * @param outputPath The file path where the template will be saved.
     * @returns The output path of the generated file.
     */
    public generateTemplate(headers: string[], outputPath: string): string {
        // We pass an array containing a single empty object, instructing json_to_sheet to only output headers.
        const worksheet = XLSX.utils.json_to_sheet([{}], { header: headers });
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
        XLSX.writeFile(workbook, outputPath);

        return outputPath;
    }


    generateTemplateAsBuffer(headers: string[]): Buffer {
        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet([headers]); // Use array of arrays for headers only
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
        
        // Generate buffer directly
        const buffer = XLSX.write(workbook, { 
            bookType: 'xlsx', 
            type: 'buffer' 
        });
        
        return buffer;
    }


    /**
     * 4️⃣ Exports an array of objects back into an Excel file.
     *
     * @param data The array of objects to export (keys become headers).
     * @param outputPath The file path where the data will be saved.
     * @returns The output path of the generated file.
     */
    public exportToExcel(data: ExcelRow[], outputPath: string): string {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, outputPath);

        return outputPath;
    }
}
