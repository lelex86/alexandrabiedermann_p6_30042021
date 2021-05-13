const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const userCtrl = require("../controllers/user");
const limit = require("../middleware/limit");

router.post("/signup", limit.createAccountLimiter, userCtrl.signup);
router.post("/login", limit.loginLimiter, userCtrl.login);
router.put("/:id", auth, limit.apiLimiter, userCtrl.modifyUser);
router.delete("/:id", auth, limit.apiLimiter, userCtrl.deleteUser);
router.get("/:id", auth, limit.apiLimiter, userCtrl.getUser);

module.exports = router;
