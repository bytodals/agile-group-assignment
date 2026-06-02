import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import SavedBooksPage from './pages/SavedBooksPage';
import { Route, Routes } from 'react-router-dom';
import BookDetailsPage from './pages/BookDetailsPage/BookDetailsPage';

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path === window.location.pathname) {
      return;
    }

    window.history.pushState({}, '', path);
    setPathname(path);
  };

  if (pathname === '/saved-books' || pathname === '/my-books') {
    return <SavedBooksPage onNavigate={navigate} />;
  }

  return <HomePage onNavigate={navigate} />;
  return (
    <Routes>
      <Route path="/" element={<HomePage onNavigate={function (_path: string): void {
        throw new Error('Function not implemented.');
      } } />} />
      <Route path="/books/:id" element={<BookDetailsPage />} />
    </Routes>
  );
}

export default App;
