# Project_Group_14_Online_Bookstore

# Create all tables
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
    password VARCHAR(255)'
);
```

# Add the data to the table for Books
```
INSERT INTO books (id, api_id, favorited_by, title)
VALUES
(1, 'zyTCAlFPjgYC', '{}', 'The Google Story (2018 Updated Edition)'),
(2, 'UxOKDwAAQBAJ', '{}', 'Joy of Cooking'),
(3, 'kbg_CgAAQBAJ', '{}', 'Cravings'),
(4, 'Ja_e81o925sC', '{}', 'The Breakfast Book'),
(5, 'sSMxAAAAQBAJ', '{}', 'Hot Sour Salty Sweet'),
(6, 'MEfWYY3G1MkC', '{}', 'Proof'),
(7, 'yCeGJKSIZkYC', '{}', 'The Taming of the Shrew'),
(8, 'zmQKcdh4i-oC', '{}', 'Reading Greek Tragedy'),
(9, '2ht_Rrda7G0C', '{}', 'A Man for All Seasons'),
(10, 'lclWAAAAQBAJ', '{}', 'If Beale Street Could Talk'),
(11, 'KVGd-NabpW0C', '{}', 'The Plague'),
(12, 'oNY0DwAAQBAJ', '{}', 'There There'),
(13, 'O-XiVJO1K1gC', '{}', 'The Bean Trees'),
(14, 'bCwuxmvsDoYC', '{}', 'Silent Spring'),
(15, 'tiq0ZTidIuoC', '{}', 'A Plants-Eye View of the World'),
(16, 'r8l-DMj3XTgC', '{}', 'The Human Impact on the Natural Environment'),
(17, 'iJfuAAAAMAAJ', '{}', 'The Sea Around Us'),
(18, 'Q2FgDwAAQBAJ', '{}', 'Basics of Biblical Greek Grammar'),
(19, 'Fi7bXWEd0c4C', '{}', 'The Epic of Eden'),
(20, 'HMlJAwAAQBAJ', '{}', 'Samaritan Documents'),
(21, '5UwhCwAAQBAJ', '{}', 'Dark Night of the Soul'),
(22, 'WADDM36d3TAC', '{}', 'The Discarded Image'),
(23, '_LcYDAAAQBAJ', '{}', 'The Black Death'),
(24, '9F7i5u4sOtgC', '{}', 'Conservatism'),
(25, 'GTw4AAAAQBAJ', '{}', 'The Blitzkrieg Legend'),
(26, 'JFWNEAAAQBAJ', '{}', 'Mismeasure of Man'),
(27, 'BKQjEQAAQBAJ', '{}', 'Consciousness Explained'),
(28, 'qIDC7ybvHQEC', '{}', 'Quaternary Extinctions'),
(29, 'VXIc358dF4gC', '{}', 'The Universe in a Nutshell'),
(30, 'Fv8846OSbvwC', '{}', 'Essays in Positive Economics'),
(31, 'lwKRgkLNgXsC', '{}', 'Predictably Irrational'),
(32, '-e3HP9DzwkIC', '{}', 'Grundrisse'),
(33, 'JA_IYJ0P4ZkC', '{}', 'The Ascent of Money');
```

# Add the data to the table users
```
INSERT INTO users (id, username, password)
VALUES
(1, 'MichaelV', '1234'),
(2, 'AshishA', '1234'),
(3, 'MeaghanF', '1234'),
(4, 'MaxP', '1234'),
(5, 'JoshV', '1234');
```

# Add the data to the table reviews
```
INSERT INTO reviews (id, author, title, review_content, book_id, score)
VALUES
(1, 'MichaelV', 'Loved it!', 'This is personally one of my favorite books! Loved every word!', 1, 4),
(2, 'MeaghanF', 'It was okay', 'Personally, I did not find this book to be super interesting.', 1, 1);
```
