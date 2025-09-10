const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');

async function getFoodPartnerById(req, res) {

    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId)
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId })

    if (!foodPartner) {
        return res.status(404).json({ message: "Food partner not found" });
    }

    res.status(200).json({
        message: "Food partner retrieved successfully",
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }

    });
}

async function getCurrentFoodPartner(req, res) {
    try {
        // The food partner will be available from the auth middleware
        if (!req.foodPartner) {
            return res.status(401).json({ message: "Not authenticated as a food partner" });
        }

        const foodPartner = req.foodPartner;
        
        res.status(200).json({
            message: "Current food partner retrieved successfully",
            foodPartner: {
                _id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email,
                phone: foodPartner.phone,
                address: foodPartner.address,
                contactName: foodPartner.contactName
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving current food partner", error: error.message });
    }
}

module.exports = {
    getFoodPartnerById,
    getCurrentFoodPartner
};