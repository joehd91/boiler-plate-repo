const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require ('jsonwebtoken');

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

userSchema.pre('save', function( next ){
    var user = this;

    if(user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 1234567    암호화된 비밀번호 $2b$10$eaMVXBMpGlMv1sII1yJhlu5r
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err),
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    // console.log('user_id', 'secretToken') 잠시 에러확인을 위해 사용했었음

    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb()
    })
}

// model. Schema을 상단에 만들어 주고 이를 감싸주는 역할
const User = mongoose.model('User', userSchema) // User는 이름. userSchema는 스키마

module.exports = {User} //User를 다른 곳에서도 사용할 수 있도록 export해준다