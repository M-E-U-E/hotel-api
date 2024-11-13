# Assignment03
# Hotel API

A backend API built with Node.js and Express.js for managing hotel details, featuring comprehensive hotel data management, image handling, and endpoint testing.

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Git Clone Instructions](#git-clone-instructions)
- [Instructions](#Instructions)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Schema](#schema)
- [Dependencies](#dependencies)


## Description
A backend API developed using Node.js and Express.js to manage hotel details. The API provides endpoints for interacting with hotel data stored in JSON files, allowing operations such as retrieving, inserting, and updating hotel records. The system includes unit tests to verify endpoint functionality and supports image upload capabilities.

## Features

### Endpoint Operations
- **POST /hotel**
  - Insert new hotel record
  - Accepts JSON format hotel data
  - Stores data in hotel-id.json file
  - Validates against provided schema

- **POST /images**
  - Handles multiple image uploads
  - Supports multipart data
  - Saves images to designated directory
  - Updates hotel records with image URLs

- **GET /hotel/{hotel-id}**
  - Retrieves specific hotel details
  - Supports lookup by ID or slug
  - Returns complete hotel data
  - Includes functional image URLs

- **PUT /hotel/{hotel-id}**
  - Updates existing hotel data
  - Modifies title, description, etc.
  - Uses unique ID for hotel identification
  - Accepts updated information in request body
  - 
## Git Clone Instructions

To clone this project to your local machine, follow these steps:

1. **Open terminal (Command Prompt, PowerShell, or Terminal)**
2. **Clone the repository**: git clone [repository-url]
   
## Instructions:

-Get all hotels:
    1. Create new request
    2. Select "GET"
    3. Enter URL: http://localhost:3000/api/hotels
    4. Click "Send"
   
Create a new hotel:
    1. Open Postman
    2. Click "New" → "Request"
    3. Select "POST" from the dropdown
    4. Enter URL: http://localhost:3000/api/hotels
    5. Go to "Headers" tab → Add "Content-Type: application/json"
    6. Go to "Body" tab
    7. Select "raw" and "JSON"
    8. Enter the hotel data:
    {
        "title": "Test Hotel",
        "description": "This is a test hotel"
    }
    9. Click "Send"
    10. Save the "id" from the response for next requests

Get specific hotel:
    1. Create new request
    2. Select "GET"
    3. Enter URL: http://localhost:3000/api/hotels/{paste-hotel-id-here}
    4. Click "Send"

Update hotel:
    1. Create new request
    2. Select "PUT"
    3. Enter URL: http://localhost:3000/api/hotels/{paste-hotel-id-here}
    4. Add "Content-Type: application/json" header
    5. In Body (raw/JSON) enter:
    {
        "title": "Updated Hotel Name",
        "description": "Updated description"
    }
    6. Click "Send"

Upload images:
    1. Create new request
    2. Select "POST"
    3. Enter URL: http://localhost:3000/api/images
    4. Select "Body" → "form-data"
    5. Add key "hotelId" (text) with your hotel ID
    6. Add key "images" (file) and select image file
    7. Click "Send"

## Project Structure

hotel-api/
├── src/
│   ├── __tests__/
│   │   └── hotel.test.ts
│   ├── controllers/
│   │   └── hotelController.ts
│   ├── routes/
│   │   └── hotelRoutes.ts
│   ├── types/
│   │   └── hotel.ts
│   ├── utils/
│   │   └── slugify.ts
│   ├── app.ts
│   └── server.ts
├── data/
│   └── hotels/
├── uploads/
│   └── images/
├── .gitignore
├── package.json
├── tsconfig.json
└── jest.config.js

## Technologies Used

- **Node.js**: Runtime environment for server-side application execution
- **Express.js**: Web application framework for handling routes and HTTP requests
- **TypeScript**: Programming language for type safety and enhanced development
- **Jest**: Testing framework for unit and integration tests
- **Supertest**: HTTP endpoint testing library
- **File System (fs)**: Node.js module for file operations

## Schema
{
  "type": "object",
  "properties": {
    "hotel_id": { "type": "string" },
    "slug": { "type": "string" },
    "images": {
      "type": "array",
      "items": { "type": "string" }
    },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "guest_count": { "type": "integer" },
    "bedroom_count": { "type": "integer" },
    "bathroom_count": { "type": "integer" },
    "amenities": {
      "type": "array",
      "items": { "type": "string" }
    },
    "host_information": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "contact": { "type": "string" }
      },
      "required": ["name", "contact"]
    },
    "address": { "type": "string" },
    "latitude": { "type": "number" },
    "longitude": { "type": "number" },
    "rooms": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "hotel_slug": { "type": "string" },
          "room_slug": { "type": "string" },
          "room_image": { "type": "string" },
          "room_title": { "type": "string" },
          "bedroom_count": { "type": "integer" }
        },
        "required": ["hotel_slug", "room_slug", "room_image", "room_title", "bedroom_count"]
      }
    }
  },
  "required": ["hotel_id", "slug", "title", "description", "guest_count", "bedroom_count", "bathroom_count", "amenities", "host_information", "address", "latitude", "longitude", "rooms"]
}

## Dependencies

- **Node.js & Express.js**: Core framework and runtime
- **TypeScript**: Programming language and its dependencies
- **Jest & Supertest**: Testing frameworks
- **File System Module**: Built-in Node.js module

