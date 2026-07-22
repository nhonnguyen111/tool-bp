import {
  getAllCustomer,
  createCustomerService,
  deleteCustomerService,
  updateCustomerService,
} from "../services/customer-master.service.js";

export const getCustomers = async (req, res) => {
  try {
    const data = await getAllCustomer();

    return res.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
//add customer
export const createCustomer = async (req, res) => {
  try {
    const result = await createCustomerService(req.body);

    return res.json({
      success: true,
      message: "Create success",
      data: result,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteCustomerController = async (req, res) => {
  try {
    const { cvCode, shipToCode } = req.params;

    const result = await deleteCustomerService(cvCode, shipToCode);

    return res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateCustomerController = async (req, res) => {
  try {
    const { cvCode, shipToCode } = req.params;

    const result = await updateCustomerService(cvCode, shipToCode, req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
