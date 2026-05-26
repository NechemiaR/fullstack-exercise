import BookList from "./components/BookList";
import AddBookForm from "./components/AddBookForm";
import type { Book } from "./types";
import { useState, useEffect  } from "react";


function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  async function handleAddBook(title: string, author: string) {
    const response = await fetch("http://localhost:3000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, author }),
    });
    const newBook = await response.json();
    setBooks((prevBooks) => [...prevBooks, newBook]);
  }

  useEffect(() => {
    fetch("http://localhost:3000/books")
      .then((response) => response.json())
      .then((data) => {
      setBooks(data);
      setLoading(false);
    })
      .catch((err) => console.error("Failed to load books:", err));
  }, []);

  return (
    <div>
      <h1>Books</h1>
      <AddBookForm onAddBook={handleAddBook} />
      {loading ? <p>Loading books...</p> : <BookList books={books} />}
    </div>
  );
}

export default App;
