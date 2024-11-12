"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelController = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const slugify_1 = require("../utils/slugify");
const uuid_1 = require("uuid");
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const HOTELS_DIR = path_1.default.join(__dirname, '../../data/hotels');
const IMAGES_DIR = path_1.default.join(__dirname, '../../uploads/images');
class HotelController {
    // Get all hotels
    getAllHotels(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create hotels directory if it doesn't exist
                yield promises_1.default.mkdir(HOTELS_DIR, { recursive: true });
                // Read all files in the hotels directory
                const files = yield promises_1.default.readdir(HOTELS_DIR);
                // Read and parse each hotel file
                const hotels = yield Promise.all(files
                    .filter(file => file.endsWith('.json'))
                    .map((file) => __awaiter(this, void 0, void 0, function* () {
                    const filePath = path_1.default.join(HOTELS_DIR, file);
                    const hotelData = yield promises_1.default.readFile(filePath, 'utf-8');
                    return JSON.parse(hotelData);
                })));
                res.json(hotels);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to retrieve hotels' });
            }
        });
    }
    // Create new hotel
    createHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelData = req.body;
                const id = (0, uuid_1.v4)();
                const slug = (0, slugify_1.createSlug)(hotelData.title);
                // Validate required fields
                if (!hotelData.title || !hotelData.description) {
                    res.status(400).json({ error: 'Missing required fields' });
                    return;
                }
                const hotel = Object.assign(Object.assign({}, hotelData), { id,
                    slug, images: [] });
                // Create hotels directory if it doesn't exist
                yield promises_1.default.mkdir(HOTELS_DIR, { recursive: true });
                // Save hotel data
                yield promises_1.default.writeFile(path_1.default.join(HOTELS_DIR, `${id}.json`), JSON.stringify(hotel, null, 2));
                res.status(201).json(hotel);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create hotel' });
            }
        });
    }
    // Get hotel by ID
    getHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId } = req.params;
                const filePath = path_1.default.join(HOTELS_DIR, `${hotelId}.json`);
                const hotelData = yield promises_1.default.readFile(filePath, 'utf-8');
                const hotel = JSON.parse(hotelData);
                res.json(hotel);
            }
            catch (error) {
                res.status(404).json({ error: 'Hotel not found' });
            }
        });
    }
    // Update hotel
    updateHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId } = req.params;
                const updateData = req.body;
                const filePath = path_1.default.join(HOTELS_DIR, `${hotelId}.json`);
                const hotelData = yield promises_1.default.readFile(filePath, 'utf-8');
                const hotel = JSON.parse(hotelData);
                const updatedHotel = Object.assign(Object.assign(Object.assign({}, hotel), updateData), { id: hotel.id, slug: updateData.title ? (0, slugify_1.createSlug)(updateData.title) : hotel.slug });
                yield promises_1.default.writeFile(filePath, JSON.stringify(updatedHotel, null, 2));
                res.json(updatedHotel);
            }
            catch (error) {
                res.status(404).json({ error: 'Hotel not found' });
            }
        });
    }
    // Upload images
    uploadImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId } = req.body;
                const files = req.files;
                if (!files || files.length === 0) {
                    res.status(400).json({ error: 'No files uploaded' });
                    return;
                }
                // Validate hotel exists
                const hotelFilePath = path_1.default.join(HOTELS_DIR, `${hotelId}.json`);
                if (!(yield fileExists(hotelFilePath))) {
                    res.status(404).json({ error: 'Hotel not found' });
                    return;
                }
                // Create uploads directory if it doesn't exist
                yield promises_1.default.mkdir(IMAGES_DIR, { recursive: true });
                // Read existing hotel data
                const hotelData = yield promises_1.default.readFile(hotelFilePath, 'utf-8');
                const hotel = JSON.parse(hotelData);
                // Process and save images
                const imageUrls = yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                    // Validate file type
                    if (!isValidImageType(file.mimetype)) {
                        throw new Error(`Invalid file type: ${file.mimetype}`);
                    }
                    // Create unique filename
                    const fileName = `${(0, uuid_1.v4)()}-${sanitizeFilename(file.originalname)}`;
                    const filePath = path_1.default.join(IMAGES_DIR, fileName);
                    // Save file
                    yield promises_1.default.writeFile(filePath, file.buffer);
                    // Create and return full URL
                    const imageUrl = new URL(`/images/${fileName}`, BASE_URL).toString();
                    return {
                        url: imageUrl,
                        filename: fileName,
                        originalName: file.originalname,
                        mimeType: file.mimetype
                    };
                })));
                // Update hotel with new image information
                hotel.images = [
                    ...(hotel.images || []),
                    ...imageUrls.map(img => ({
                        url: img.url,
                        filename: img.filename,
                        originalName: img.originalName,
                        mimeType: img.mimeType,
                        uploadedAt: new Date().toISOString()
                    }))
                ];
                // Save updated hotel data
                yield promises_1.default.writeFile(hotelFilePath, JSON.stringify(hotel, null, 2));
                // Return success response
                res.status(200).json({
                    success: true,
                    message: 'Images uploaded successfully',
                    hotelId,
                    uploadedImages: imageUrls
                });
            }
            catch (error) {
                console.error('Error uploading images:', error);
                res.status(500).json({
                    error: 'Failed to upload images',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
}
exports.HotelController = HotelController;
// Helper functions
function fileExists(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield promises_1.default.access(path);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
function isValidImageType(mimeType) {
    const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ];
    return validTypes.includes(mimeType);
}
function sanitizeFilename(filename) {
    return filename
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '-')
        .replace(/-+/g, '-');
}
