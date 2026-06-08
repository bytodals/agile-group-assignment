import { Link } from 'react-router-dom';

type TopBarProps = {
  active?: 'home' | 'shelf';
};

export default function TopBar({ active }: TopBarProps) {
  return (
    <header className="topbar">
      <Link to="/" className="topbar__brand">
        book<em>Moth</em>
      </Link>
      <nav className="topbar__nav" aria-label="Primary">
        <Link to="/" className={`topbar__link${active === 'home' ? ' topbar__link--active' : ''}`}>
          Home
        </Link>
        <Link
          to="/saved-books"
          className={`topbar__link${active === 'shelf' ? ' topbar__link--active' : ''}`}
        >
          Shelf
        </Link>
      </nav>
    </header>
  );
}
