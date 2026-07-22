import express from "express";
import {
  getCustomers,
  createCustomer,
  deleteCustomerController,
  updateCustomerController,
} from "../controller/customer-master.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCustomers);
router.post("/create", verifyToken, createCustomer);
router.delete(
  "/delete/:cvCode/:shipToCode",
  verifyToken,
  deleteCustomerController,
);
router.put("/edit/:cvCode/:shipToCode", verifyToken, updateCustomerController);
export default router;
