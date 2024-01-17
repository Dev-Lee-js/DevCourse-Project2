const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const ctrl = require("./controller");

router.use(express.json());

const validate = (req, res, next) => {

    const err = validationResult(req);

    if (err.isEmpty()) {

        return next();

    } else {

        return res.status(StatusCodes.BAD_REQUEST).json(err.array());

    }
}

//회원가입
router.post(
    '/join',
    [
        body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
        body("password").notEmpty().isString().withMessage("비밀번호 확인 필요"),
        validate
    ],
    ctrl.join
);

//로그인
router.post(
    '/login',
    [
        body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
        body("password").notEmpty().isString().withMessage("비밀번호 확인 필요"),
        validate,
    ],
    ctrl.login
);

router.get('/logout', ctrl.logout);

router
    .route("/reset")
    .post(
        [
            body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
            validate
        ],
        ctrl.resetReq)
    .put(
        [
            body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
            body("password").notEmpty().isString().withMessage("비밀번호 확인 필요"),
            validate
        ],
        ctrl.reset);

module.exports = router;