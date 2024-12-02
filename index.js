const express = require("express");
const connection = require("./db.js");
const Book = require("./models/Book.js");
const User = require("./models/User.js");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const Borrow = require("./models/Borrow.js");
const Return = require("./models/Return.js");
const dotenv = require("dotenv");

const PORT = 8080;

connection();

const app = express();

app.use(express.json());
dotenv.config();

// const booksData = [
//   {
//     name: "The Guide",
//     author: "R.K. Narayan",
//     genre: "Fiction",
//     type: "Indian",
//   },
//   {
//     name: "Wings of Fire",
//     author: "A.P.J. Abdul Kalam",
//     genre: "Autobiography",
//     type: "Indian",
//   },
//   {
//     name: "To Kill a Mockingbird",
//     author: "Harper Lee",
//     genre: "Classic",
//     type: "International",
//   },
//   {
//     name: "Mahabharata",
//     author: "Vyasa",
//     genre: "Epic",
//     type: "Indian",
//   },
//   {
//     name: "1984",
//     author: "George Orwell",
//     genre: "Thriller",
//     type: "International",
//   },
// ];

// Book.insertMany(booksData).then(() =>
//   console.log("Books inserted successfully")
// ).catch((err) => console.log("Error while inserting books"));

const userData = [
  {
    name: "Ritesh",
    username: "ritesh7",
    password: "password123",
    email: "ritesh@gmail.com",
    mobile: 9876543210,
    admin: true,
  },
  {
    name: "Tanvi",
    username: "tanvi",
    password: "securepass",
    email: "tanvi@gmail.com",
    mobile: 9876543211,
    admin: false,
  },
  {
    name: "Sanket",
    username: "sanket23",
    password: "mypassword",
    email: "sanket@gmail.com",
    mobile: 9876543212,
    admin: false,
  },
  {
    name: "Shreyash Singh",
    username: "shreyash12",
    password: "shreyash1234",
    email: "shreyash@gmail.com",
    mobile: 9876543213,
    admin: false,
  },
  {
    name: "Rushi",
    username: "rushi",
    password: "rushi123",
    email: "rushi@gmail.com",
    mobile: 9876543214,
    admin: false,
  },
];

// User.insertMany(userData)
//   .then(() => console.log("Users inserted successfully"))
//   .catch((err) => console.log("Error while inserting users"));

const borrowData = [
  {
    username: "ritesh7",
    bookid: new mongoose.Types.ObjectId("674db5591faa3f6f6d6ee742"),
    duedate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  },
  {
    username: "ritesh7",
    bookid: new mongoose.Types.ObjectId("674db5591faa3f6f6d6ee740"),
    duedate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
  },
  {
    username: "tanvi",
    bookid: new mongoose.Types.ObjectId("674db5591faa3f6f6d6ee740"),
    duedate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },
  {
    username: "tanvi",
    bookid: new mongoose.Types.ObjectId("674db5591faa3f6f6d6ee741"),
    duedate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    username: "sanket23",
    bookid: new mongoose.Types.ObjectId("674db5591faa3f6f6d6ee740"),
    duedate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },
];

// Borrow.insertMany(borrowData)
//   .then(() => console.log("Borrow data inserted successfully"))
//   .catch((err) => console.log("Error while inserting borrow data"));

const returnData = [
  {
    username: "ritesh7",
    bookid: new mongoose.Types.ObjectId("674db5591faa3f6f6d6ee742"),
    duedate: new Date("2024-12-12T13:49:29.039+00:00"),
    fine: 10,
  },
  {
    username: "ritesh7",
    bookid: new mongoose.Types.ObjectId("674db5591faa3f6f6d6ee741"),
    duedate: new Date("2024-12-14T13:49:29.039+00:00"),
    fine: 10,
  },
  {
    username: "tanvi",
    bookid: new mongoose.Types.ObjectId("674db5591faa3f6f6d6ee741"),
    duedate: new Date("2024-12-17T13:49:29.039+00:00"),
    fine: 5,
  },
  {
    username: "tanvi",
    bookid: new mongoose.Types.ObjectId("674db5591faa3f6f6d6ee740"),
    duedate: new Date("2024-12-09T13:49:29.039+00:00"),
    fine: 5,
  },
  {
    username: "sanket23",
    bookid: new mongoose.Types.ObjectId("674db5591faa3f6f6d6ee740"),
    duedate: new Date("2024-12-22T13:49:29.039+00:00"),
    fine: 15,
  },
];

