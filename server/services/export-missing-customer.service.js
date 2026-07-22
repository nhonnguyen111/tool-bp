import ExcelJS from "exceljs";

export async function exportMissingCustomers(customers, outputPath) {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Missing Customer");

  sheet.columns = [
    { header: "ShipTo Code", key: "shipToCode", width: 20 },
    { header: "CV Code", key: "cvCode", width: 20 },
    { header: "CV Name", key: "cvName", width: 35 },
    { header: "Address", key: "address", width: 45 },
    { header: "License Plate", key: "licensePlate", width: 18 },
  ];

  customers.forEach((item) => {
    sheet.addRow({
      shipToCode: item.shipToCode,
      cvCode: item.cvCode,
      cvName: item.cvName,
      address: item.address,
      licensePlate: item.licensePlate,
    });
  });

  await workbook.xlsx.writeFile(outputPath);
}
