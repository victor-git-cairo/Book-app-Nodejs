// Router files - defined endpoint and the app route
// https://rapidapi.com/integraatio/api/morningstar1
// https://coursework.vschool.io/express-params-and-query/
// https://stackabuse.com/get-query-strings-and-parameters-in-express-js/

// setup router file
const express = require('express')
const Book = require('../models/book')
const router = express.Router()


router.get('/', async (req, res) => {

  let books
    try {
      books = await Book.find({}).sort({createdAt: 'desc'}).limit(3).exec()
      console.log(req.query)

    } catch {
      console.log(req.query)
      books = []
    }
    
    res.render('index', {
      books: books
    })
})

module.exports = router
