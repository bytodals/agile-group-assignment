import type { BookType, AuthorType } from "../types";


//Används den bara här? Annars, lägg i Types-mappen?
type DbBook = {
  _id: string;
  title: string;
  genre?: string; 
  author: {
    _id: string;
    name: string;
  };
  available: boolean;
  createdAt: string; 
  updatedAt: string; 
};


//Funktion för att söka i bokdatabasen.
export default async function searchDbBooks(searchWord : string): Promise<BookType[]> {

  console.log("RUNNING NEW SEARCH FUNCTION");
  try {
    
    const encodedSearchWord = encodeURIComponent(searchWord);

    const [booksRes, authorsRes] = await Promise.all([
      fetch(`/api/books/search?q=${encodedSearchWord}`),
      fetch(`/api/authors/search?q=${encodedSearchWord}`),
    ]);

    const books = await booksRes.json() as DbBook[];
    const authors = await authorsRes.json() as AuthorType[];

    //hämtar böcker per matchad författare
    const authorBooks = (
      await Promise.all(
        authors.map(async (author) => {
        const res = await fetch(`/api/books/author/${author._id}`);
        return (await res.json()) as DbBook[];
  })
      )
    ).flat();

    //slå ihop och ta bort dubletter
    const allBooks = [...books, ...authorBooks];
    const uniqueResult = allBooks.filter(
      (book, i, arr) => arr.findIndex((x) => x._id === book._id) === i,
    );

    return uniqueResult.map((book) => ({
      _id: book._id,
      title: book.title,
      genre: book.genre,
      author: book.author,
      available: book.available,
    }));
  } catch (e) {
    console.error(e);
    throw e;
  } 
}



