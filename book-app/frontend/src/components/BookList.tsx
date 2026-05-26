import type { Book } from "../types";

interface BookListProps {
  books: Book[];
}

function BookList({ books }: BookListProps) {
  if (books.length === 0) {
    return <p>No books yet.</p>;
  }

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          <strong>{book.title}</strong> — {book.author}
        </li>
      ))}
    </ul>
  );
}

export default BookList;
