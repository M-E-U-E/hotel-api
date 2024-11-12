"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHotelData = validateHotelData;
function validateHotelData(data) {
    const errors = [];
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
