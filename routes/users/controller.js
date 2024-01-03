const conn = require("../../mariadb.js")
const { StatusCodes } = require("http-status-codes")
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config();

const join = (req, res) => {

    const { email, password } = req.body

    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`
    const values = [email, password]

    conn.query(sql, values, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(err)
        } else {

            res.status(StatusCodes.CREATED).json(results)
        }
    })
}

const login = (req, res) => {
    const { email, password } = req.body

    const sql = `SELECT * FROM users WHERE email = ?`
    conn.query(sql, email,
        (err, results) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).end()
            }
            const loginUser = results[0]
            if (loginUser && loginUser.password == password) {
                const token = jwt.sign({
                    email: loginUser.email,
                }, process.env.PRIVATE_KEY, {
                    expiresIn: "5m",
                    issuer: "jongseok"
                })

                res.cookie("token", token, {
                    httpOnly: true
                })

                res.status(StatusCodes.OK).json({
                    token: token
                })
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: `이메일 또는 비빌번호가 틀렸습니다.`
                })
            }
        }
    )
}

const resetReq = (req, res) => {
    const { email } = req.body
    let sql = `SELECT * FROM users WHERE email = ?`
    conn.query(sql, email,
        (err, results) => {
            if (results.length) {
                res.status(StatusCodes.OK).json({
                    message: "인증 성공"
                })
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: `이메일이 틀렸습니다.`
                })
            }
        }
    )
}

const reset = (req, res) => {
    const { email, password } = req.body

    const sql = `UPDATE users SET password = ? WhERE email = ?`
    const values = [password, email]

    conn.query(sql, values, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end()
        }
        if (results.affectedRows == 0) {
            return res.status(StatusCodes.BAD_REQUEST).end()
        } else {
            res.status(200).json({
                message : "비밀번호 변경 성공"
            })
        }
    })
}

module.exports = {
    join,
    login,
    resetReq,
    reset
}