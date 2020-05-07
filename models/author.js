
//https://medium.com/@dinyangetoh/how-to-build-simple-restful-api-with-nodejs-expressjs-and-mongodb-99348012925d
// Author table
const mongoose = require('mongoose')

// column definition
var authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

// export table
module.exports = mongoose.model('Author', authorSchema)
