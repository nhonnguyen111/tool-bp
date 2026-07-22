import fs from "fs";
import path from "path";
import crypto from "crypto";
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
    //==================================================
    // Đọc Shipment
    //==================================================

    const shipments = await readShipmentServices(req.file);

    const summary = summarizeShipment(shipments);

    //==================================================
    // Tạo thư mục riêng cho request
    //==================================================

    const requestId = Date.now() + "-" + crypto.randomUUID().substring(0, 8);

    const outputDir = path.join("./output", requestId);

    await fsExtra.ensureDir(outputDir);

    //==================================================
    // Sinh Word
    //==================================================

    for (const customer of summary) {
      const buffer = await generateWord(customer);

      fs.writeFileSync(
        path.join(
          outputDir,
          `${customer.licensePlate}-${customer.shipToCode}.docx`,
        ),
        buffer,
      );
    }

    //==================================================
    // Sinh Excel tổng hợp
    //==================================================

    if (summary.length > 0) {
      await generateExcel(summary, outputDir);
    }

    //==================================================
    // Khách chưa có Master
    //==================================================

    const missingCustomers = summary.filter((x) => !x.found);

    if (missingCustomers.length > 0) {
      await exportMissingCustomers(
        missingCustomers,
        path.join(outputDir, "KhachHangChuaCoMaster.xlsx"),
      );
    }

    //==================================================
    // Sản phẩm chưa có nhóm
    //==================================================

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
        path.join(outputDir, "SanPhamChuaCoNhom.xlsx"),
      );
    }

    //==================================================
    // Convert PDF
    // Chỉ chạy trên Windows có Word
    //==================================================

    if (process.platform === "win32") {
      await convertFolderToPdf(path.resolve(outputDir));

      const files = fs.readdirSync(outputDir);

      for (const file of files) {
        if (file.endsWith(".docx")) {
          fs.unlinkSync(path.join(outputDir, file));
        }
      }
    }

    //==================================================
    // Tạo ZIP
    //==================================================

    const zipPath = path.join(outputDir, "KiemDich.zip");

    await zipFolder(outputDir, zipPath);

    //==================================================
    // Tự xóa sau 15 phút
    //==================================================

    setTimeout(
      async () => {
        try {
          await fsExtra.remove(outputDir);
        } catch (err) {
          console.error(err);
        }
      },
      15 * 60 * 1000,
    );

    //==================================================
    // Response
    //==================================================

    return res.json({
      success: true,
      summary,
      missingCustomers: missingCustomers.length,
      missingProducts: noCategoryProducts.length,
      downloadUrl: `/output/${requestId}/KiemDich.zip`,
    });
  } catch (err) {
    next(err);
  }
};
