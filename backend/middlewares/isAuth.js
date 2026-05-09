import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const headers = req.headers;

    if (!headers.authorization) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in isAuth", error.message);
    return res.status(500).json({ success: false, message: "JWT ERROR!" });
  }
};
