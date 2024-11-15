```
-- Create books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(50),
    favorited_by INTEGER[],
    title VARCHAR(255)
);

-- Create reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    review_content TEXT,
    book_id INTEGER REFERENCES books(id)
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(255)
);
```