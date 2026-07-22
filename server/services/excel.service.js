import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { numberToVietnameseWords } from "../utils/fomatText.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateExcel(customers) {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(path.join(__dirname, "../template/KD.xlsx"));

  const sheet = workbook.getWorksheet("MẪU");

  let row = 2;

  for (const customer of customers) {
    const c1 = customer.categories?.[0];
    const c2 = customer.categories?.[1];
    const c3 = customer.categories?.[2];

    sheet.getCell(`B${row}`).value = c1?.category ?? "";
    sheet.getCell(`C${row}`).value = c2?.category ?? "";
    sheet.getCell(`D${row}`).value = c3?.category ?? "";

    sheet.getCell(`E${row}`).value = c1?.quantity ?? "";
    sheet.getCell(`F${row}`).value = c2?.quantity ?? "";
    sheet.getCell(`G${row}`).value = c3?.quantity ?? "";

    sheet.getCell(`H${row}`).value = "Thực Phẩm";

    sheet.getCell(`I${row}`).value = customer.totalWeight;

    sheet.getCell(`J${row}`).value = numberToVietnameseWords(
      customer.totalWeight,
    );

    sheet.getCell(`K${row}`).value = customer.cvName;

    sheet.getCell(`L${row}`).value = customer.address;

    sheet.getCell(`N${row}`).value = customer.licensePlate;

    const date = new Date(customer.deliveryDate);

    sheet.getCell(`Q${row}`).value =
      `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

    row++;
  }

  await workbook.xlsx.writeFile("./output/KiemDichTongHop.xlsx");
}
