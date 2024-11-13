// File: src/__test__/hotel.test.ts

import request from 'supertest';
import express from 'express';
import hotelRoutes from '../routes/hotelRoutes';

const app = express();
app.use(express.json());
app.use('/api', hotelRoutes);

describe('Hotel API', () => {
  const testHotel = {
    title: 'Test Hotel',
    description: 'A test hotel description',
    address: '123 Test Street',
    price: 100
  };

  // Test creating a new hotel
  it('POST /api/hotels - Create new hotel', async () => {
    const response = await request(app)
      .post('/api/hotels')  // Changed from /api/hotel to /api/hotels
      .send(testHotel);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(testHotel.title);
    expect(response.body.slug).toBe('test-hotel');
  });

  // Test getting hotel details
  it('GET /api/hotels/:hotelId - Get hotel details', async () => {
    // First create a hotel
    const createResponse = await request(app)
      .post('/api/hotels')  // Changed from /api/hotel to /api/hotels
      .send(testHotel);

    const hotelId = createResponse.body.id;

    // Then try to get it
    const getResponse = await request(app)
      .get(`/api/hotels/${hotelId}`);  // Changed from /api/hotel to /api/hotels

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.title).toBe(testHotel.title);
  });

  // Test getting all hotels
  it('GET /api/hotels - Get all hotels', async () => {
    const response = await request(app)
      .get('/api/hotels');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test updating a hotel
  it('PUT /api/hotels/:hotelId - Update hotel', async () => {
    // First create a hotel
    const createResponse = await request(app)
      .post('/api/hotels')
      .send(testHotel);

    const hotelId = createResponse.body.id;

    const updateData = {
      title: 'Updated Hotel Name',
      description: 'Updated description'
    };

    // Then update it
    const updateResponse = await request(app)
      .put(`/api/hotels/${hotelId}`)
      .send(updateData);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe(updateData.title);
  });

  // Test error handling for non-existent hotel
  it('GET /api/hotels/:hotelId - Should return 404 for non-existent hotel', async () => {
    const response = await request(app)
      .get('/api/hotels/non-existent-id');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  // Test validation for required fields
  it('POST /api/hotels - Should validate required fields', async () => {
    const invalidHotel = {
      title: 'Test Hotel'
      // Missing description
    };

    const response = await request(app)
      .post('/api/hotels')
      .send(invalidHotel);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
