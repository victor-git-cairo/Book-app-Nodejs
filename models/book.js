
//https://medium.com/@dinyangetoh/how-to-build-simple-restful-api-with-nodejs-expressjs-and-mongodb-99348012925d
// Book table
const mongoose = require('mongoose')
const path = require('path')

// column definition
var bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  publishDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },

  createdAt: {
    type: String,
    required: true,
    default: Date.now
  },
  
  coverageImage: {
    type: String,
    required: true
  },
 
  // Reference field - read more about this documentation
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author' // matches the name used in the model Schema of the ref class
  }
})

// virual property on model Mongo table 
bookSchema.virtual('coverImagePath').get(function() {
  if (this.coverageImage != null) {
    const a = path.join('/', 'upload/bookCovers', this.coverageImage)
    console.log(a)
    return path.join('/', 'upload/bookCovers', this.coverageImage)
  }
})

// export table
module.exports = mongoose.model('Book', bookSchema)
