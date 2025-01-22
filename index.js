const customer_routes = require('./router/auth_users.js').authenticated
const genl_routes = require('./router/general.js').general
const session = require('express-session')
const jwt = require('jsonwebtoken')
const express = require('express')

const app = express()
app.use(express.json())

app.use(
  '/customer',
  session({
    secret: 'hogehoge_is_sesssion_secret_key', 
    //not actual fingerprint data. it's just name of session key
    resave: true,
    saveUninitialized: true
  })
)

app.use('/customer/auth/*', function auth(req, res, next) {
  
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).send('Access Denied: No Authorization Header Provided!');
    const token = authHeader.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied: No Token Provided!')

  try {
    const verified = jwt.verify(token, 'kitakita_is_jwt_secret_key')
    req.user = verified
    next()
  } catch (err) {
    res.status(400).send('Invalid Token')
  }
})

app.use('/customer', customer_routes)
//Line1 const customer_routes = require('./router/auth_users.js').authenticated

app.use('/', genl_routes)
//Line2 const genl_routes = require('./router/general.js').general

const PORT = process.env.PORT || 5000
app.listen(PORT, function(){
  console.log(`Server is running in http://localhost:${PORT}/`)
})