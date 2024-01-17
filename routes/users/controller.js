const { StatusCodes } = require("http-status-codes");
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const { connection: conn } = require("../../mariadb.js");

const encrypt = (userPassword) => {

    const saltRounds = 10;

    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                reject(err);
            } else {
                bcrypt.hash(userPassword, salt, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            }
        });
    });
};

const decrypt = (userPassword, hash) => {

    return new Promise((resolve, reject) => {
        bcrypt.compare(userPassword, hash, (err, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(new Error('Password not found'));
            }
        });
    });
};

const generateRandomCode = () => {

    return Math.floor(100000 + Math.random() * 900000);

}

const sendMail = (userEmail) => {

    authNmbr = generateRandomCode();

    const transporter = nodemailer.createTransport({

        service: 'Naver',
        prot: 587,
        host: 'smtp.naver.com',
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }

    });

    const mailOptions = {

        from: `"이종석" <${process.env.NODEMAILER_USER}>`,
        to: userEmail,
        subject: "인증번호를 입력해주세요.",
        html: `<h1>이메일 인증</h1>
            <div>
            인증번호 [${authNmbr}]를 인증 창에 입력하세요.    
            </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {

        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }

    })
}

const join = async (req, res) => {

    const { email, password } = req.body;

    try {

        const hashedPassword = await encrypt(password);
        const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
        const values = [email, hashedPassword];

        conn.query(sql, values, (err, results) => {
            if (results) {
                res.status(StatusCodes.CREATED).json({
                    message: "회원가입이 완료되었습니다."
                });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "회원가입 실패"
                });
            }
        });

    } catch (error) {

        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '예기치 않은 오류가 발생했습니다.'
        });

    }

};

const login = (req, res) => {

    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;

    conn.query(sql, email, async (err, results) => {

        try {

            const loginUser = results[0];

            if (!loginUser) {
                throw new Error('Email not found');
            }

            const hashedPassword = loginUser.password;
            const passwordMatch = await decrypt(password, hashedPassword);       
            
            if (passwordMatch) {

                req.session.user_id = loginUser.id;
                req.session.isLogin = true;

                res.status(StatusCodes.OK).json({
                    message: "로그인 완료"
                });
            }
        }
        catch (error) {
            if(error.message == 'Email not found' || "Password not found"){
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: `이메일 또는 비밀번호가 틀렸습니다.`
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: '예기치 않은 오류가 발생했습니다.'
                });               
            }
        }
    })
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        res.status(StatusCodes.OK).json({
            message: "로그아웃 완료"
        })
    });
};

const resetReq = (req, res) => {

    const { email } = req.body;

    try {

        let sql = `SELECT * FROM users WHERE email = ?`

        conn.query(sql, email,
            (err, results) => {

                if (results.length) {

                    sendMail(email);
                    res.status(StatusCodes.OK).json({
                        message: "이메일로 인증메일을 보내드렸습니다."
                    })

                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({
                        message: `이메일이 틀렸습니다.`
                    })
                }
            }
        );

    } catch (error) {

        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '예기치 않은 오류가 발생했습니다.'
        });

    }

}

const reset = async (req, res) => {

    const { email, password } = req.body;

    try {

        const hashedPassword = await encrypt(password);

        const sql = `UPDATE users SET password = ? WhERE email = ?`
        const values = [hashedPassword, email]

        conn.query(sql, values, (err, results) => {

            if (results.affectedRows > 0) {

                res.status(200).json({
                    message: "비밀번호 초기화 성공"
                });

            } else {

                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: '비밀번호 초기화 실패'
                });

            }
        });

    } catch (error) {

        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '예기치 않은 오류가 발생했습니다.'
        });

    }


}

module.exports = {
    join,
    login,
    resetReq,
    reset,
    logout
}