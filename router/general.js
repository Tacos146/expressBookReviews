const users = require('./auth_users.js').users
const books = require('./booksdb.js')
const express = require('express')

const public_users = express.Router()

public_users.post('/register', function (req, res) {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) { //if username or password does not exist
        return res.status(400).json({ message: 'Invalid username or password' })
    }
    if (users.includes(username)) { //if users which is an array[] contains imputted name
        return res.status(400).json({ message: 'User already exists' })
    } else {
        users.push({ username, password })
        console.log(users)
        console.log(users.includes(username))
        return res.status(200).json({ message: 'New user was registered' })
    }
})

//GET book list
public_users.get('/', function (req, res) {
    new Promise(function (resolve) {
        resolve(JSON.stringify(books))
    }//function(a,b){}end()
    )//Promise(function)end
        .then(function (data) {
            return res.status(200).json({ data })
        }//function(data){}end
        )//then(function)end
}   //function(req,res)end
)   //get()end

//GET detail by isbn
public_users.get('/isbn/:isbn', function (req, res) {
    new Promise(function (resolve, reject) {
        const isbn = req.params.isbn
        const book = books[isbn]
        if (!book) {
            reject()
        } else {
            resolve(book)
        }
    }//function(resolve,reject)end
    )//Promimse()end
        .then(function (data) {
            res.status(200).json(data)
        }//function(data)end
        )//then()end
        .catch(function () {
            res.status(404).json({ message: "Not found" })
        })
})

//GET detail by author
public_users.get('/author/:author', function (req, res) {
    new Promise(function (resolve, reject) {
        const author = req.params.author
        let result = [];
        for (let isbn in books) {
            if (books[isbn].author === author) {
                result.push({ isbn, ...books[isbn] });
            }
        }//for end
        if (result != 0) {
            resolve(result);
        }
        else reject();
    })
        .then(function (data) {
            res.status(200).json(data)
        })
        .catch(function () {
            res.status(404).json({ message: "Not found" })
        })
})

//GET detail by title
public_users.get('/title/:title', function (req, res) {
    new Promise(function (resolve, reject) {
        const title = req.params.title
        const booksByTitle = Object.values(books).filter(function (b) {
            b.title.includes(title)
        }//function(b)end
        )//filter()end
        if (booksByTitle.length === 0) {
            reject('No books found with this title')
        } else {
            resolve(booksByTitle)
        }
    })
        .then(function (data) {
            res.status(200).json(data)
        })
        .catch(function (error) {
            res.status(404).json({ message: error })
        })
})

//GET review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn
    const book = books[isbn]
    if (!book || !book.reviews) {
        return res.status(404).json({ message: 'Reviews not found for this book' })
    }
    return res.status(200).json(book.reviews)
})

module.exports.general = public_users