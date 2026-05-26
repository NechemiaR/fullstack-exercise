import { useState, type SubmitEvent } from "react";

interface AddBookFormProps {
  onAddBook: (title: string, author: string) => void;
}

function AddBookForm({ onAddBook }: AddBookFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    if (!trimmedTitle || !trimmedAuthor) {
      return;
    }
    onAddBook(trimmedTitle, trimmedAuthor);
    setTitle("");
    setAuthor("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author"
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddBookForm;
