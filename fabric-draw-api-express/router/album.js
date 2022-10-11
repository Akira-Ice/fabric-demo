const express = require("express");
const albumCtrl = require("../controller/album");

const router = express.Router();

router.post("/getAll", albumCtrl.getAll);
router.post("/save", albumCtrl.save);
router.post("/removeById", albumCtrl.removeById);
router.post("/modifyById", albumCtrl.modifyById);

module.exports = router;
