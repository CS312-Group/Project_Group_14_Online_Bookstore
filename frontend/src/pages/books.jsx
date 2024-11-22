import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Books = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = location.state?.user; // Retrieve user from location state

    console.log("Current User:", currentUser); // Debug log

    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch("http://localhost:3000/books");
                if (!response.ok) {
                    throw new Error("Failed to fetch books");
                }
                const data = await response.json();
                // show all books initially
                setBooks(data);
                setFilteredBooks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    useEffect(() => {
        if (search) {
            // filter the books from what is typed and matches titles
            const filtered = books.filter((book) =>
                book.title.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredBooks(filtered);
        } else {
            // otherwise show all the books
            setFilteredBooks(books);
        }
    }, [search, books]);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:3000/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                navigate("/signin");
            }
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const handleFavorite = async (bookId) => {
        try {
            const response = await fetch("http://localhost:3000/favorite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Include cookies for session authentication
                body: JSON.stringify({ book_id: bookId }), // Pass the book ID
            });

            if (!response.ok) {
                throw new Error("Failed to favorite the book");
            }

            // Refresh books list to update favorited status
            const updatedBooks = books.map((book) =>
                book.id === bookId
                    ? { ...book, favorited_by: [...(book.favorited_by || []), currentUser.username] }
                    : book
            );
            setBooks(updatedBooks);
        } catch (err) {
            console.error("Error adding favorite:", err);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    if (loading) {
        return <div>Loading books...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div className="logout-button-container">
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>

            <h1>Book Information</h1>

            <div id="search-bar">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search for books by title"
                />
            </div>

            <div id="books-list">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                        <div className="book-info" key={book.id}>
                            <div className="book-details">
                                <h2>{book.title}</h2>
                                {book.image ? (
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        style={{ maxWidth: "200px" }}
                                    />
                                ) : (
                                    <p>No image available for this book.</p>
                                )}
                                <p>
                                    <strong>Author:</strong> {book.author || "Unknown"}
                                </p>
                                <p>
                                    <strong>Description:</strong> Need to add Description
                                </p>
                            </div>

                            <div className="book-actions">
                                {currentUser ? (
                                    <button
                                        onClick={() => handleFavorite(book.id)}
                                        style={{ marginBottom: "10px" }}
                                    >
                                        Favorite
                                    </button>
                                ) : (
                                    <p>Log in to add to favorites.</p>
                                )}

                                <button
                                    onClick={() => navigate(`/books/${book.id}/moreInfo`)}
                                    style={{ marginBottom: "10px" }}
                                >
                                    More Info
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(`/books/${book.id}/reviews`, { state: { user: currentUser } })
                                    }
                                    className="reviews-button"
                                >
                                    View Reviews
                                </button>

                                {book.average_score !== null ? (
                                    <p>Average Review Score: {Math.round(book.average_score)}/5</p>
                                ) : (
                                    <p>No reviews yet.</p>
                                )}

                                {book.favorited_by && book.favorited_by.length > 0 ? (
                                    <p>
                                        Favorited by users: {book.favorited_by.join(", ")}
                                    </p>
                                ) : (
                                    <p>No users have favorited this book yet.</p>
                                )}
                            </div>
                            <hr />
                        </div>
                    ))
                ) : (
                    <p>No books found.</p>
                )}
            </div>
        </div>
    );
};

export default Books;
