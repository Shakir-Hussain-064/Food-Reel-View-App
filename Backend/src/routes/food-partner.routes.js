const express = require('express');
const foodPartnerController = require("../controllers/food-partner.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/* GET /api/food-partner/me - Get current food partner profile */
router.get("/me", 
    authMiddleware.authFoodPartnerMiddleware,
    foodPartnerController.getCurrentFoodPartner);

/* GET /api/food-partner/:id - Get food partner by ID */
router.get("/:id",
    authMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartnerById);

module.exports = router;