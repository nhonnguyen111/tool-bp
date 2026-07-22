import fs from "fs";
import path from "path";
import fsExtra from "fs-extra";

import { readShipmentServices } from "../services/upload-shipment.js";
import { summarizeShipment } from "../services/shipment-summary.service.js";

import { generateWord } from "../services/word.service.js";
import { generateExcel } from "../services/excel.service.js";

import { convertFolderToPdf } from "../services/pdf.service.js";
import { zipFolder } from "../services/zip.service.js";

import { exportMissingProducts } from "../services/export-missing-product.service.js";
import { exportMissingCustomers } from "../services/export-missing-customer.service.js";

export const uploadShipmentController = async (req, res, next) => {
  try {
    // ==================================================
    // Đọc file Shipment
    // ==================================================
    const shipments = await readShipmentServices(req.file);

    // Tổng hợp dữ liệu
    const summary = summarizeShipment(shipments);

    // Xóa thư mục output cũ
    await fsExtra.emptyDir("./output");

    // ==================================================
    // Sinh Word từng khách
    // ==================================================
    for (const customer of summary) {
      const buffer = await generateWord(customer);

      const docxPath = path.join(
        "./output",
        `${customer.licensePlate}-${customer.shipToCode}.docx`,
      );

      fs.writeFileSync(docxPath, buffer);
    }

    // ==================================================
    // Sinh Excel tổng hợp
    // ==================================================
    if (summary.length > 0) {
      await generateExcel(summary);
    }

    // ==================================================
    // Danh sách khách chưa có Master
    // ==================================================
    const missingCustomers = summary.filter((x) => !x.found);

    if (missingCustomers.length > 0) {
      await exportMissingCustomers(
        missingCustomers,
        path.join("./output", "KhachHangChuaCoMaster.xlsx"),
      );
    }

    // ==================================================
    // Danh sách sản phẩm chưa có nhóm
    // ==================================================
    const noCategoryProducts = [];
    const productSet = new Set();

    for (const item of shipments) {
      if (
        !item.category ||
        item.category.trim() === "" ||
        item.category === "Chưa có nhóm"
      ) {
        if (!productSet.has(item.productCode)) {
          productSet.add(item.productCode);

          noCategoryProducts.push({
            productCode: item.productCode,
            productName: item.productName,
          });
        }
      }
    }

    if (noCategoryProducts.length > 0) {
      await exportMissingProducts(
        noCategoryProducts,
        path.join("./output", "SanPhamChuaCoNhom.xlsx"),
      );
    }

    // ==================================================
    // Convert Word -> PDF
    // ==================================================
    await convertFolderToPdf(path.resolve("./output"));

    // ==================================================
    // Xóa Word sau khi convert
    // ==================================================
    const files = fs.readdirSync("./output");

    for (const file of files) {
      if (file.endsWith(".docx")) {
        fs.unlinkSync(path.join("./output", file));
      }
    }

    // ==================================================
    // Tạo file ZIP
    // ==================================================
    const zipPath = path.join("./output", "KiemDich.zip");

    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }

    await zipFolder("./output", zipPath);

    // ==================================================
    // Response
    // ==================================================
    return res.json({
      success: true,
      summary,
      missingCustomers: missingCustomers.length,
      missingProducts: noCategoryProducts.length,
      downloadUrl: "/output/KiemDich.zip",
    });
  } catch (err) {
    next(err);
  }
};
