import { useState, useEffect } from "react";
import  searchDbBooks  from "../services/api.ts";
import type {BookType} from "../types";
import LoadingSpinner from "./ui/LoadingSpinner.tsx";



export default function BookSearch() {

  const [isLoading, setIsLoading] = useState(false); 
  const [isError, setIsError] = useState(false); 

  const [searchWord, setSearchWord] = useState("");
  const [dbSearchResult, setDbSearchResult] = useState<BookType[]>([]);
  
  async function searchBookDatabase(searchInput: string) {
    try {
        setIsLoading(true);
        setIsError(false);
        const result = await searchDbBooks(searchInput);
        setDbSearchResult(result);
    } catch(e){
        console.error(e);
        setIsError(true);
    }finally{
        setIsLoading(false);
    }
  }


  //Körs när man skriver nåt i sökrutan
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchWord.trim() !== "") {
        searchBookDatabase(searchWord);
      } else {
        setDbSearchResult([]);
      }
    }, 400);

    return () => clearTimeout(timeout); //rensar timeout om användaren skriver mer
  }, [searchWord]);


  //Använda BookCard-komponenten i listan nedan?
  return (
      <div>
        <label>
          Sök böcker i databasen: 
          <input
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          ></input>
        </label>

        {isLoading && <LoadingSpinner/>}

        {isError && <p>"Errormeddelande"</p>}

        {!isLoading && dbSearchResult?.length === 0 && searchWord?.length > 1 && (
          <p>Inga böcker matchar ditt sökord</p>
        )}

        <ul>
          {dbSearchResult.map((book) => (
              <li key={book._id}>
                {book.title}
                {" "}
                {book.genre}
                {" "}
                {book.author.name}
                {" "}
                {book.available ? "Tillgänglig" : "Utlånad"}
              </li>
            ))}
        </ul>
      </div>
  );
}

