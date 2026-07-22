import express from "express";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controller/product-master.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/create", verifyToken, createProduct);
router.delete("/:id", verifyToken, deleteProduct);
router.put("/:id", verifyToken, updateProduct);
export default router;
