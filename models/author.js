//https://medium.com/@dinyangetoh/how-to-build-simple-restful-api-with-nodejs-expressjs-and-mongodb-99348012925d
// Author table
const mongoose = require("mongoose");
const Book = require("../models/book");

// column definition
var authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// check if theres still a book associated to the author, if so then throw an error?
authorSchema.pre("remove", function(next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error(" this author has some books in the library"));
      console.log('it has books')
    } else {
      next();
    }
  });
});

// export table
module.exports = mongoose.model("Author", authorSchema);
