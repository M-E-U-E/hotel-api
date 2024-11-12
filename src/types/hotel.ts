// File: src/types/hotel.ts
interface Room {
    hotelSlug: string;
    roomSlug: string;
    roomImage: string;
    roomTitle: string;
    bedroomCount: number;
  }
  
  interface Hotel {
    id: string;
    slug: string;
    images: HotelImage[];
    title: string;
    description: string;
    guestCount: number;
    bedroomCount: number;
    bathroomCount: number;
    amenities: string[];
    host: {
      name: string;
      email: string;
    };
    address: string;
    latitude: number;
    longitude: number;
    rooms: Room[];
  }
   interface HotelValidationData {
    title?: string;
    bedroomCount?: number;
    address?: string;

  }
  export function validateHotelData(data: HotelValidationData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
  
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push("Invalid or missing 'title': Title must be a non-empty string.");
    }
  
    if (data.bedroomCount == null || !Number.isInteger(data.bedroomCount) || data.bedroomCount <= 0) {
      errors.push("Invalid or missing 'bedroomCount': Bedroom count must be a positive integer.");
    }
  
    if (!data.address || typeof data.address !== 'string' || data.address.trim() === '') {
      errors.push("Invalid or missing 'address': Address must be a non-empty string.");
    }
    return {
      valid: errors.length === 0,
      errors,
    };
  }
  export interface HotelImage {
    url: string;
    filename: string;
    originalName: string;
    mimeType: string;
    uploadedAt: string;
  }
  export { Hotel, Room };