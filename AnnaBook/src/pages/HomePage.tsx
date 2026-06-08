import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Search } from 'lucide-react';
import BookCard from '../components/BookCard/BookCard';
import OpenLibrarySearchResults from '../components/OpenLibrarySearchResults';
import CoverImage from '../components/CoverImage/CoverImage';
import TopBar from '../components/TopBar/TopBar';
import Reveal from '../components/motion/Reveal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  getBooks,
  getFeaturedBook,
  getGenres,
  type DbBook,
  type FeaturedBook,
  type GenreCount,
} from '../services/api';

function Hero({ featured }: { featured: FeaturedBook | null | 'loading' }) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, prefersReducedMotion ? 0 : -40]);

  if (featured === 'loading') {
    return (
      <section className="hero">
        <div className="hero__skeleton" aria-hidden />
        <div className="hero__skeleton" aria-hidden />
      </section>
    );
  }

  if (!featured) return null;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <motion.div className="hero__cover" style={{ y }}>
        <CoverImage
          coverId={featured.coverId}
          title={featured.title}
          author={featured.author}
          size="lg"
        />
      </motion.div>
      <motion.div
        className="hero__text"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="hero__eyebrow">Book of the month</p>
        <h1 id="hero-title" className="hero__title">
          {featured.title}
        </h1>
        {featured.author && <p className="hero__author">by {featured.author}</p>}
        <hr className="hero__rule" />
        {featured.description && <p className="hero__desc">{featured.description}</p>}
      </motion.div>
    </section>
  );
}

function GenresSection({ genres }: { genres: GenreCount[] }) {
  if (genres.length === 0) return null;
  return (
    <Reveal as="section" className="section">
      <div className="section__head">
        <div>
          <span className="section__eyebrow">Browse</span>
          <h2 className="section__title">By genre</h2>
        </div>
        <p className="section__hint">Tap a genre to filter your shelf</p>
      </div>
      <motion.ul
        className="chips"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {genres.map((g) => (
          <motion.li
            key={g.genre}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link className="chip" to={`/?genre=${encodeURIComponent(g.genre)}#new-arrivals`}>
              {g.genre}
              <span className="chip__count">{g.count}</span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </Reveal>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const activeGenre = searchParams.get('genre');

  const [featured, setFeatured] = useState<FeaturedBook | null | 'loading'>('loading');
  const [genres, setGenres] = useState<GenreCount[]>([]);
  const [books, setBooks] = useState<DbBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);

  useEffect(() => {
    getFeaturedBook()
      .then((b) => setFeatured(b))
      .catch(() => setFeatured(null));
  }, []);

  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    let active = true;
    getBooks()
      .then((all) => {
        if (!active) return;
        const ordered = [...all].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        setBooks(ordered);
      })
      .catch(() => {
        if (active) setBooks([]);
      })
      .finally(() => {
        if (active) setBooksLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleBooks = useMemo(() => {
    if (!activeGenre) return books.slice(0, 8);
    return books
      .filter((b) => (b.genre ?? '').toLowerCase() === activeGenre.toLowerCase())
      .slice(0, 8);
  }, [books, activeGenre]);

  return (
    <div className="editorial-root">
      <TopBar active="home" />
      <main className="editorial-page">
        <Hero featured={featured} />

        <Reveal as="section" className="section" delay={0.05}>
          <div className="section__head">
            <div>
              <span className="section__eyebrow">Discover</span>
              <h2 className="section__title">Search the catalogue</h2>
            </div>
          </div>
          <div className="search-pill">
            <Search className="search-pill__icon" size={18} />
            <input
              type="search"
              placeholder="Search by title, author, or ISBN…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search Open Library"
            />
          </div>
          <OpenLibrarySearchResults query={searchQuery} />
        </Reveal>

        <Reveal as="section" className="section" delay={0.1}>
          <div className="section__head" id="new-arrivals">
            <div>
              <span className="section__eyebrow">From your shelf</span>
              <h2 className="section__title">
                {activeGenre ? `Genre · ${activeGenre}` : 'Recently added'}
              </h2>
            </div>
            {activeGenre && (
              <Link className="section__hint" to="/">
                Clear filter
              </Link>
            )}
          </div>
          {booksLoading ? (
            <LoadingSpinner />
          ) : visibleBooks.length === 0 ? (
            <div className="empty-state">
              <h2>{activeGenre ? 'Nothing here yet' : 'Your shelf is waiting'}</h2>
              <p>
                {activeGenre
                  ? `No saved books match "${activeGenre}". Try another genre or clear the filter.`
                  : 'Search Open Library above and save your first title — it will appear here.'}
              </p>
            </div>
          ) : (
            <ul className="poster-grid">
              {visibleBooks.map((book) => (
                <li key={book._id}>
                  <BookCard
                    id={book._id}
                    title={book.title}
                    author={book.author?.name ?? 'Unknown author'}
                    coverId={book.coverId}
                  />
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <GenresSection genres={genres} />

        <footer className="editorial-footer">
          <p>
            <em>bookMoth</em> — a quiet shelf for a loud world
          </p>
        </footer>
      </main>
    </div>
  );
}
