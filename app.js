
// https://www.youtube.com/channel/UCFbNIlppjAuEX4znoulh0Cw - Web Dev Simplified
// https://www.youtube.com/watch?v=UIf1Lh9OZ-k
// install node and run using npm app name or run dev script name if nodemon wa installed
// install mongodb, from Program files - Run mongodb.exe
//https://stackoverflow.com/questions/20796714/how-do-i-start-mongo-db-from-windowsnp
// install dotenv and nodemon
// https://www.toptal.com/nodejs/secure-rest-api-in-nodejs - API secure code sample
// mvc - models, views, controller(router) in expressjs
// project setup - folder creation, endpoint setup, hookups template, import packages, etc

// Load environment variable (env)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// Express Server - server setup
const express = require('express')
var path = require('path')
var bodyParser = require('body-parser') // reads variable from page body
var methodOverride = require('method-override')
const app = express()

// routers - variable declaration
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

// template and folder mapping registrations -  views and file templates
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// mongodb setup
const mongoose = require('mongoose')
mongoose
  .connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Mongo')
  })
  .catch(err => {
    console.log('Could not connect to Mongo')
  })

// middleware calls, and folder registatations
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json())
// override with POST having ?_method=DELETE
app.use(methodOverride('_method')) // delete method override registration

 app.use('/', indexRouter)
// app.use('/', authorRouter)
app.use('/author', authorRouter)
app.use('/books', bookRouter)

// listening port
app.listen(process.env.Port || 3000)
