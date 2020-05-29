// Router files - defined endpoint and the app route
//https://ncoughlin.com/express-js-ejs-render-page-dynamic-content/  - dynamic ejs template

// setup router file
const express = require("express");
const Book = require("../models/book");
const Author = require("../models/author");
const path = require("path");
const fs = require("fs");
const uploadPath = path.join("public", "upload/bookCovers");
const multer = require("multer"); // file uplaod module
const imagesMimeTypes = ["images/jpeg", "images/png"];
const router = express.Router();

// https://medium.com/@svibhuti22/file-upload-with-multer-in-node-js-and-express-5bc76073419f
const upload = multer({
  dest: uploadPath,
  filefilter: (req, file, cb) => {
    cb(null, imagesMimesTypes.includes(file.mimetype));
  },
});

// endpoint handler - Display all books
router.get("/allbooks", async (req, res) => {
  console.log("show all books handler");
  // res.send('All books')
  let query = Book.find();
  //console.log(query.title)
  if (req.query.title != null && req.query.title != "") {
    query = query.find({ title: new RegExp(req.query.title, "i") });
  }
  try {
    const books = await query.exec();
    res.render("../views/book/allbooks", {
      books: books,
      searchOptions: req.query,
    });
    // console.log(req.query)
  } catch {
    res.redirect("/");
  }
});

// endpoint handler - render/show new book page
router.get("/new", async (req, res) => {
  console.log('show new book page')
  renderNewPage(res, new Book());
});

// Create book route - use multer to work with files  - cover' is the name that hold the the filename
// file - import multer, change the post to enctype = multipart, uplaod('cover')
// configure multer with dest where the file will live,
//https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088

// endpoint handler - add book code
router.post("/add-book", upload.single("cover"), async (req, res) => {
  console.log("create or add new book handler");
  // body parser
  const fileName = req.file != null ? req.file.filename : null;
  // upload.single('avatar') is Multer middleware. It means we accept a single file with the field name avatar. File upload will be handled by Multer.
  // Multer will add a file property (req.file) for request when it's a single file upload.
  //console.log(req.file);
  //console.log(fileName);
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverageImage: fileName,
    description: req.body.description,
  });

  try {
    // try to add code to include books
    const newBook = await book.save();
    res.redirect("/books/allbooks");
  } catch (err) {
    removeBook(book.coverageImage);  // removed book cover if the book cover not null, avoid duplicates?                                        
    renderNewPage(res, book, true);  // show error message in currentpage 
  } 
});

// endpoint handler - Show Book By ID
router.get("/:id", async (req, res) => {
  console.log("get book by bookId");
  try {
    const book = await Book.findById(req.params.id).populate("author").exec();
    console.log(book);
    res.render("../views/book/showBook", { book: book });
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

// endpoint handler - edit book details
router.get("/:id/edit", async (req, res) => {
  console.log("edit book handler");
  try {
    const book = await Book.findById(req.params.id).populate("author").exec();
    renderEditPage(res, book);
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

// endpoint handler - edit/update/modify book
// https://stackoverflow.com/questions/48976570/cast-to-objectid-failed-for-value-undefined-at-path-id-for-model-post
router.put("/:id", async (req, res) => {
  console.log("update book handler");
  let book;

  try {
    book = await Book.findById(req.params.id);
    console.log(book);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = req.body.publishDate;
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    book.coverImage = req.body.coverageImage;
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch (err) {
    console.log(err.message);
    if (book != null) {
      renderEditPage(res, book, true);
    } else {
      res.redirect("/");
    }
  }
});


// endpoint handler - remove book details
router.delete("/:id", async (req, res) => {
  console.log("delete book handler");
  let book
  try {
    const book = await Book.findById(req.params.id)
    await book.remove();
    res.redirect("/books/allbooks")
    renderEditPage(res, book);
  } catch (err) {
    console.log(err.message);
    if (book != null) {
      res.render("../views/book/showBook", {
        book: book,
        errorMessage: 'Could not remove the message'
      });

    } else {
      res.redirect("/")
    }
  }
});


// helper methods

//https://stackoverflow.com/questions/41411604/how-to-delete-local-file-with-fs-unlink
function removeBook(fileName) {
  fs.unlink(uploadPath +'\\'+ fileName, (err) => {
    if (err) console.log(" an error has occurred");
  })
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, "editBooks", hasError);
}

async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, "books", hasError);
  // new book
}

async function renderFormPage(res, book, form, hasError = false) {
  // form is the name of the page to be loaded - in this case book.ejs
  // the page is appended to the full page location in the page structure
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };

    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating Books";
      } else {
        params.errorMessage = "Error Occured While Adding New Book";   
      }
    }

    res.render(`../views/book/${form}`, params);
  } catch(err) {

    console.log(err)
    res.redirect("/books");
  }
}

module.exports = router;
