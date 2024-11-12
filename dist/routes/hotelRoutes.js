"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hotelController_1 = require("../controllers/hotelController");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const hotelController = new hotelController_1.HotelController();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Get all hotels
router.get('/hotels', hotelController.getAllHotels.bind(hotelController));
// Create new hotel
router.post('/hotels', hotelController.createHotel.bind(hotelController));
// Get hotel by ID
router.get('/hotels/:hotelId', hotelController.getHotel.bind(hotelController));
// Update hotel
router.put('/hotels/:hotelId', hotelController.updateHotel.bind(hotelController));
// Upload images
router.post('/images', upload.array('images'), hotelController.uploadImages.bind(hotelController));
exports.default = router;
