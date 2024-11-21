import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import axios from "axios";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';


//declaration of variables that are used in the file
const app = express();
const port = 3000;
dotenv.config({ path: '../.env' });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// current user lets us know if someone is logged in and who
let currentUser = null;

// set up the Client object to be able to connect to the database
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Library",
    password: process.env.DB_PASSWORD,
    port: 5432,
});

// connect to the database and display success
db.connect().then(()=>console.log("Connected")).catch((err)=>console.log(err));

//this allows the use of the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend/build'))); // React build folder
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// function to check if a username already exists
async function userNameExists(username) {
    const queryResult = await db.query("SELECT COUNT(*) FROM users WHERE username = $1", [username]);
    //use parseInt to turn the string into an integer
    return parseInt(queryResult.rows[0].count) > 0;
}

// Renders the signup page
app.get("/signup", (req, res) => {
    res.render("../../frontend/src/views/signup.ejs", { error: null });
});

// Renders the signin page
app.get("/signin", (req, res) => {
    res.render("../../frontend/src/views/signin.ejs", { error: null });
});

// this will log the user out
app.post("/logout", (req, res) => {
    // sets the current user to null to effectively log them out
    currentUser = null;

    // Uncomment when this is created 
    res.render("../../frontend/src/views/signin.ejs", { error: null });
});

// sign in functionality
app.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await db.query(
            "SELECT id FROM users WHERE username = $1 AND password = $2",
            [username, password]
        );

        if (result.rowCount > 0) {
            res.status(200).json({ message: "Signin successful", user: result.rows[0] });
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Route to handle Favorites for Books
app.post('/favorite', async (req, res) => {
    if (!currentUser) {
        return res.status(403).send("You must be logged in to favorite a book.");
    }
    const { book_id } = req.body;
    try {
        await db.query(
            "UPDATE books SET favorited_by = array_append(favorited_by, $1) WHERE id = $2 AND NOT ($1 = ANY(favorited_by))",
            [currentUser.id, book_id]
        );

        res.status(200).json({ message: "Book favorited successfully" });
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).send("Error adding favorite");
    }
});

// sign up functionality
app.post("/signup", async (req, res) => {
    // check if the username already exists
    if(await userNameExists(req.body["username"])){
        // set the error value to true
        var error = 1;
        // rerender the sign up page with an error message
        res.status(201).json({ message: 'Signup successful' });
    }
    // if the user doesnt already exist, submit them into the database
    else{
        await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [req.body["username"], req.body["password"]]);
        // render the sign in page now so the user can sign in
        res.status(201).json({ message: 'Signup successful' });
    }
});

// Define a route to render an EJS view with a message
app.get('/', (req, res) => {
    if(currentUser === null)
    {
        res.status(200).json({ message: 'Signin successful', user: null });
    }
    res.status(200).json({ message: 'Signin successful', user: null });
});

// this was currently set up for testing but shows how to call the database for the books table
// as well as shows how to use the api call to get the information about the books
app.get('/books', async (req, res) => {
    try {
        // Fetch all books from the database
        const queryResult = await db.query("SELECT * FROM books");

        // Loop through each book and fetch details from Google Books API
        const books = await Promise.all(
            queryResult.rows.map(async (book) => {
                const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${book.api_id}?key=${process.env.GOOGLE_BOOKS_API_KEY}`);
                
                // If there are users who favorited this book, fetch their usernames
                const favoritedByIds = book.favorited_by || [];
                let favoritedByUsernames = [];

                if (favoritedByIds.length > 0) {
                    const userQuery = await db.query(
                        "SELECT username FROM users WHERE id = ANY($1)",
                        [favoritedByIds]
                    );
                    favoritedByUsernames = userQuery.rows.map(row => row.username);
                }

                return {
                    id: book.id, 
                    title: response.data.volumeInfo.title,
                    image: response.data.volumeInfo.imageLinks?.thumbnail || null,
                    favorited_by: favoritedByUsernames
                };
            })
        );

        // Render the books page with all book data and pass currentUser
        res.status(200).json(books);

    } catch (error) {
        console.error("Error fetching data from Google Books API:", error);
        res.status(500).send("Error fetching data");
    }
});

// get the reviews under a given book
app.get('/books/:bookId/reviews', async (req, res) => {
    // get the book id for the reviews
    const bookId = parseInt(req.params.bookId);

    try {
        // fetch the book title and reviews for the book id
        const bookQuery = await db.query("SELECT title FROM books WHERE id = $1", [bookId]);
        const reviewsQuery = await db.query("SELECT * FROM reviews WHERE book_id = $1", [bookId]);

        const title = bookQuery.rows[0]?.title || "Unknown Book";
        const reviews = reviewsQuery.rows;

        // render the reviews page
        res.status(200).json({ title, reviews, book_id: bookId });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send("Error fetching reviews");
    }
});

app.post('/books/:bookId/reviews', async (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const { author, title, review_content } = req.body;

    try {
        // insert a new review
        await db.query(
            "INSERT INTO reviews (author, title, review_content, book_id) VALUES ($1, $2, $3, $4)",
            [author, title, review_content, bookId]
        );

        // get all of the reviews for that book
        const result = await db.query(
            "SELECT * FROM reviews WHERE book_id = $1",
            [bookId]
        );
        const reviews = result.rows;

        // render the review page
        res.render('../../frontend/src/views/reviews.ejs', { title: title, reviews: reviews, book_id: bookId });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).send("Error adding review");
    }
});

app.get('/books-by-category/:category', async (req, res) => {
    const { category } = req.params;
    const matchingBooks = [];
    const queryResult = await db.query("SELECT api_id FROM books");
    const books = queryResult.rows;
    let index = 0;
  
    try {
      // Iterate over the book IDs
      for (const bookId of books) {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId.api_id}?key=${process.env.GOOGLE_BOOKS_API_KEY}`);
        const bookData = response.data;
  
        // Check if the categories array contains the desired category
        const categories = bookData.volumeInfo?.categories || [];
        if (categories.some((categoryToCheck) => categoryToCheck.includes(category))) {
          matchingBooks.push(bookData);
        }
      }
      matchingBooks.forEach((book) => {
        console.log(book.id);
    });
      // Send the matching books as the response
      res.status(200).json(matchingBooks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching book data.' });
    }
  });



//this is what the udemy videos used to show the server was running so I added it
app.listen(port,() => {
    console.log(`Server running on port ${port}.`);
});