import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";
import { loadProductMaster } from "./product.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(
          __dirname,
          "../master/productcode.xlsx"
      );

export const getAllProducts = async () => {
  const workbook = new ExcelJS.Workbook();

  
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(1);

  const products = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const productCode = row.getCell(4).text.trim();
    const productName = row.getCell(5).text.trim();
    const category = row.getCell(6).text.trim();

    if (!productCode) return;

    products.push({
      id: rowNumber,
      productCode,
      productName,
      category,
    });
  });

  return products;
};


//add product
export const createProductService = async (data) => {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);

    // Check trùng Product Code
    let existed = false;

    worksheet.eachRow((row, index) => {
        if (index === 1) return;

        const code = row.getCell(4).text.trim();

        if (
            code.toUpperCase() ===
            data.productCode.trim().toUpperCase()
        ) {
            existed = true;
        }
    });

    if (existed) {
        throw new Error("Product Code already exists");
    }

    // id = số dòng mới
    const newId = worksheet.rowCount + 1;

    worksheet.addRow([
        "",
        worksheet.rowCount,
        "",
        data.productCode,
        data.productName,
        data.category,
    ]);

    await workbook.xlsx.writeFile(filePath);

    await loadProductMaster();

    return {
        id: newId,
        ...data,
    };
};

//delete prodct
export const deleteProductService = async (id) => {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);

    // Không cho xóa header
    if (id <= 1) {
        throw new Error("Invalid row");
    }

    // Kiểm tra tồn tại
    if (id > worksheet.rowCount) {
        throw new Error("Product not found");
    }

    // Xóa 1 dòng
    worksheet.spliceRows(id, 1);

    await workbook.xlsx.writeFile(filePath);

    await loadProductMaster();

    return {
        message: "Delete success",
    };
};

//edit product
export const updateProductService = async (id, data) => {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);

    if (id <= 1 || id > worksheet.rowCount) {
        throw new Error("Product not found");
    }

    // Check Product Code trùng (trừ chính dòng đang sửa)
    worksheet.eachRow((row, index) => {
        if (index === 1 || index === id) return;

        const code = row.getCell(4).text.trim();

        if (
            code.toUpperCase() === data.productCode.trim().toUpperCase()
        ) {
            throw new Error("Product Code already exists");
        }
    });

    const row = worksheet.getRow(id);

    row.getCell(4).value = data.productCode;
    row.getCell(5).value = data.productName;
    row.getCell(6).value = data.category;

    row.commit();

    await workbook.xlsx.writeFile(filePath);

    await loadProductMaster();

    return {
        id,
        ...data,
    };
};