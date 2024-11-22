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
    const [genre, setGenre] = useState("");

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

    const handleFavorite = async (bookId, userId) => {
        try {
            const response = await fetch("http://localhost:3000/favorite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ book_id: bookId, user_id: userId }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to favorite the book.");
            }
    
            const updatedBooks = books.map((book) => {
                if (book.id === bookId) {
                    return {
                        ...book,
                        favorited_by: [...(book.favorited_by || []), currentUser.username],
                    };
                }
                return book;
            });
    
            setBooks(updatedBooks);
            setFilteredBooks(updatedBooks); // Ensure filtered view is also updated
        } catch (error) {
            console.error("Error favoriting the book:", error);
        }
    };
    

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

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleGenreChange = (event) => {
        const selectedGenre = event.target.value;
        // Perform any additional logic here
        // For example, set the selected genre to state
        setGenre(selectedGenre);
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

                <div id="genre_select">
                    <select value={genre} onChange={handleGenreChange}>
                        <option value="">Select Genre</option>
                        <option value="Cooking">Cooking</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Drama">Drama</option>
                        <option value="Nature">Nature</option>
                        <option value="Religion">Religion</option>
                        <option value="History">History</option>
                        <option value="Science">Science</option>
                        <option value="Business & Economics">Business & Economics</option>
                    </select>
                </div>
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
                            </div>

                            <div className="book-actions">
                                {currentUser ? (
                                    <button
                                    onClick={() => handleFavorite(book.id, currentUser.id)}
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
