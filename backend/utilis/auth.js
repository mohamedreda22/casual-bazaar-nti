const jwt = require("jsonwebtoken");
const secretKey =
  "1X]_J(eI|%+gGI{GF,]-AvkGY*?6qMDTcqkBnR#DIfu;p}g*j=xLzaAI*A`C:";

exports.generateToken = (user) => {
  console.log("Generating token for user:", user);
  return jwt.sign(user, secretKey, { expiresIn: "1h" });
};

exports.authMW = (requiredRole) => {
  return (req, res, next) => {
    try {
      console.log("Authenticating request...");
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.log("Authentication token is missing");
        return res
          .status(401)
          .json({ message: "Authentication token is missing" });
      }

      const verified = jwt.verify(token, secretKey);
      req.userData = verified;
      console.log("Token verified, user data:", req.userData);

      if (requiredRole && req.userData.userType !== requiredRole) {
        console.log("Forbidden: Insufficient role");
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role" });
      }

      next();
    } catch (error) {
      console.log("Authentication failed:", error.message);
      return res
        .status(401)
        .json({ message: "Authentication failed", error: error.message });
    }
  };
};
