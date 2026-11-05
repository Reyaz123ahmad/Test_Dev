const express = require("express");
const router = express.Router();
const { createUser, getUser, updateUser, deleteUser, blockUser, unblockUser, getUsersCount , getAllUsers } = require("../controller/user_controller");
const { authMiddleware, isAdmin } = require("../middleware/auth_middleware");


router.post("/create", authMiddleware, isAdmin, createUser);
router.get("/allGet", authMiddleware, isAdmin, getAllUsers)
router.get("/count", authMiddleware, isAdmin, getUsersCount);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.put("/:id", authMiddleware, isAdmin, updateUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

router.put("/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;