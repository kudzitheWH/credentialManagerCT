// src/middleware/auth.js
// ------------------------------------------------------
// Authentication + Role-based Authorization Middleware
// ------------------------------------------------------
// Protects routes with valid JWT tokens
// and enforces role-based access control.
// ------------------------------------------------------

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ------------------------------------------------------
// Middleware: Require a valid JWT in Authorization header
// ------------------------------------------------------
async function authRequired(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ msg: "Missing Authorization header." });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ msg: "Bad Authorization format. Use 'Bearer <token>'." });
    }

    //  Verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Fetch full user from DB (includes divisions/orgUnits)
    const user = await User.findById(decoded.id)
      .populate("divisions", "name")
      .populate("orgUnits", "name");

    if (!user) {
      return res.status(401).json({ msg: "User not found or deleted." });
    }

    //  Attach user object to request for downstream routes
    req.user = user;

    // Optional debug log (useful during development)
    // console.log(`Authenticated: ${user.name} (${user.role})`);
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ msg: "Invalid or expired token." });
  }
}

// ------------------------------------------------------
// Middleware: Restrict access to specific roles
// ------------------------------------------------------
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ msg: "Authentication required." });
      }

      //  Check role validity
      if (!allowedRoles.includes(req.user.role)) {
        console.warn(
          `Access denied: ${req.user.name} (${req.user.role}) tried to access restricted route`
        );
        return res
          .status(403)
          .json({ msg: "Access denied: insufficient permissions." });
      }

      next();
    } catch (err) {
      console.error("Role validation error:", err.message);
      return res.status(500).json({ msg: "Server error validating role." });
    }
  };
}

module.exports = {
  authRequired,
  requireRole,
};
