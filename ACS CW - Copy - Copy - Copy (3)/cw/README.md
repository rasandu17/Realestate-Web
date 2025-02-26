# PropertyFinder

PropertyFinder is a modern web application built with React that helps users search, view, and manage property listings. The application features a responsive design, intuitive user interface, and seamless property management capabilities.

## Features

- **Property Search**: Filter properties by type, price range, number of bedrooms, and location
- **Favorites System**: Save and manage favorite properties
- **Drag & Drop**: Easily add properties to favorites using drag and drop
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Property Details**: View detailed information about each property
- **Real-time Filtering**: Instant search results as you adjust filters

## Technologies Used

- React
- React Router for navigation
- React DnD for drag and drop functionality
- Material-UI components
- CSS Flexbox and Grid for responsive layouts
- Vite for build tooling

## Getting Started

**Install dependencies**
npm install

**Run the development server**
npm run dev

The application will start running at `http://localhost:5173`

## Project Structure

```
src/
├── components/         # React components
├── context/           # Context providers
├── data/             # Static data and mock APIs
└── assets/           # Images and static assets
```

## Key Components

- **SearchPage**: Main property listing and search interface
- **PropertyDetails**: Detailed view of individual properties
- **FavoritesPage**: Management of saved properties
- **Header**: Navigation and branding
- **PropertyCard**: Reusable property display component

## Features in Detail

### Property Search
- Type selection (House, Apartment, etc.)
- Price range filter
- Bedroom count filter
- Date range selection
- Postcode search

### Favorites Management
- Add/remove properties from favorites
- Clear all favorites
- Persistent storage of favorites
- Drag and drop interface

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Adaptive navigation
- Touch-friendly interfaces
