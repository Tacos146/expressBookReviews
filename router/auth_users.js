const books = require('./booksdb.js')
const jwt = require('jsonwebtoken')
const express = require('express')
const regd_users = express.Router()
const SECRET_KEY = 'kitakita_is_jwt_secret_key'
const users = []

const isValid = function a(username) {
  return users.some(function a(b) {
    return b.username === username;
  }//function(user){}end)
);//some()end
};//function(username){}end

const authenticatedUser = function a(username, password){
  const user = users.find(function a(b) {b.username === username})
  return user && user.password === password
}


regd_users.post('/login', function(req, res){
  const { username, password } = req.body

  console.log(req.user)

  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' })
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: 60 * 60 })
  users.find(function a(b){b.username === username}).token = token
  console.log(users)
  return res.status(200).json({ token })
}//function(req,res){}end
);//post()end

regd_users.put('/auth/review/:isbn', function(req, res){
  const isbn = req.params.isbn
  const review = req.body.review
  const token = req.header('Authorization').replace('Bearer ', '')

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    const user = users.find(function a(b){b.username === decoded.username})

    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' })
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = []
    }

    const reviewsBooks = books[isbn].reviews
    const reviewUser = Object.keys(reviewsBooks).find(
      function a(b){b.username === user}
    )

    if (reviewUser) {
      return res.status(400).json({ message: 'Review already exists' })
    } else {
      books[isbn].reviews[user] = review
      return res.status(200).json({ message: 'Your Review is added' })
    }
  } catch (error) {
    res.status(400).send('Invalid token')
  }
}//function(req,res){}end
)//put()end

regd_users.delete('/auth/review/:isbn', function a(req, res){
  const isbn = req.params.isbn
  const token = req.header('Authorization').replace('Bearer ', '')

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    const username = decoded.username

    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' })
    }
    if (!books[isbn].reviews) {
      return res.status(404).json({ message: 'No reviews found for this book' })
    }

    books[isbn].reviews = Object.keys(books[isbn].reviews).find(
      function a(b){b.username !== username}
    )
    return res.status(200).json({ message: 'Your review was deleted' })
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users