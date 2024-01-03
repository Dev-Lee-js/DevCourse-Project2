const conn = require("../../mariadb.js")
const {StatusCodes} = require("http-status-codes")

const join = (req, res) => {

    let { email, password } = req.body

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
    res.json("로그인")
}

const resetReq = (req, res) => {
    res.json("비밀번호 초기화 요청")
}

const reset = (req, res) => {
    res.json("비밀번호 초기화")
}

module.exports = {
    join,
    login,
    resetReq,
    reset
}