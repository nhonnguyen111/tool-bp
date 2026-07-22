import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workbook = new ExcelJS.Workbook();

export const productMap = new Map();

export async function loadProductMaster() {

    const filePath = path.join(
        __dirname,
        "../master/productcode.xlsx"
    );

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);

    let totalRows = 0;

worksheet.eachRow((row, index) => {

    if (index === 1) return;

    totalRows++;

    const productCode = row.getCell(4).text.trim(); // D
    const category = row.getCell(6).text.trim();    // F

    if (!productCode) return;

    productMap.set(productCode, category);

});

console.log("Total rows:", totalRows);
console.log("Unique product:", productMap.size);
}