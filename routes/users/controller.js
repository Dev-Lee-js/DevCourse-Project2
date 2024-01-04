const conn = require("../../mariadb.js")
const { StatusCodes } = require("http-status-codes")
const nodemailer = require('nodemailer'); 
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config();


const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000)
}

const sendMail = (userEmail) => {
    authNmbr = generateRandomCode(); 
    console.log(userEmail, authNmbr);


    let transporter = nodemailer.createTransport({
        service: 'Naver',   
        prot: 587,
        host: 'smtp.naver.com',
        auth: {
            user: process.env.NODEMAILER_USER,  
            pass: process.env.NODEMAILER_PASS  
        }
    });

    let mailOptions = {
        from: `"이종석" <${process.env.NODEMAILER_USER}>`,
        to: userEmail, 
        subject: "인증번호를 입력해주세요.", 
        html: `<h1>이메일 인증</h1>
            <div>
            인증번호 [${authNmbr}]를 인증 창에 입력하세요.    
            </div>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }

    })
}

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
                sendMail(email)
                res.status(StatusCodes.OK).json({
                    message: "이메일로 인증메일을 보내드렸습니다.",
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
                message: "비밀번호 변경 성공"
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