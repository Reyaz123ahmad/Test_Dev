const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth_middleware");
const { createAdmin, loginUser, adminProfile, chnagePassword } = require("../controller/auth_controller");

router.post("/register", createAdmin);
router.post("/login", loginUser);
router.get("/admin/profile", authMiddleware, adminProfile);

router.put("/change-password", authMiddleware, chnagePassword);
module.exports = router;