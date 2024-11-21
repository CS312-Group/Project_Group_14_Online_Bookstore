import React from 'react';
import './styles.css';



const Books = ({ books, currentUser }) => {
    return (
        <div>
            {/* Logout Button */}
            <div className="logout-button-container">
                <form action="/logout" method="POST">
                    <button type="submit" className="logout-button">Logout</button>
                </form>
            </div>
            <h1>Book Information</h1>

            <div id="books-list">
                {books.map((book) => (
                    <div key={book.id} className="book-info">
                        <div className="book-details">
                            <h2>{book.title}</h2>
                            {book.image ? (
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    style={{ maxWidth: '200px' }}
                                />
                            ) : (
                                <p>No image available for this book.</p>
                            )}

                            <p>
                                <strong>Author:</strong> {book.author || 'Unknown'}
                            </p>
                            <p>
                                <strong>Description:</strong> Need to add Description
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="book-actions">
                            {/* Favorite Button */}
                            {currentUser ? (
                                <form action="/favorite" method="POST" style={{ marginBottom: '10px' }}>
                                    <input type="hidden" name="book_id" value={book.id} />
                                    <button type="submit">Favorite</button>
                                </form>
                            ) : (
                                <p>Log in to add to favorites.</p>
                            )}

                            {/* Reviews Button */}
                            <a href={`/books/${book.id}/reviews`}>
                                <button type="button" className="reviews-button">
                                    View Reviews
                                </button>
                            </a>

                            {/* Display Users Who Favorited */}
                            {book.favorited_by && book.favorited_by.length > 0 ? (
                                <p>Favorited by users: {book.favorited_by.join(', ')}</p>
                            ) : (
                                <p>No users have favorited this book yet.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Books;
