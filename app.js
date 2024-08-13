const express = require('express')
const {ObjectId} = require('mongodb')
const {connectToDb, getDb} = require('./db')

// init app & middleware
const app = express()
app.use(express.json())

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
// pagination
app.get("/books", (req, res) => {
  // req.query: Đây là một đối tượng chứa các tham số 
  // truy vấn trong URL của yêu cầu HTTP. Ví dụ, nếu URL là 
  // http://example.com?page=2, thì req.query 
  // sẽ là một đối tượng như { page: "2" }
  const page = req.query.page || 0
  const booksPerPage = 3
  let books = [];

  // giống db.books(trong mongo shell)
  // Nó trả về một con trỏ (cursor) trỏ tới
  // tất cả các tài liệu khớp với điều kiện tìm kiếm.
  db.collection("books")
    .find()
    .sort({ author: 1 })
    // số object được bỏ qua
    .skip(page * booksPerPage)
    // giới hạn số object hiển thị
    .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "could not fetch the documents" });
    });
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not fetch the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
});

app.post('/books', (req, res) => {
  const book = req.body

  db.collection('books')
    .insertOne(book)
    .then(result => {
      res.status(201).json(result)
    })
    .catch(() => {
      res.status(500).json({error: "Could not create a new document"})
    })
})

app.delete('/books/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not delete the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
})


// ở đây update nhưng ta lại truyền id qua params 
// còn chỉnh sửa thì lại nhận data chỉnh sửa qua body
app.patch('/books/:id', (req, res) => {
  const updates = req.body

  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id)}, {$set: updates})
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not update the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
})