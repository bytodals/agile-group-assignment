
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