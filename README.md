# DreamHeaven Frontend

A modern, responsive real estate platform built with React and Tailwind CSS. DreamHeaven showcases a beautiful UI design for a next-generation real estate platform with AI-powered search capabilities, user authentication, and an intuitive user experience.

## Features

- **Modern Real Estate UI** - Clean, professional design with property listings and search functionality
- **AI-Powered Search** - Natural language search capabilities for finding properties with recommendation reasons
- **User Authentication** - Login and registration system with protected features
- **Advanced Filtering** - Comprehensive search filters for location, price, bedrooms, bathrooms, and more
- **Responsive Design** - Mobile-first approach with responsive breakpoints for all devices
- **Component-Based Architecture** - Modular, reusable React components
- **Performance Optimized** - Fast loading and smooth interactions
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

## Tech Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Create React App
- **Package Manager**: npm
- **Authentication**: Local storage with JWT tokens
- **API Integration**: Fetch API with proxy configuration

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm package manager
- Backend server running on port 8080 (main API)
- AI/RAG backend running on port 8001 (AI search)

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

## Project Structure

```
dreamheaven-frontend/
├── public/                 # Static assets
│   ├── index.html         # Main HTML file
│   ├── 1.png, 2.png, 3.png, 4.png  # Property images
│   └── logo1.png, logo2.png        # Logo assets
├── src/
│   ├── components/        # React components
│   │   ├── Header.js      # Navigation header with logo and user auth
│   │   ├── Hero.js        # Hero section with search
│   │   ├── SearchSection.js # Traditional search filters
│   │   ├── AiSearchSection.js # AI-powered search interface with results
│   │   ├── PropertyListings.js # Property grid and cards
│   │   ├── Testimonials.js # Customer testimonials
│   │   ├── Footer.js      # Footer with contact info
│   │   └── LoginModal.js  # User authentication modal
│   ├── services/
│   │   └── api.js         # API service functions for all endpoints
│   ├── App.js             # Main application component with state management
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles and Tailwind imports
├── package.json           # Frontend dependencies and proxy configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── README.md              # This file
```

## Design System

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

## Features Overview

### Header Component
- DreamHeaven logo (clickable, returns to home page)
- User authentication status
- Login/logout functionality with user menu

### Hero Section
- Compelling headline and value proposition
- Feature list with checkmarks
- Call-to-action buttons

### SearchSection Component
- Traditional search filters
- Property type, location, and amenity filters
- Price range and bedroom/bathroom filters
- Sort options
- State management integration with App.js

### AiSearchSection Component
- Natural language search interface
- AI-powered property search with authentication requirement
- User-friendly query input with examples
- Results display with 2-column layout (property card + recommendation reasons)
- Similarity score visualization
- Load more functionality

### PropertyListings Component
- Grid layout of property cards
- Property images, status tags, and details
- Key information (bedrooms, bathrooms, square footage)
- Agent information and listing age
- Pricing display with integer formatting
- Default filters (San Francisco, CA, For Rent)
- Search results integration

### Testimonials Component
- Customer testimonials in card format
- Profile pictures with initials
- Pagination dots for carousel

### Footer Component
- Company logo and branding
- Contact information
- Legal links and copyright

### LoginModal Component
- User registration and login forms
- Form validation and error handling
- Password visibility toggle
- Loading states and success feedback

## Backend Integration

### Environment Setup

The application uses proxy configuration in `package.json` for development:

```json
{
  "proxy": "http://localhost:8080"
}
```

### API Endpoints

The frontend integrates with two backend services:

#### Main Backend (Port 8080)
- **Authentication**: `/auth/login`, `/auth/register`, `/auth/logout`
- **Property Search**: `/search`
- **Property Listings**: `/listings`

#### AI/RAG Backend (Port 8001)
- **AI Search**: `/improved-search`

### API Service Functions

Located in `src/services/api.js`:

- `searchProperties(searchData)` - Traditional property search
- `getProperties(filters)` - Get property listings
- `getPropertyById(propertyId)` - Get specific property
- `aiSearchProperties(query)` - AI natural language search
- `loginUser(credentials)` - User authentication
- `registerUser(userData)` - User registration
- `logoutUser()` - User logout
- `getAuthHeaders()` - Get authentication headers

### Testing the Integration

1. **Start your main backend server** on port 8080
2. **Start your AI/RAG backend server** on port 8001
3. **Start the frontend**: `npm start`
4. **Test the functionality**:
   - Register/login with user authentication
   - Use traditional filters in SearchSection
   - Use AI natural language search (requires login)
   - Check browser console for API responses

## State Management

The application uses React hooks for state management:

- **App.js**: Central state for search results, user authentication, and modal management
- **Component State**: Local state for UI interactions and form data
- **Local Storage**: Persistence for user authentication tokens

## Customization

### Adding New Properties
Properties are fetched from the backend API. To modify the display format, edit the `PropertyCard` component in `PropertyListings.js` or `AiSearchSection.js`.

### Styling Customization
- Modify `tailwind.config.js` for color schemes and theme customization
- Update `src/index.css` for custom component styles
- Use Tailwind utility classes for quick styling

### Authentication Customization
- Modify `LoginModal.js` for different authentication flows
- Update `api.js` for different authentication endpoints
- Customize user session management in `App.js`

## Deployment

### Build for Production
```bash
npm run build
```

The build folder will contain the optimized production files ready for deployment.

### Environment Variables
For production, set these environment variables:
- `REACT_APP_API_URL` - Main backend URL
- `REACT_APP_AI_API_URL` - AI backend URL

### Deployment Options
- **Netlify**: Drag and drop the build folder or connect your GitHub repository
- **Vercel**: Connect your GitHub repository for automatic deployments
- **AWS S3**: Upload build files to S3 bucket
- **Traditional Hosting**: Upload build files to your web server

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact:
- Email: info@dreamheaven.com
- Address: 124 Brooklyn, Sanjose, CA United States

---

Built with love for the DreamHeaven real estate platform. 