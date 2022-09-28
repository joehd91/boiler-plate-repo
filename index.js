const { application } = require('express')
const express = require('express')
const app = express()
const port = 5000

//mongodb 연결
const mongoose = require('mongoose')
// 특수문자 사용시 %+ASCII_code_of_the_character로 인코딩해야함. 따라서, !=%21, @=%40, #=%23으로 변경 함.
mongoose.connect('mongodb+srv://testuser:testuser123%21%40%23@boilerplate.ugmrmpi.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
    // seCreateIndex: true, 
    // useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

//웹 브라우저 상 출력 메시지
app.get('/', (req, res) => res.send('Hello World!'))

// npm run start 시 출력되는 메시지
app.listen(port, () => console.log(`Example app listening on port ${port}!`))