"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Book {
  id: string;
  title: string;
  date: string;
  checked: boolean;
}

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();

  // Get All Books
  useEffect(() => {
    const getBooks = async () => {
      const response = await fetch("/api/books");
      const data = await response.json();
      setBooks(data);
    };

    getBooks();
  }, []);

  const handleCheck = (index: number) => {
    const updatedBooks = [...books];
    updatedBooks[index].checked = !updatedBooks[index].checked;
    setBooks(updatedBooks);

    // setBooks((prevBooks) =>
    //   prevBooks.map((book) => {
    //     if (book.id === index.toString()) {
    //       return { ...book, checked: !book.checked };
    //     } else {
    //       return book;
    //     }
    //   })
    // );
  };
  const handleDelete = async (book: Book) => {
    try {
      const response = await fetch(`/api/delete-book/${book.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        alert("Book deleted successfully");
        setBooks((prevBooks) =>
          prevBooks.filter((book: Book) => book.id !== data.id)
        );
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (book: Book) => {
    router.push(`/books/edit?id=${book.id}`);
  };

  return (
    <div className="w-full max-w-5x1 mx-auto text-center">
      <h1 className="text-3x1 font-bold mt-20">Books List</h1>
      <ul className="flex flex-col">
        {books.length === 0 && (
          <p className="text-2x1 mt-10">No books to show.</p>
        )}

        {books.length > 0 &&
          books.map((book: Book, index: number) => (
            <div
              key={book.id}
              className="text-2xl max-w-xl flex items-center bg-gray-100 p-3 rounded-lg gap-4 my-5 mb-0 ml-5"
            >
              <input type="checkbox" onClick={() => handleCheck(index)} />
              <li className="font-bold" key={book.id}>
                {book.title}
              </li>
              <li>{book.date}</li>

              <button
                className=" text-xs text-gray-900 leading-7 hover:text-gray-900/70"
                disabled={!book.checked}
                onClick={() => handleDelete(book)}
              >
                {book.checked ? "Delete" : ""}
              </button>
              <button
                disabled={!book.checked}
                className="text-xs text-gray-900 hover:text-gray-900/70"
                onClick={() => handleEdit(book)}
              >
                {book.checked ? "Edit Book" : ""}
              </button>
            </div>
          ))}
      </ul>
      <div>
        <button
          className="tex-gray-900 leading-7 mt-4 underline hover:text-gray-900/70"
          onClick={() => router.push("/create-book")}
        >
          Create New Book
        </button>
      </div>
    </div>
  );
};

export default BooksPage;
