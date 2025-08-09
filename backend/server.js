const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample property data
const sampleProperties = [
  {
    id: 1,
    address: "123 Dream Street, Beverly Hills, CA",
    price: 2500000,
    sqft: 3200,
    bedrooms: 4,
    bathrooms: 3,
    type: "For Sale",
    agent: "Sarah Johnson",
    listingAge: "2 days ago",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    address: "456 Luxury Lane, Los Angeles, CA",
    price: 1800000,
    sqft: 2800,
    bedrooms: 3,
    bathrooms: 2.5,
    type: "For Sale",
    agent: "Mike Chen",
    listingAge: "1 week ago",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    address: "789 Modern Ave, San Francisco, CA",
    price: 3200000,
    sqft: 3500,
    bedrooms: 5,
    bathrooms: 4,
    type: "For Sale",
    agent: "Emily Davis",
    listingAge: "3 days ago",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    address: "321 Downtown Blvd, New York, NY",
    price: 4500000,
    sqft: 4200,
    bedrooms: 6,
    bathrooms: 5,
    type: "For Sale",
    agent: "David Wilson",
    listingAge: "5 days ago",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    address: "654 Beach Road, Miami, FL",
    price: 2800000,
    sqft: 3800,
    bedrooms: 4,
    bathrooms: 3.5,
    type: "For Sale",
    agent: "Lisa Rodriguez",
    listingAge: "1 day ago",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    address: "987 Garden Court, Seattle, WA",
    price: 1900000,
    sqft: 2900,
    bedrooms: 3,
    bathrooms: 2,
    type: "For Sale",
    agent: "Tom Anderson",
    listingAge: "4 days ago",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop"
  }
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dream Haven API is running!' });
});

// Traditional search endpoint
app.post('/api/search', (req, res) => {
  try {
    const { location, rent, bed, bath, searchQuery, sortBy, sortOrder } = req.body;
    
    console.log('Search request received:', req.body);
    
    // Filter properties based on search criteria
    let filteredProperties = [...sampleProperties];
    
    if (location) {
      filteredProperties = filteredProperties.filter(property => 
        property.address.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (rent && rent !== 'Both') {
      filteredProperties = filteredProperties.filter(property => 
        property.type === rent
      );
    }
    
    if (bed && bed !== 'Any') {
      const minBeds = parseInt(bed.replace('+', ''));
      filteredProperties = filteredProperties.filter(property => 
        property.bedrooms >= minBeds
      );
    }
    
    if (bath && bath !== 'Any') {
      const minBaths = parseFloat(bath.replace('+', ''));
      filteredProperties = filteredProperties.filter(property => 
        property.bathrooms >= minBaths
      );
    }
    
    if (searchQuery) {
      filteredProperties = filteredProperties.filter(property => 
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.agent.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort properties
    if (sortBy) {
      filteredProperties.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'price') {
          aVal = parseFloat(aVal);
          bVal = parseFloat(bVal);
        }
        
        if (sortOrder === 'desc') {
          return bVal - aVal;
        }
        return aVal - bVal;
      });
    }
    
    res.json({
      success: true,
      count: filteredProperties.length,
      properties: filteredProperties
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// AI search endpoint
app.post('/api/ai-search', (req, res) => {
  try {
    const { query } = req.body;
    
    console.log('AI Search request received:', query);
    
    // Simulate AI processing
    const aiKeywords = query.toLowerCase().split(' ');
    
    // Filter properties based on AI query keywords
    let aiFilteredProperties = sampleProperties.filter(property => {
      const propertyText = `${property.address} ${property.agent} ${property.type}`.toLowerCase();
      return aiKeywords.some(keyword => propertyText.includes(keyword));
    });
    
    // If no direct matches, return some properties with AI confidence scores
    if (aiFilteredProperties.length === 0) {
      aiFilteredProperties = sampleProperties.slice(0, 3).map(property => ({
        ...property,
        aiConfidence: Math.random() * 0.3 + 0.7 // Random confidence between 0.7-1.0
      }));
    } else {
      aiFilteredProperties = aiFilteredProperties.map(property => ({
        ...property,
        aiConfidence: Math.random() * 0.2 + 0.8 // Higher confidence for matched properties
      }));
    }
    
    // Sort by AI confidence
    aiFilteredProperties.sort((a, b) => b.aiConfidence - a.aiConfidence);
    
    res.json({
      success: true,
      query: query,
      count: aiFilteredProperties.length,
      properties: aiFilteredProperties,
      aiAnalysis: {
        keywords: aiKeywords,
        confidence: aiFilteredProperties[0]?.aiConfidence || 0.8
      }
    });
    
  } catch (error) {
    console.error('AI Search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get all properties
app.get('/api/properties', (req, res) => {
  try {
    const { location, price_min, price_max, bedrooms, bathrooms } = req.query;
    
    let filteredProperties = [...sampleProperties];
    
    // Apply filters
    if (location) {
      filteredProperties = filteredProperties.filter(property => 
        property.address.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (price_min) {
      filteredProperties = filteredProperties.filter(property => 
        property.price >= parseInt(price_min)
      );
    }
    
    if (price_max) {
      filteredProperties = filteredProperties.filter(property => 
        property.price <= parseInt(price_max)
      );
    }
    
    if (bedrooms) {
      filteredProperties = filteredProperties.filter(property => 
        property.bedrooms >= parseInt(bedrooms)
      );
    }
    
    if (bathrooms) {
      filteredProperties = filteredProperties.filter(property => 
        property.bathrooms >= parseFloat(bathrooms)
      );
    }
    
    res.json({
      success: true,
      count: filteredProperties.length,
      properties: filteredProperties
    });
    
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get property by ID
app.get('/api/properties/:id', (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const property = sampleProperties.find(p => p.id === propertyId);
    
    if (!property) {
      return res.status(404).json({ 
        success: false, 
        error: 'Property not found' 
      });
    }
    
    res.json({
      success: true,
      property: property
    });
    
  } catch (error) {
    console.error('Get property by ID error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dream Haven Backend API running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`\n📋 Available Endpoints:`);
  console.log(`   POST /api/search - Traditional property search`);
  console.log(`   POST /api/ai-search - AI natural language search`);
  console.log(`   GET  /api/properties - Get all properties`);
  console.log(`   GET  /api/properties/:id - Get property by ID`);
  console.log(`   GET  /api/health - Health check`);
}); 