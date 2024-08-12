const express = require('express')
const {connectToDb, getDb} = require('./db')

// init app & middleware
const app = express()

// db connection
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    })
    // khi connect được rồi thì gọi hàm getDb()
    // để lấy ra được database thôi
    db = getDb()
  }
});



// routes
app.get('/books', (req, res) => {
    let books = []

    // giống db.books(trong mongo shell)
    db.collection('books')
      .find() //cursor toArray forEach
      .sort({author: 1})
      .forEach(book => books.push(book))
      .then(() => {
        res.status(200).json(books)
      })
      .catch(() => {
        res.status(500).json({error: 'could not fetch the documents'})
      })
})
    

