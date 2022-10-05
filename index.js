const { application } = require('express')
const express = require('express')
const app = express()
const port = 5000
// body-parser 가져오기
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
// User 모델을 가져오기 위해서 기입
const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

//mongodb 연결
const mongoose = require('mongoose')
// 특수문자 사용시 %+ASCII_code_of_the_character로 인코딩해야함. 따라서, !=%21, @=%40, #=%23으로 변경 함.
mongoose.connect(config.mongoURI, 'mongodb+srv://testuser:testuser123%21%40%23@boilerplate.ugmrmpi.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
    // seCreateIndex: true, 
    // useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// 웹 브라우저 상 출력 메시지
app.get('/', (req, res) => res.send('Hello World! hyundeok!!'))

// 인증 구현
app.post('/register', (req, res) => {

    // 회원가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body)

    // save 전에 암호화해야하기 때문에 User.js 업데이트
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/login', (req, res) => {
    // 요청한 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false, 
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
        user.comparePassword(req.body.password , (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess: false, massage: "비밀번호가 틀렸습니다."})
            
            // 비밀번호까지 맞다면 토큰을 생성하기.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // 토큰을 어디에 저장? 쿠키, 로컬스토리지 등에 저장 가능
                // 여기에서는 쿠키로 진행
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})


// npm run start 시 출력되는 메시지
app.listen(port, () => console.log(`Example app listening on port ${port}!`))