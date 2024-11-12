// File: src/controllers/hotelController.ts
import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { Hotel } from '../types/hotel';
import { createSlug } from '../utils/slugify';
import { v4 as uuidv4 } from 'uuid';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const HOTELS_DIR = path.join(__dirname, '../../data/hotels');
const IMAGES_DIR = path.join(__dirname, '../../uploads/images');
export class HotelController {
  // Get all hotels
  async getAllHotels(req: Request, res: Response): Promise<void> {
    try {
      // Create hotels directory if it doesn't exist
      await fs.mkdir(HOTELS_DIR, { recursive: true });
      
      // Read all files in the hotels directory
      const files = await fs.readdir(HOTELS_DIR);
      
      // Read and parse each hotel file
      const hotels = await Promise.all(
        files
          .filter(file => file.endsWith('.json'))
          .map(async (file) => {
            const filePath = path.join(HOTELS_DIR, file);
            const hotelData = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(hotelData) as Hotel;
          })
      );
      
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve hotels' });
    }
  }
  // Create new hotel
  async createHotel(req: Request, res: Response): Promise<void> {
    try {
      const hotelData: Hotel = req.body;
      const id = uuidv4();
      const slug = createSlug(hotelData.title);

      // Validate required fields
      if (!hotelData.title || !hotelData.description) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const hotel: Hotel = {
        ...hotelData,
        id,
        slug,
        images: [],
      };

      // Create hotels directory if it doesn't exist
      await fs.mkdir(HOTELS_DIR, { recursive: true });

      // Save hotel data
      await fs.writeFile(
        path.join(HOTELS_DIR, `${id}.json`),
        JSON.stringify(hotel, null, 2)
      );

      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create hotel' });
    }
  }

  // Get hotel by ID
  async getHotel(req: Request, res: Response): Promise<void> {
    try {
      const { hotelId } = req.params;
      const filePath = path.join(HOTELS_DIR, `${hotelId}.json`);

      const hotelData = await fs.readFile(filePath, 'utf-8');
      const hotel: Hotel = JSON.parse(hotelData);

      res.json(hotel);
    } catch (error) {
      res.status(404).json({ error: 'Hotel not found' });
    }
  }

  // Update hotel
  async updateHotel(req: Request, res: Response): Promise<void> {
    try {
      const { hotelId } = req.params;
      const updateData = req.body;
      const filePath = path.join(HOTELS_DIR, `${hotelId}.json`);

      const hotelData = await fs.readFile(filePath, 'utf-8');
      const hotel: Hotel = JSON.parse(hotelData);

      const updatedHotel: Hotel = {
        ...hotel,
        ...updateData,
        id: hotel.id,
        slug: updateData.title ? createSlug(updateData.title) : hotel.slug,
      };

      await fs.writeFile(filePath, JSON.stringify(updatedHotel, null, 2));

      res.json(updatedHotel);
    } catch (error) {
      res.status(404).json({ error: 'Hotel not found' });
    }
  }

  // Upload images
  async uploadImages(req: Request, res: Response): Promise<void> {
    try {
      const { hotelId } = req.body;
      const files = req.files as Express.Multer.File[];
  
      if (!files || files.length === 0) {
        res.status(400).json({ error: 'No files uploaded' });
        return;
      }
  
      // Validate hotel exists
      const hotelFilePath = path.join(HOTELS_DIR, `${hotelId}.json`);
      if (!await fileExists(hotelFilePath)) {
        res.status(404).json({ error: 'Hotel not found' });
        return;
      }
  
      // Create uploads directory if it doesn't exist
      await fs.mkdir(IMAGES_DIR, { recursive: true });
  
      // Read existing hotel data
      const hotelData = await fs.readFile(hotelFilePath, 'utf-8');
      const hotel: Hotel = JSON.parse(hotelData);
  
      // Process and save images
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          // Validate file type
          if (!isValidImageType(file.mimetype)) {
            throw new Error(`Invalid file type: ${file.mimetype}`);
          }
  
          // Create unique filename
          const fileName = `${uuidv4()}-${sanitizeFilename(file.originalname)}`;
          const filePath = path.join(IMAGES_DIR, fileName);
  
          // Save file
          await fs.writeFile(filePath, file.buffer);
  
          // Create and return full URL
          const imageUrl = new URL(`/images/${fileName}`, BASE_URL).toString();
          return {
            url: imageUrl,
            filename: fileName,
            originalName: file.originalname,
            mimeType: file.mimetype
          };
        })
      );
  
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
      await fs.writeFile(
        hotelFilePath, 
        JSON.stringify(hotel, null, 2)
      );
  
      // Return success response
      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        hotelId,
        uploadedImages: imageUrls
      });
  
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ 
        error: 'Failed to upload images',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
  // Helper functions
  async function fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }
  
  function isValidImageType(mimeType: string): boolean {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
    return validTypes.includes(mimeType);
  }
  
  function sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-');
  }
