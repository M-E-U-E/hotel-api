import { Router } from 'express';
import { HotelController } from '../controllers/hotelController';
import multer from 'multer';

const router = Router();
const hotelController = new HotelController();
const upload = multer({ storage: multer.memoryStorage() });

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

export default router;