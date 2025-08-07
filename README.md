# DreamHeaven Frontend

A modern, responsive real estate platform built with React and Tailwind CSS. DreamHeaven showcases a beautiful UI design for a next-generation real estate platform with AI-powered search capabilities and an intuitive user experience.

## 🏠 Features

- **Modern Real Estate UI** - Clean, professional design with property listings and search functionality
- **AI-Powered Search** - Natural language search capabilities for finding properties
- **Advanced Filtering** - Comprehensive search filters for location, price, bedrooms, bathrooms, and more
- **Responsive Design** - Mobile-first approach with responsive breakpoints for all devices
- **Component-Based Architecture** - Modular, reusable React components
- **Performance Optimized** - Fast loading and smooth interactions
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Create React App
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZiyanLi01/dreamheaven-frontend.git
   cd dreamheaven-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 📁 Project Structure

```
dreamheaven-frontend/
├── public/                 # Static assets
│   ├── index.html         # Main HTML file
│   ├── 1.png, 2.png, 3.png, 4.png  # Property images
│   └── logo1.png, logo2.png        # Logo assets
├── src/
│   ├── components/        # React components
│   │   ├── Header.js      # Navigation header with logo
│   │   ├── Hero.js        # Hero section with search
│   │   ├── SearchSection.js # Traditional search filters
│   │   ├── AiSearchSection.js # AI-powered search interface
│   │   ├── PropertyListings.js # Property grid and cards
│   │   ├── Testimonials.js # Customer testimonials
│   │   └── Footer.js      # Footer with contact info
│   ├── services/
│   │   └── api.js         # API service functions
│   ├── App.js             # Main application component
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles and Tailwind imports
├── backend/               # Backend server files
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── README.md          # Backend documentation
├── package.json           # Frontend dependencies
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── README.md              # This file
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#2563eb` (Blue-600)
- **Dark Blue**: `#1e3a8a` (Blue-900)
- **Gray Scale**: Various gray shades for text and backgrounds
- **Accent**: Green for success states and white for cards

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: White background with subtle shadows and rounded corners
- **Buttons**: Blue primary buttons with hover effects
- **Inputs**: Clean form fields with focus states
- **Icons**: Lucide React icons for consistency

## 🔍 Features Overview

### Header Component
- DreamHeaven logo with house icon
- User profile button
- Clean navigation design

### Hero Section
- Compelling headline and value proposition
- Feature list with checkmarks
- Call-to-action buttons

### SearchSection Component
- Traditional search filters
- Property type, location, and amenity filters
- Price range and bedroom/bathroom filters
- Sort options

### AiSearchSection Component
- Natural language search interface
- AI-powered property search
- User-friendly query input

### PropertyListings Component
- Grid layout of property cards
- Property images, status tags, and details
- Key information (bedrooms, bathrooms, square footage)
- Agent information and listing age
- Pricing display

### Testimonials Component
- Customer testimonials in card format
- Profile pictures with initials
- Pagination dots for carousel

### Footer Component
- Company logo and branding
- Contact information
- Legal links and copyright

## 🔧 Customization

### Adding New Properties
Edit the `properties` array in `src/components/PropertyListings.js`:

```javascript
const properties = [
  {
    id: 1,
    status: "For Sale",
    address: "Your Address",
    location: "City, State ZIP",
    sqft: "2500",
    garages: "2",
    bedrooms: "4",
    bathrooms: "3",
    agent: "Agent Name",
    listingAge: "2 days ago",
    price: "$750,000"
  }
  // Add more properties...
];
```

### Styling Customization
- Modify `tailwind.config.js` for color schemes and theme customization
- Update `src/index.css` for custom component styles
- Use Tailwind utility classes for quick styling

## 🌐 Backend Integration

### Environment Setup

Create a `.env` file in the root directory with your backend API URL:

```bash
# .env
REACT_APP_API_URL=http://localhost:8000/api
```

### API Endpoints

The frontend is configured to work with these backend endpoints:

#### Traditional Search
- **Endpoint**: `POST /api/search`
- **Payload**: 
```json
{
  "location": "Beverly Hills, CA",
  "rent": "For Sale",
  "bed": "3+",
  "bath": "2+",
  "searchQuery": "modern house with pool",
  "sortBy": "price",
  "sortOrder": "asc"
}
```

#### AI Natural Language Search
- **Endpoint**: `POST /api/ai-search`
- **Payload**:
```json
{
  "query": "Modern house in San Francisco with big yard, near good schools"
}
```

#### Get Properties
- **Endpoint**: `GET /api/properties`
- **Query Parameters**: Filters for location, price, etc.

#### Get Property by ID
- **Endpoint**: `GET /api/properties/{id}`

### Testing the Integration

1. **Start your backend server** (e.g., on port 8000)
2. **Set the API URL** in your `.env` file
3. **Start the frontend**: `npm start`
4. **Test the search functionality**:
   - Use the traditional filters in SearchSection
   - Use the AI natural language search in AiSearchSection
   - Check browser console for API responses

## 📦 Deployment

### Build for Production
```bash
npm run build
```

The build folder will contain the optimized production files ready for deployment.

### Deployment Options
- **Netlify**: Drag and drop the build folder or connect your GitHub repository
- **Vercel**: Connect your GitHub repository for automatic deployments
- **AWS S3**: Upload build files to S3 bucket
- **Traditional Hosting**: Upload build files to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact:
- Email: info@dreamheaven.com
- Address: 124 Brooklyn, Sanjose, CA United States

---

Built with ❤️ for the DreamHeaven real estate platform. 