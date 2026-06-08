import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import CoverImage from '../CoverImage/CoverImage';

type BookCardProps = {
  id: string;
  title: string;
  author: string;
  coverId?: number;
};

export default function BookCard({ id, title, author, coverId }: BookCardProps) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <Link className="poster-card" to={`/books/${id}`} aria-label={`${title} by ${author}`}>
        <motion.div
          className="poster-card__cover"
          whileHover={{ rotate: -2, scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <CoverImage coverId={coverId} title={title} author={author} size="md" />
        </motion.div>
        <h3 className="poster-card__title">{title}</h3>
        <p className="poster-card__author">{author}</p>
      </Link>
    </motion.div>
  );
}
