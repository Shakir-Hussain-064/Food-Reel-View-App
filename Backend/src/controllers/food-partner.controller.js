const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');
const mongoose = require('mongoose');

async function getFoodPartnerById(req, res) {
    const foodPartnerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(foodPartnerId)) {
        return res.status(400).json({ message: "Invalid food partner id" });
    }

    try {
        const foodPartner = await foodPartnerModel.findById(foodPartnerId);
        if (!foodPartner) {
            return res.status(404).json({ message: "Food partner not found" });
        }

        const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });

        res.status(200).json({
            message: "Food partner retrieved successfully",
            foodPartner: {
                ...foodPartner.toObject(),
                foodItems: foodItemsByFoodPartner
            }
        });
    } catch (err) {
        console.error("getFoodPartnerById error:", err);
        res.status(500).json({ message: "Failed to retrieve food partner" });
    }
}

module.exports = {
    getFoodPartnerById
};