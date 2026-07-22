import ExcelJS from "exceljs";

export const readShipmentServices = async (file) => {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(file.buffer);

    const worksheet = workbook.getWorksheet(1);

    const shipments = [];

    worksheet.eachRow((row, index) => {
        if (index === 1) return;

        shipments.push({
            orgCode: row.getCell(1).text,
            depot: row.getCell(2).text,
            cvCode: row.getCell(3).text,
            cvName: row.getCell(4).text,
            shipToCode: row.getCell(5).text,
            shipToName: row.getCell(6).text,
            deliveryDate: row.getCell(7).text,
            docNumber: row.getCell(8).text,
            productCode: row.getCell(9).text,
            productName: row.getCell(10).text,
            item: row.getCell(11).text,
            quantity: Number(row.getCell(12).value),
            quantityUnit: row.getCell(13).text,
            weight: Number(row.getCell(14).value),
            licensePlate: row.getCell(15).text,
            truckType: row.getCell(16).text,
            driverName: row.getCell(17).text,
            shipmentNo: row.getCell(18).text,
        });
    });

    return shipments;
};