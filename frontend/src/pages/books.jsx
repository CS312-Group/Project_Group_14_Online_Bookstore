import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Books = ({ currentUser }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch("http://localhost:3000/books");
                if (!response.ok) {
                    throw new Error("Failed to fetch books");
                }
                const data = await response.json();
                setBooks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

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
                body: JSON.stringify({ book_id: bookId }),
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
            <div id="books-list">
                {books.map((book) => (
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
                                onClick={() => navigate(`/books/${book.id}/reviews`)}
                                className="reviews-button"
                            >
                                View Reviews
                            </button>

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
                ))}
            </div>
        </div>
    );
};

export default Books;
