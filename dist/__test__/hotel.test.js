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
// File: src/__tests__/hotel.test.ts
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
describe('Hotel API', () => {
    const testHotel = {
        title: 'Test Hotel',
        description: 'A test hotel',
        guestCount: 4,
        bedroomCount: 2,
        bathroomCount: 2,
        amenities: ['wifi', 'parking'],
        host: {
            name: 'John Doe',
            email: 'john@example.com',
        },
        address: '123 Test St',
        latitude: 40.7128,
        longitude: -74.0060,
        rooms: [],
    };
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up test data
        try {
            const hotelFiles = yield promises_1.default.readdir(path_1.default.join(__dirname, '../../data/hotels'));
            for (const file of hotelFiles) {
                if (file.endsWith('.json')) {
                    yield promises_1.default.unlink(path_1.default.join(__dirname, '../../data/hotels', file));
                }
            }
        }
        catch (error) {
            console.error('Cleanup error:', error);
        }
    }));
    test('POST /api/hotel - Create new hotel', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/hotel')
            .send(testHotel);
        expect(response.status).toBe(201);
        expect(response.body.title).toBe(testHotel.title);
        expect(response.body.slug).toBe('test-hotel');
    }));
    test('GET /api/hotel/:hotelId - Get hotel details', () => __awaiter(void 0, void 0, void 0, function* () {
        // First create a hotel
        const createResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/api/hotel')
            .send(testHotel);
        const hotelId = createResponse.body.id;
        // Then get its details
        const getResponse = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/hotel/${hotelId}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.title).toBe(testHotel.title);
    }));
});
