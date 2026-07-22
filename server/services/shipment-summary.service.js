import { productMap } from "./product.service.js";
import { customerMap as customerMaster } from "./customer.service.js";

export function summarizeShipment(shipments) {
  const customerMap = new Map();

  // ==========================
  // BƯỚC 1: SUMMARY SHIPMENT
  // ==========================

  for (const item of shipments) {
    const category = productMap.get(item.productCode) || "Chưa có nhóm";

    if (!customerMap.has(item.shipToCode)) {
      customerMap.set(item.shipToCode, {
        // Tạm lấy dữ liệu từ file shipment
        cvCode: item.cvCode || "",
        cvName: item.cvName || "",
        address: item.shipToName || "",

        shipToCode: item.shipToCode,

        deliveryDate: item.deliveryDate,
        licensePlate: item.licensePlate,
        truckType: item.truckType,
        driverName: item.driverName,

        docNumbers: new Set(),

        totalQuantity: 0,
        totalWeight: 0,

        categories: new Map(),
      });
    }

    const customer = customerMap.get(item.shipToCode);

    customer.docNumbers.add(item.docNumber);

    customer.totalQuantity += Number(item.quantity || 0);
    customer.totalWeight += Number(item.weight || 0);

    if (!customer.categories.has(category)) {
      customer.categories.set(category, {
        category,
        quantity: 0,
        weight: 0,
        products: [],
      });
    }

    const group = customer.categories.get(category);

    group.quantity += Number(item.quantity || 0);
    group.weight += Number(item.weight || 0);

    group.products.push({
      productCode: item.productCode,
      productName: item.productName,
      quantity: item.quantity,
      weight: item.weight,
    });
  }

  // Chuyển Map -> Array
  const result = [...customerMap.values()].map((customer) => ({
    ...customer,
    docNumbers: [...customer.docNumbers],
    categories: [...customer.categories.values()],
  }));

  // ==========================
  // BƯỚC 2: MERGE CUSTOMER MASTER
  // ==========================

  for (const customer of result) {
    const master = customerMaster.get(customer.shipToCode);

    // Lưu trạng thái tìm thấy hay không
    customer.found = !!master;

    if (master) {
      customer.cvCode = master.cvCode;
      customer.cvName = master.cvName;
      customer.address = master.address;
    }

    console.log({
      shipToCode: customer.shipToCode,
      found: customer.found,
      cvName: customer.cvName,
      address: customer.address,
    });
  }

  return result;
}
