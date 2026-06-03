export type BookType = {
  _id: string;
  title: string;
  genre?: string;
  author: AuthorType;
  available: boolean;
};

export type AuthorType = {
  _id: string;
  name: string;
};
