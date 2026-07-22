import { adminAuth } from "../config/firebaseAdmin.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        code: "NO_TOKEN",
        message: "Không tìm thấy token",
      });
    }

    const decoded = await adminAuth.verifyIdToken(token);

    req.user = decoded;

    next();
  } catch (err) {
    console.log(err.code);

    if (err.code === "auth/id-token-expired") {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Token đã hết hạn",
      });
    }

    return res.status(401).json({
      success: false,
      code: "INVALID_TOKEN",
      message: "Token không hợp lệ",
    });
  }
};
