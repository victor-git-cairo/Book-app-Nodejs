// Router files - defined endpoint and the app route
//https://ncoughlin.com/express-js-ejs-render-page-dynamic-content/  - dynamic ejs template

// setup router file
const express = require('express')
const Book = require('../models/book')
const Author = require('../models/author')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', 'upload/bookCovers')
const multer = require('multer') // file uplaod module
const imagesMimeTypes = ['images/jpeg', 'images/png']
const router = express.Router()

// https://medium.com/@svibhuti22/file-upload-with-multer-in-node-js-and-express-5bc76073419f
const upload = multer({
  dest: uploadPath,
  filefilter: (req, file, cb) => {
    cb(null, imagesMimesTyp.includes(file.mimetype))
  }
})

// All books route
router.get('/allbooks', async(req, res) => {
  // res.send('All books')
  let query = Book.find()
  console.log(query.title)
if (req.query.title != null && req.query.title != '') {
  query = query.find({title: new RegExp(req.query.title, 'i')})
}
  try {
    const books = await query.exec()
    res.render('../views/book/allbooks', {
      books: books,
      searchOptions: req.query
    })
    console.log(req.query)
  } catch {
    res.redirect('/')
  }
})

// New book route
router.get('/new', async (req, res) => {
 renderNewPage(res, new Book())
})

// Create book route
// use multer to work with files
// 'cover' is the name that hold the the filename
router.post('/add-book', upload.single('cover'), async (req, res) => {
  //  res.send('Create New Book')
  const fileName = req.file != null ? req.file.filename: null
  console.log(fileName);
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverageImage: fileName,
    description: req.body.description  
  }) 

  try { // try to add code to include books
     const newBook = await book.save()
     res.redirect('/books/allbooks')
  } catch(err) {
    removeBook(book.coverageImage)
    renderNewPage(res, book, true)
    }
})

function removeBook(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.log(err.message)
    console.log(' an error has occurred')
  })
}

async function renderNewPage(res, book, hasError =  false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) 
    params.errorMessage = 'Error Creating Books'
    res.render('../views/book/books', params)
  } catch {
    res.redirect('/books')
  }
}
module.exports = router
