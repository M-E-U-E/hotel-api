"use strict";
function validateHotelData(data) {
    const errors = [];
    // Validate 'title' - must be a non-empty string
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
        errors.push("Invalid or missing 'title': Title must be a non-empty string.");
    }
    // Validate 'bedroomCount' - must be a positive integer
    if (data.bedroomCount == null || !Number.isInteger(data.bedroomCount) || data.bedroomCount <= 0) {
        errors.push("Invalid or missing 'bedroomCount': Bedroom count must be a positive integer.");
    }
    // Validate 'address' - must be a non-empty string
    if (!data.address || typeof data.address !== 'string' || data.address.trim() === '') {
        errors.push("Invalid or missing 'address': Address must be a non-empty string.");
    }
    // // Validate 'latitude' - must be a number between -90 and 90
    // if (data.latitude == null || typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90) {
    //   errors.push("Invalid or missing 'latitude': Latitude must be a number between -90 and 90.");
    // }
    // // Validate 'longitude' - must be a number between -180 and 180
    // if (data.longitude == null || typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180) {
    //   errors.push("Invalid or missing 'longitude': Longitude must be a number between -180 and 180.");
    // }
    return {
        valid: errors.length === 0,
        errors,
    };
}
// Usage example
const hotelData = {
    title: "Grand Plaza",
    bedroomCount: 3,
    address: "123 Main St",
};
const { valid, errors } = validateHotelData(hotelData);
if (!valid) {
    console.error("Validation errors:", errors);
}
else {
    console.log("Validation passed for hotel data.");
}
