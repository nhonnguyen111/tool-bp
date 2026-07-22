import express from "express";
import multerUpload from "../config/multer.js";
import { uploadShipmentController } from "../controller/upload-shipment.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  multerUpload.single("file"),
  uploadShipmentController,
);

export default router;
