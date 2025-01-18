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
      // console.log("Authenticating request...");
      // console.log("Required role:", requiredRole);
      // console.log("Request headers:", req.headers);
      const token =
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
          ? req.headers.authorization.split(" ")[1]
          : null;
      if (!token) {
        return res
          .status(401)
          .json({ message: "Authentication token is missing" });
      }

      const verified = jwt.verify(token, secretKey);
      req.userData = verified;
      console.log("Token verified, user data:", req.userData);

      if (requiredRole && !requiredRole.includes(req.userData.userType)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role" });
      }

/*       if (requiredRole && req.userData.userType !== requiredRole) {
        console.log("Forbidden: Insufficient role");
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role" });
      } */

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
  return res.status(401).json({ message: "Token has expired" });
}
return res.status(401).json({ message: "Authentication failed", error: error.message });

/*       console.log("Authentication failed:", error.message);
      return res
        .status(401)
        .json({ message: "Authentication failed", error: error.message });
    } */
  };
}
}
