import type { ReactNode } from 'react';

export type BookType = {
  _id: string;
  title: string;
  genre?: string;
  author: AuthorType;
  available: boolean;
  favorite?: boolean;
};

export type AuthorType = {
  _id: string;
  name: string;
};

export type SavedBooksResponse = {
  books: BookType[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
};

export type MessageSeverity = 'error' | 'warning' | 'info';
export type MessageVariant = 'inline' | 'block';

export interface ErrorMessageProps {
  children: ReactNode;
  title?: string;
  variant?: MessageVariant;
  severity?: MessageSeverity;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export type LoadingSpinnerSize = 'small' | 'medium' | 'large' | number;
export type LoadingSpinnerVariant = 'primary' | 'secondary' | 'neutral';

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  variant?: LoadingSpinnerVariant;
  label?: string;
  overlay?: boolean;
  className?: string;
}

export interface OpenLibrarySearchResultsProps {
  query: string;
}

export interface SavedBooksListProps {
  books: BookType[];
  emptyState: string;
  isLoading?: boolean;
  error?: string | null;
  loadingLabel?: string;
  renderActions?: (book: BookType) => ReactNode;
  summary?: string;
}
