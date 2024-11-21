import React from 'react';
import './styles.css';

import { useNavigate } from 'react-router-dom';

const Reviews = ({ title, reviews, bookId }) => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Back to Books Button */}
            <div id="back-button-container">
                <button className="back-button" onClick={() => navigate('/books')}>
                    ← Back to Books
                </button>
            </div>

            <h1>Reviews for "{title}"</h1>
            <div id="reviews-section">
                {reviews && reviews.length > 0 ? (
                    <>
                        <h2>Existing Reviews:</h2>
                        <ul>
                            {reviews.map((review, index) => (
                                <li key={index}>
                                    <strong>Author:</strong> {review.author}
                                    <br />
                                    <strong>Title:</strong> {review.title}
                                    <br />
                                    <strong>Review:</strong> {review.review_content}
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p>No reviews available for this book yet.</p>
                )}
            </div>
            <div id="new-review-form">
                <h2>Submit a New Review</h2>
                <form action={`/books/${bookId}/reviews`} method="POST">
                    <label htmlFor="author">Author:</label>
                    <input type="text" id="author" name="author" required />
                    <br />

                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" required />
                    <br />

                    <label htmlFor="review_content">Review:</label>
                    <textarea id="review_content" name="review_content" required></textarea>
                    <br />

                    <button type="submit">Submit Review</button>
                </form>
            </div>
        </div>
    );
};

export default Reviews;
