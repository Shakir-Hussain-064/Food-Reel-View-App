const express = require('express');
const foodPartnerController = require("../controllers/food-partner.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/* GET /api/food-partner/:id - Get food partner by ID */
router.get("/:id",
    authMiddleware.authAnyMiddleware,
    foodPartnerController.getFoodPartnerById);

module.exports = router;