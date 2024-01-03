const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require("express-validator")
const bcrypt = require('bcrypt');
const ctrl = require("./users.ctrl")

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req)

    if (err.isEmpty()) {

        return next()
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json(err.array())
    }
}

const encrypt = (req, res, next) => {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            return next(err)
        } else {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) {
                    return next(err)
                } else {
                    req.body.password = hash
                    next()
                }
            });
        }
    });
}

//회원가입
router.post(
    '/join',
    [
        body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
        body("password").notEmpty().isString().withMessage("비밀번호 확인 필요"),
        validate,
        encrypt
    ],
    ctrl.join
)

//로그인
router.post('/login', ctrl.login);

router
    .route("/reset")
    .post(ctrl.reset) // 비밀번호 초기화 요청
    .put((req, res) => {
        res.json("비밀번호 초기화")
    });

module.exports = router