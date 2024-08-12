const {MongoClient} = require('mongodb')

let dbConnection

module.exports = {
    // connectToDb đây là 1 hàm nhận 1 callback function
    // làm params thôi, nếu nó kết nối được thì nó trả về (gọi)
    // callback rỗng, còn nếu nó ko kết nối được thì nó trả
    // về (gọi) 1 callback có parmas là error, sau đó qua bên app
    // thì nếu nó không có err nào thì nó là undefined + ! nữa 
    // thì nó sẽ là true và kết nối được, còn nếu có lỗi khác undefined + !
    // thì nó sẽ là false và không kết nối được thôi
  connectToDb: (callback) => {
    MongoClient.connect(
      "mongodb+srv://thebao123:123456zZ@cluster0.qhdom.mongodb.net/bookstore?retryWrites=true&w=majority&appName=Cluster0"
    )
        // client.db() để tương tác với database ta đã connect
        .then((client) => {
            dbConnection = client.db()
            return callback()
        })
        .catch(err => {
            console.error(err)
            return callback(err)
        })
  },
  getDb: () => dbConnection
};