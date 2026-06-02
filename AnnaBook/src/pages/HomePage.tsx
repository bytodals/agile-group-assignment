import { Home, Search, Bookmark } from "lucide-react";
import BookList from "../components/BookList/BookList";

export default function HomePage() {
  return (
    <div className="hp-root" data-sidebar-open="false">
      <aside className="hp-sidebar" aria-hidden>
        <nav className="hp-side-nav">
          <button className="hp-side-item">
            <Home className="icon" size={18} /> Home
          </button>
          <button className="hp-side-item">
            <Search className="icon" size={18} /> Search
          </button>
          <button className="hp-side-item">
            <Bookmark className="icon" size={18} /> Shelf
          </button>
        </nav>
      </aside>

      <main className="hp-main">
        
        <header className="hp-header">
          <button className="hp-menu" aria-label="open menu">
            <Home size={20} />
          </button>
          <h1 className="hp-brand">bookMoth</h1>
        </header>

        <section className="hp-hero">
          <h2 className="hp-hero-title">Echoes of the Old World</h2>
          <span className="hp-hero-badge">Book of the month</span>
          <p className="hp-hero-desc">
            A sweeping narrative that redefines our understanding of lost
            civilizations.
          </p>
        </section>

        <div className="hp-search">
          <div className="hp-search-box">
            <input placeholder="Search by title, author, or ISBN..." />
            <button aria-label="search">
              <Search size={18} />
            </button>
          </div>
        </div>

        <section className="hp-section">
          <h2 className="hp-section-title">New Arrivals</h2>
          <div className="hp-grid hp-grid-2">
            <BookList />
          </div>
        </section>

        <section className="hp-section">
          <h2 className="hp-section-title">Popular Genres</h2>
          <div className="hp-grid hp-grid-3">
            <div className="hp-card">Mystery</div>
            <div className="hp-card">Sci-Fi</div>
            <div className="hp-card">History &amp; Lore</div>
          </div>
        </section>
      </main>
    </div>
  );
}
