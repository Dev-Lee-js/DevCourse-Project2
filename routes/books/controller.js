const conn = require("../../mariadb.js")
const { StatusCodes } = require("http-status-codes")
const dotenv = require('dotenv');
dotenv.config();


const allBooks = (req, res) => {   

    const sql = `SELECT * FROM books`;    

    conn.query(sql, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(err);
        } else {
            res.status(StatusCodes.OK).json(results);
        }
    });

};


module.exports = {
    allBooks
}