// Return.insertMany(returnData)
//   .then(() => console.log("Return data inserted successfully"))
//   .catch((err) => console.log("Error while inserting returnin data"));

app.post("/register", async (req, res) => {
  const { name, username, password, email, mobile, admin } = req.body;
  const user = new User({
    name,
    username,
    password,
    email,
    mobile,
    admin,
  });
  try {
    const newUser = await user.save();
    return res.json({ newUser, message: "Registered successfully" });
  } catch (error) {
    return res.json(error);
  }
});

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const HEADER_SECRET_KEY = process.env.HEADER_SECRET_KEY;

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(user.password === password)) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign(
    { username: user.username, admin: user.admin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.json({ token, message: "Login successful" });
});

app.get("/session", (req, res) => {
  const token = req.header(HEADER_SECRET_KEY);

  if (!token) return res.status(401).json({ message: "No token found" });

  const verified = jwt.verify(token, JWT_SECRET_KEY);

  if (verified) return res.json({ message: "Session started..." });
  return res.json({ message: "Invalid token" });
});

app.get("/all-books", async (req, res) => {
  try {
    const books = await Book.find();
    return res.json({ books });
  } catch (error) {
    return res.json({ error });
  }
});

app.get("/all-users", async (req, res) => {
  try {
    const users = await User.find();
    return res.json({ users });
  } catch (error) {
    return res.json({ error });
  }
});

app.post("/new-book", async (req, res) => {
  const { name, author, genre, type } = req.body;
  try {
    const book = new Book({ name, author, genre, type });
    const newBook = await book.save();
    return res.json({ newBook, message: "Book inserted" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.post("/borrow", async (req, res) => {
  const { bookName } = req.body;
  const token = req.header(HEADER_SECRET_KEY);

  const verified = jwt.verify(token, JWT_SECRET_KEY);

  const book = await Book.findOne({ name: bookName });

  if (!book || !book.available) return res.json({ message: "No book found" });

  const borrow = new Borrow({
    username: verified.username,
    bookid: book._id,
  });

  book.available = false;
  await book.save();

  const newBorrow = await borrow.save();

  return res.json({ newBorrow, message: "Book borrowed successfully" });
});

app.post("/return", async (req, res) => {
  const { bookName } = req.body;
  const token = req.header(HEADER_SECRET_KEY);
  const verified = jwt.verify(token, JWT_SECRET_KEY);

  const book = await Book.findOne({ name: bookName });

  const borrowData = await Borrow.findOne({
    bookid: book._id,
    username: verified.username,
  });

  let fine = 0;
  let currentDate = new Date();
  let dueDate = borrowData.duedate;

  if (currentDate > dueDate) fine = 10;

  const returnData = new Return({
    username: verified.username,
    bookid: book._id,
    dueDate,
    fine,
  });

  await returnData.save();
  book.available = true;

  return res.json({ message: "Book returned successfully" });
});

app.put("/updatebook", async (req, res) => {
  const { name, author, type, genre } = req.body;
  const token = req.header(HEADER_SECRET_KEY);
  const verified = jwt.verify(token, JWT_SECRET_KEY);

  if (!verified.admin)
    return res.json({ message: "Only admin can update books" });

  const book = await Book.findOne({ name: name });

  (book.author = author || book.author),
    (book.type = type || book.type),
    (book.genre = genre || book.genre);

  const updatedBook = await book.save();

  return res.json({ updatedBook, message: "Book updated" });
});

app.listen(PORT, () => {
  try {
    console.log(`Server is up and running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
