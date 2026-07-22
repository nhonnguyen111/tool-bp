import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const customerMap = new Map();
export async function loadCustomerMaster() {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(
        path.join(__dirname, "../master/customer.xlsx")
    );

    const worksheet = workbook.getWorksheet(1);

    

    worksheet.eachRow((row, index) => {
        if (index === 1) return;

        const cvCode = row.getCell(1).text.trim();
        const shipTo = row.getCell(2).text.trim();
        const cvName = row.getCell(3).text.trim();
        const address = row.getCell(4).text.trim();

        if (!cvCode || !shipTo) return;

        const shipToCode = `${cvCode}-${shipTo}`;

        customerMap.set(shipToCode, {
            cvCode,
            shipTo,
            cvName,
            address,
        });
    });


    return customerMap;
}