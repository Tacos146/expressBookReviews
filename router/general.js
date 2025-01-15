const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
const { username, password } = req.body;

  // ユーザー名やパスワードが提供されていない場合のエラーハンドリング
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // ユーザー名が既に存在するかを確認
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let book = JSON.stringify(books);
  return res.status(300).json({book});});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let bookIsbn = books[isbn];
  return res.status(300).json({bookIsbn});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    // Extract the author from the request parameters
    let author = req.params.author;

    // Initialize an empty array to store matching books
    let matchingBooks = [];
  
    // Iterate over all books
    for (let isbn in books) {
      if (books[isbn].author === author) {
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    }
  
    // If no books are found, return a 404 error
    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }
  
    // Return the matching books
    return res.status(300).json(matchingBooks);
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // Extract the author from the request parameters
  let title = req.params.title;

  // Initialize an empty array to store matching books
  let matchingBooks = [];

  // Iterate over all books
  for (let isbn in books) {
    if (books[isbn].title === title) {
      matchingBooks.push({ isbn, ...books[isbn] });
    }
  }

  // If no books are found, return a 404 error
  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found for this title" });
  }

  // Return the matching books
  return res.status(300).json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   //Write your code here
   let isbn = req.params.isbn;
   let bookReview = books[isbn].reviews;
   return res.status(300).json({bookReview});
  });

module.exports.general = public_users;
