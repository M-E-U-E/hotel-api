// File: src/__tests__/hotel.test.ts
import request from 'supertest';
import app from '../app';
import fs from 'fs/promises';
import path from 'path';

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

  afterEach(async () => {
    // Clean up test data
    try {
      const hotelFiles = await fs.readdir(path.join(__dirname, '../../data/hotels'));
      for (const file of hotelFiles) {
        if (file.endsWith('.json')) {
          await fs.unlink(path.join(__dirname, '../../data/hotels', file));
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  });

  test('POST /api/hotel - Create new hotel', async () => {
    const response = await request(app)
      .post('/api/hotel')
      .send(testHotel);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(testHotel.title);
    expect(response.body.slug).toBe('test-hotel');
  });

  test('GET /api/hotel/:hotelId - Get hotel details', async () => {
    // First create a hotel
    const createResponse = await request(app)
      .post('/api/hotel')
      .send(testHotel);

    const hotelId = createResponse.body.id;

    // Then get its details
    const getResponse = await request(app)
      .get(`/api/hotel/${hotelId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.title).toBe(testHotel.title);
  });
});