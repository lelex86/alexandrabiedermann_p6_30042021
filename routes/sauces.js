const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const limit = require("../middleware/limit");

const sauceCtrl = require("../controllers/sauces");

router.get("/", auth, limit.apiLimiter, sauceCtrl.getAllSauces);
router.post("/", auth, limit.apiLimiter, multer, sauceCtrl.createSauce);
router.get("/:id", auth, limit.apiLimiter, sauceCtrl.getOneSauce);
router.put("/:id", auth, limit.apiLimiter, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, limit.apiLimiter, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, limit.apiLimiter, sauceCtrl.likeSauce);

module.exports = router;
