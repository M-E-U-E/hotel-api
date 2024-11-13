# Assignment03
# Hotel API

A backend API built with Node.js and Express.js for managing hotel details, featuring comprehensive hotel data management, image handling, and endpoint testing.

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Schema](#schema)
- [Dependencies](#dependencies)
- [Git Clone Instructions](#git-clone-instructions)

## Description
A backend API developed using Node.js and Express.js to manage hotel details. The API provides endpoints for interacting with hotel data stored in JSON files, allowing operations such as retrieving, inserting, and updating hotel records. The system includes unit tests to verify endpoint functionality and supports image upload capabilities.

## Features

### Endpoint Operations & Testing Guide

#### GET /hotels - Retrieve All Hotels
```bash
Method: GET
URL: http://localhost:3000/api/hotels
```
Test Steps:
1. Create new request in Postman
2. Select "GET"
3. Enter URL
4. Click "Send"

#### POST /hotel - Create New Hotel
```bash
Method: POST
URL: http://localhost:3000/api/hotels
Headers: Content-Type: application/json
Body: 
{
    "title": "Test Hotel",
    "description": "This is a test hotel"
}
```
Test Steps:
1. Create new request
2. Select "POST"
3. Enter URL
4. Add header "Content-Type: application/json"
5. In Body tab:
   - Select "raw" and "JSON"
   - Enter hotel data
6. Click "Send"
7. Save returned "id" for future requests

#### GET /hotel/{hotel-id} - Retrieve Specific Hotel
```bash
Method: GET
URL: http://localhost:3000/api/hotels/{hotel-id}
```
Test Steps:
1. Create new request
2. Select "GET"
3. Enter URL with specific hotel ID
4. Click "Send"

#### PUT /hotel/{hotel-id} - Update Hotel
```bash
Method: PUT
URL: http://localhost:3000/api/hotels/{hotel-id}
Headers: Content-Type: application/json
Body:
{
    "title": "Updated Hotel Name",
    "description": "Updated description"
}
```
Test Steps:
1. Create new request
2. Select "PUT"
3. Enter URL with specific hotel ID
4. Add header "Content-Type: application/json"
5. In Body tab:
   - Select "raw" and "JSON"
   - Enter updated hotel data
6. Click "Send"

#### POST /images - Upload Images
```bash
Method: POST
URL: http://localhost:3000/api/images
Body: form-data
Keys:
- hotelId: (text) your-hotel-id
- images: (file) image-file
```
Test Steps:
1. Create new request
2. Select "POST"
3. Enter URL
4. In Body tab:
   - Select "form-data"
   - Add key "hotelId" (type: text)
   - Add key "images" (type: file)
5. Select image file(s)
6. Click "Send"

## Project Structure

```
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
```

## Technologies Used

- **Node.js**: Runtime environment for server-side application execution
- **Express.js**: Web application framework for handling routes and HTTP requests
- **TypeScript**: Programming language for type safety and enhanced development
- **Jest**: Testing framework for unit and integration tests
- **Supertest**: HTTP endpoint testing library
- **File System (fs)**: Node.js module for file operations

## Schema
```json
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
```

## Dependencies

- **Node.js & Express.js**: Core framework and runtime
- **TypeScript**: Programming language and its dependencies
- **Jest & Supertest**: Testing frameworks
- **File System Module**: Built-in Node.js module

## Git Clone Instructions

To clone this project to your local machine, follow these steps:

1. **Open terminal (Command Prompt, PowerShell, or Terminal)**
2. **Clone the repository**: git clone [repository-url]
