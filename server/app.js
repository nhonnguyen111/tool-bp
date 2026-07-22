import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import shipmentRoutes from "./route/upload-shipment.js";
import { loadProductMaster } from "./services/product.service.js";
import { loadCustomerMaster } from "./services/customer.service.js";
import productMasterRoute from "./route/product-master.route.js";
import customerMasterRoute from "./route/customer-master.router.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Shipment Tool API is running...",
  });
});

app.use("/api/v1/shipment", shipmentRoutes);

app.use("/output", express.static("output"));
app.use("/api/v1/master/products", productMasterRoute);
app.use("/api/v1/master/customers", customerMasterRoute);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Not Found",
  });
});
await loadProductMaster();
await loadCustomerMaster();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running ${PORT}`);
});
