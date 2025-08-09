# DreamHeaven Backend API

A Node.js/Express backend API for the DreamHeaven real estate platform.

## Features

- ✅ Traditional property search with filters
- ✅ AI natural language search
- ✅ Property listing endpoints
- ✅ CORS enabled for frontend integration
- ✅ Sample property data included

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on port 8080 by default.

### 3. Test the API

Visit `http://localhost:8080/api/health` to check if the server is running.

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Traditional Search
- **POST** `/api/search`
- **Body:**
```json
{
  "location": "Beverly Hills, CA",
  "rent": "For Sale",
  "bed": "3+",
  "bath": "2+",
  "searchQuery": "modern house",
  "sortBy": "price",
  "sortOrder": "asc"
}
```

### AI Natural Language Search
- **POST** `/api/ai-search`
- **Body:**
```json
{
  "query": "Modern house in San Francisco with big yard, near good schools"
}
```

### Get All Properties
- **GET** `/api/properties`
- **Query Parameters:** `location`, `price_min`, `price_max`, `bedrooms`, `bathrooms`

### Get Property by ID
- **GET** `/api/properties/:id`

## Sample Data

The backend includes 6 sample properties with:
- Addresses in different cities
- Various price ranges ($1.8M - $4.5M)
- Different bedroom/bathroom configurations
- Real estate agent information
- Listing ages
- Sample images from Unsplash

## Environment Variables

- `PORT` - Server port (default: 8080)

## Development

The backend uses:
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Body-parser** - Request body parsing
- **Nodemon** - Auto-restart in development

## Frontend Integration

This backend is designed to work with the DreamHeaven frontend. The frontend proxy is configured to forward requests to `http://localhost:8080/api`.

## Testing

You can test the API using curl, Postman, or your browser:

```bash
# Health check
curl http://localhost:8080/api/health

# Traditional search
curl -X POST http://localhost:8080/api/search \
  -H "Content-Type: application/json" \
  -d '{"location": "Beverly Hills", "rent": "For Sale"}'

# AI search
curl -X POST http://localhost:8080/api/ai-search \
  -H "Content-Type: application/json" \
  -d '{"query": "modern house with pool"}'
``` 