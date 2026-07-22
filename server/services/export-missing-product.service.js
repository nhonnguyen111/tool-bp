import ExcelJS from "exceljs";

export async function exportMissingProducts(products, filePath) {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Missing Products");

  worksheet.columns = [
    {
      header: "STT",
      key: "stt",
      width: 10,
    },
    {
      header: "Product Code",
      key: "productCode",
      width: 25,
    },
    {
      header: "Product Name",
      key: "productName",
      width: 60,
    },
  ];

  // Header đậm
  worksheet.getRow(1).font = {
    bold: true,
  };

  products.forEach((item, index) => {
    worksheet.addRow({
      stt: index + 1,
      productCode: item.productCode,
      productName: item.productName,
    });
  });

  await workbook.xlsx.writeFile(filePath);
}
