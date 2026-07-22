import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";
import { loadCustomerMaster } from "./customer.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../master/customer.xlsx");

export const getAllCustomer = async () => {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(1);

  const customers = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const cvCode = row.getCell(1).text.trim();
    const cvName = row.getCell(3).text.trim();
    const shipToCode = row.getCell(2).text.trim();
    const address = row.getCell(4).text.trim();
    if (!cvCode) return;

    customers.push({
      id: rowNumber,
      cvCode,
      cvName,
      shipToCode,
      address,
    });
  });

  return customers;
};

// add customer
export const createCustomerService = async (data) => {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(1);

  let existed = false;

  worksheet.eachRow((row, index) => {
    if (index === 1) return;

    const cvCode = row.getCell(1).text.trim().toUpperCase();
    const shipToCode = row.getCell(2).text.trim().toUpperCase();

    if (
      cvCode === data.cvCode.trim().toUpperCase() &&
      shipToCode === data.shipToCode.trim().toUpperCase()
    ) {
      existed = true;
    }
  });

  if (existed) {
    throw new Error("Customer + ShipTo already exists");
  }

  worksheet.addRow([data.cvCode, data.shipToCode, data.cvName, data.address]);

  await workbook.xlsx.writeFile(filePath);

  await loadCustomerMaster();

  return data;
};

//delete customer
export const deleteCustomerService = async (cvCode, shipToCode) => {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(1);

  let rowNumber = -1;

  worksheet.eachRow((row, index) => {
    if (index === 1) return;

    const excelCvCode = row.getCell(1).text.trim().toUpperCase();
    const excelShipTo = row.getCell(2).text.trim().toUpperCase();

    if (
      excelCvCode === cvCode.trim().toUpperCase() &&
      excelShipTo === shipToCode.trim().toUpperCase()
    ) {
      rowNumber = index;
    }
  });

  if (rowNumber === -1) {
    throw new Error("Customer not found");
  }

  worksheet.spliceRows(rowNumber, 1);

  await workbook.xlsx.writeFile(filePath);

  await loadCustomerMaster();

  return {
    success: true,
    message: "Delete customer successfully",
  };
};

//edit customer
export const updateCustomerService = async (oldCvCode, oldShipToCode, data) => {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(1);

  let targetRow = null;

  // tìm dòng cần sửa
  worksheet.eachRow((row, index) => {
    if (index === 1) return;

    const cvCode = row.getCell(1).text.trim().toUpperCase();
    const shipToCode = row.getCell(2).text.trim().toUpperCase();

    if (
      cvCode === oldCvCode.trim().toUpperCase() &&
      shipToCode === oldShipToCode.trim().toUpperCase()
    ) {
      targetRow = row;
    }
  });

  if (!targetRow) {
    throw new Error("Customer not found");
  }

  // nếu đổi cvCode hoặc shipTo thì kiểm tra trùng
  worksheet.eachRow((row, index) => {
    if (index === 1) return;

    if (row === targetRow) return;

    const cvCode = row.getCell(1).text.trim().toUpperCase();
    const shipToCode = row.getCell(2).text.trim().toUpperCase();

    if (
      cvCode === data.cvCode.trim().toUpperCase() &&
      shipToCode === data.shipToCode.trim().toUpperCase()
    ) {
      throw new Error("Customer + ShipTo already exists");
    }
  });

  // update
  targetRow.getCell(1).value = data.cvCode;
  targetRow.getCell(2).value = data.shipToCode;
  targetRow.getCell(3).value = data.cvName;
  targetRow.getCell(4).value = data.address;

  await workbook.xlsx.writeFile(filePath);

  await loadCustomerMaster();

  return data;
};
