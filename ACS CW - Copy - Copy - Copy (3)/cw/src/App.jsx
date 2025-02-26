import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FavoritesProvider } from './context/FavoritesContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import PropertyDetails from './components/PropertyDetails';
import FavoritesPage from './components/FavoritesPage';
import './App.css';

function App() {
  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <FavoritesProvider>
          <div className="app">
            <Header />
            <div className="content">
              <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </FavoritesProvider>
      </DndProvider>
    </Router>
  );
}

export default App;
