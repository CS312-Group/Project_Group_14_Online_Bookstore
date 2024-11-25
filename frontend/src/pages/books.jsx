import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Books = () => {
    // get the current site location
    const location = useLocation();
    // get the nabigate functionality into a variable
    const navigate = useNavigate();

    // Retrieve user from location state
    const currentUser = location.state?.user;
    //check that current user is still set
    console.log("Current User:", currentUser);

    // set the use states that will keep track of all of the variables
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");

    useEffect(() => {
        // this will fetch the books by calling the backend to call the API
        const fetchBooks = async () => {
            try {
                // makes a GET request to the backend /books
                const response = await fetch("http://localhost:3000/books");
                if (!response.ok) {
                    throw new Error("Failed to fetch books");
                }
                // store the parsed response in the data variable
                const data = await response.json();
                // set the books and filtered books variables
                setBooks(data);
                setFilteredBooks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        // call the function to actually get the info
        fetchBooks();
    }, []);

    useEffect(() => {
        if (search) {
            // filter the books from what is typed and matches titles
            const filtered = books.filter((book) =>
                book.title.toLowerCase().includes(search.toLowerCase())
            );
            // update the filtered books state
            setFilteredBooks(filtered);
        } else {
            // otherwise show all the books
            setFilteredBooks(books);
        }
        // this line makes this function run whenever the search or books state changes
        // allows the search filter to be immediate as the user is typing
    }, [search, books]);

    // handles the favoriting of a book
    const handleFavorite = async (bookId, userId) => {
        try {
            // send a POST request to the /favorite in the backend
            const response = await fetch("http://localhost:3000/favorite", {
                method: "POST",
                // sends the information as a json
                headers: {
                    "Content-Type": "application/json",
                },
                // add the book ID and user ID to the body of the POST
                body: JSON.stringify({ book_id: bookId, user_id: userId }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to favorite the book.");
            }

            // loop through the books to find the matching array
            const updatedBooks = books.map((book) => {
                if (book.id === bookId) {
                    return {
                        // this updates the favorited_by array to add the new username
                        ...book,
                        favorited_by: [...(book.favorited_by || []), currentUser.username],
                    };
                }
                // if the book is not being favorited it just returns that book
                return book;
            });

            // Update the books and filteredbooks state
            setBooks(updatedBooks);
            setFilteredBooks(updatedBooks);
        } catch (error) {
            console.error("Error favoriting the book:", error);
        }
    };
    

    const handleLogout = async () => {
        try {
            // sends a POST request to the backend /logout
            const response = await fetch("http://localhost:3000/logout", {
                method: "POST",
                credentials: "include",
            });

            // redirect to the /signin
            if (response.ok) {
                navigate("/signin");
            }
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    // function to set the search state as the user is typing
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    // function to handle the genre changes
    const handleGenreChange = (event) => {
        const selectedGenre = event.target.value;
        setGenre(selectedGenre);
    };

    // while data is loading display a loading message
    if (loading) {
        return <div>Loading books...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {/*create the logout button*/}
            <div className="logout-button-container">
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>

            <h1>Book Information</h1>

            {/*create search bar and genre section*/}
            <div id="search-bar">
                {/*create an input field for search*/}
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search for books by title"
                />

                {/*Create dropdown to select a genre*/}
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

            {/*create div to show the books*/}
            <div id="books-list">
                {filteredBooks.length > 0 ? (
                    // go through each of the books in the filteredArray and display the books
                    filteredBooks.map((book) => (
                        <div className="book-info" key={book.id}>
                            <div className="book-details">
                                <h2>{book.title}</h2>
                                {book.image ? (
                                    // display the image of the cover
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        style={{ maxWidth: "200px" }}
                                    />
                                ) : (
                                    <p>No image available for this book.</p>
                                )}
                            </div>

                            {/*create the div for book actions*/}
                            <div className="book-actions">
                                {/*create the favorite button*/}
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

                                {/*create the more info button*/}
                                <button
                                    onClick={() => navigate(`/books/${book.id}/moreInfo`, { state: { user: currentUser } })}
                                    style={{ marginBottom: "10px" }}
                                >
                                    More Info
                                </button>

                                {/*create the reviews button*/}
                                <button
                                    onClick={() =>
                                        navigate(`/books/${book.id}/reviews`, { state: { user: currentUser } })
                                    }
                                    className="reviews-button"
                                >
                                    View Reviews
                                </button>

                                {/*show reviews and favorited by information*/}
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
