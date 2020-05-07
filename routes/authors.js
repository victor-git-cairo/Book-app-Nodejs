// Router files - defined endpoint and the app route
//https://ncoughlin.com/express-js-ejs-render-page-dynamic-content/  - dynamic ejs template
//https://github.com/scotch-io/node-api-course

// author router setup
const express = require('express')
const Author = require('../models/author')
const router = express.Router()

// endpoint - all authors
router.get('/', async(req, res) => {
  //res.render('index')
  //res.render('author/authors')
  //res.send('all author')
  try {
    const authors = await Author.find({})
    res.render('../views/author/authors', {
      authors: authors})
  } catch {
    res.direct('/')
  }
})

// endpoint - new author
router.get('/new', (req, res) => {
  //res.render('index')
  res.render('../views/author/newAuthors', { author: new Author() })
})


router.get('/:id', (req, res) => {
  res.send('Show Author'+ req.params.id)
})

// endpoint addauthors
router.post('/addauthor', async (req, res) => {
  // body parser is used to get data from the referred page - req.body.name/ object in form
  try {
    const author = new Author({
      name: req.body.name
    })
    let newAuthor = await author.save() //when fail its goes to catch
    console.log(newAuthor) //when success it print.
    res.redirect('/author/')
  } catch (err) {
    console.error(err) 
      res.render(
        '../views/author/newAuthors', {
         errorMessage: 'Error creating author'
      })
      res.status(500);
  }

  //res.send(req.body.name)
  //res.render('author/newAuthors')
})

// install npm i method-override to test put and delete
router.get('/:id/edit', (req, res) => {
  res.send('Edit '+ req.params.id)
})

router.put('/:id', (req, res) => {
  res.send('Update '+ req.params.id)
})


// method overrride - https://stackoverflow.com/questions/27058516/create-a-href-link-that-uses-http-delete-verb-in-express-js
// right attitude and determination - Kingsley Ijomah
//https://github.com/expressjs/method-override
// https://stackabuse.com/building-a-rest-api-with-node-and-express/  with AjaX 
router.delete('/:id', (req, res) => {
  res.send('Delete Authors' + req.params.id)
})

module.exports = router
