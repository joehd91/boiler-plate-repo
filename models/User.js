const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 공백이 있을 시, 이를 무시하고 적용
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        // 관리자나 사용자를 위해 role을 지정해서 사용
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// model. Schema을 상단에 만들어 주고 이를 감싸주는 역할
const User = mongoose.model('User', userSchema) // User는 이름. userSchema는 스키마

module.exports = {} //User를 다른 곳에서도 사용할 수 있도록 export해준다