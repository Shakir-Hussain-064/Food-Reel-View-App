const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    // Derive a filename with extension to ensure correct content-type on CDN
    const originalName = (req.file && req.file.originalname) || "upload"
    const ext = originalName.includes('.') ? originalName.substring(originalName.lastIndexOf('.')) : ''
    const fileNameWithExt = `${uuid()}${ext}`
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, fileNameWithExt)

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price) || 0,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem,
        foodPartnerId: req.foodPartner._id // Include the food partner ID in the response
    })

}

async function getFoodItems(req, res) {
    try {
        const foodItems = await foodModel.find({}, 'name description video foodPartner likeCount savesCount'); // Include like and save counts
        res.status(200).json({
            message: "Food items fetched successfully",
            food: foodItems
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch food items",
            error: error.message
        });
    }
}

async function getFoodById(req, res) {
    try {
        const { id } = req.params;
        const foodItem = await foodModel.findById(id).populate('foodPartner', 'name');
        
        if (!foodItem) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        res.status(200).json({
            message: "Food item fetched successfully",
            food: foodItem
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch food item",
            error: error.message
        });
    }
}


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    try {
        // Check if food exists
        const foodItem = await foodModel.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        const isAlreadyLiked = await likeModel.findOne({
            user: user._id,
            food: foodId
        });

        if (isAlreadyLiked) {
            // User has already liked this food, so unlike it
            await likeModel.deleteOne({
                user: user._id,
                food: foodId
            });

            // Only decrement if count is greater than 0
            if (foodItem.likeCount > 0) {
                const updatedFood = await foodModel.findByIdAndUpdate(foodId, {
                    $inc: { likeCount: -1 }
                }, { new: true });

                return res.status(200).json({
                    message: "Food unliked successfully",
                    like: false,
                    likeCount: updatedFood.likeCount
                });
            } else {
                return res.status(200).json({
                    message: "Food unliked successfully",
                    like: false,
                    likeCount: 0
                });
            }
        }

        // User hasn't liked this food yet, so create a like
        const like = await likeModel.create({
            user: user._id,
            food: foodId
        });

        const updatedFood = await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: 1 }
        }, { new: true });

        return res.status(201).json({
            message: "Food liked successfully",
            like: true,
            likeCount: updatedFood.likeCount
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to like/unlike food",
            error: error.message
        });
    }
}


async function saveFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    try {
        // Check if food exists
        const foodItem = await foodModel.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        const isAlreadySaved = await saveModel.findOne({
            user: user._id,
            food: foodId
        });

        if (isAlreadySaved) {
            // User has already saved this food, so unsave it
            await saveModel.deleteOne({
                user: user._id,
                food: foodId
            });

            // Only decrement if count is greater than 0
            if (foodItem.savesCount > 0) {
                const updatedFood = await foodModel.findByIdAndUpdate(foodId, {
                    $inc: { savesCount: -1 }
                }, { new: true });

                return res.status(200).json({
                    message: "Food unsaved successfully",
                    save: false,
                    savesCount: updatedFood.savesCount
                });
            } else {
                return res.status(200).json({
                    message: "Food unsaved successfully",
                    save: false,
                    savesCount: 0
                });
            }
        }

        // User hasn't saved this food yet, so save it
        const save = await saveModel.create({
            user: user._id,
            food: foodId
        });

        const updatedFood = await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: 1 }
        }, { new: true });

        return res.status(201).json({
            message: "Food saved successfully",
            save: true,
            savesCount: updatedFood.savesCount
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to save/unsave food",
            error: error.message
        });
    }
}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });

}


module.exports = {
    createFood,
    getFoodItems,
    getFoodById,
    likeFood,
    saveFood,
    getSaveFood
}