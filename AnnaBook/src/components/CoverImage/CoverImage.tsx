import { useState } from 'react';

type CoverSize = 'sm' | 'md' | 'lg';

type CoverImageProps = {
  coverId?: number | null;
  title: string;
  author?: string;
  size?: CoverSize;
  className?: string;
};

const OL_SIZE: Record<CoverSize, 'S' | 'M' | 'L'> = {
  sm: 'M',
  md: 'M',
  lg: 'L',
};

export default function CoverImage({
  coverId,
  title,
  author,
  size = 'md',
  className,
}: CoverImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const url =
    coverId && !errored
      ? `https://covers.openlibrary.org/b/id/${coverId}-${OL_SIZE[size]}.jpg`
      : null;

  const wrapperClass = ['cover', `cover--${size}`, className].filter(Boolean).join(' ');

  if (!url) {
    return (
      <div className={wrapperClass} role="img" aria-label={`Cover for ${title}`}>
        <div className="cover-fallback">
          <span className="cover-fallback-title">{title}</span>
          {author && <span className="cover-fallback-author">{author}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {!loaded && <div className="cover-skeleton" aria-hidden />}
      <img
        src={url}
        alt={`Cover for ${title}`}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}
