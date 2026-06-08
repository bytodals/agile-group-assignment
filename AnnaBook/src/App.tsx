import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import HomePage from './pages/HomePage';
import SavedBooksPage from './pages/SavedBooksPage';
import BookDetailsPage from './pages/BookDetailsPage/BookDetailsPage';
import PageTransition from './components/motion/PageTransition';

function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/saved-books"
          element={
            <PageTransition>
              <SavedBooksPage />
            </PageTransition>
          }
        />
        <Route
          path="/books/:id"
          element={
            <PageTransition>
              <BookDetailsPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
