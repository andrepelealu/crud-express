require('dotenv').config()
const  express = require('express')
const app = express()
const mongoose = require('mongoose')
var bodyParser = require('body-parser');
//menggunakan library pada express
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//memanggil library

//db connection
mongoose.connect(process.env.DATABASE_URL,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', ()=> console.log('connected'))

app.use(express.json())
const usersRouter = require('./routes/users')

app.use('/users', usersRouter)
app.listen(3000,() => console.log('server started'))
