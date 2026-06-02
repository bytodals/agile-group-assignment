import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SavedBooksPage from './pages/SavedBooksPage';
import BookDetailsPage from './pages/BookDetailsPage/BookDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage onNavigate={function (_path: string): void {
        throw new Error('Function not implemented.');
      } } />} />
      <Route
        path="/"
        element={
          <HomePage
            onNavigate={function (_path: string): void {
              throw new Error('Function not implemented.');
            }}
          />
        }
      />
      <Route path="/my-books" element={<SavedBooksPage />} />
      <Route path="/books/:id" element={<BookDetailsPage />} />
    </Routes>
  );
}

export default App;
