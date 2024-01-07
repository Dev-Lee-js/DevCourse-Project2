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

const bookDetail = (req, res) => {

    const { id } = req.params;

    const sql = `SELECT * FROM books LEFT JOIN category
                 ON books.category_id = category.id WHERE books.id = ?`;

    conn.query(sql, id, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (results.length) {
            return res.status(StatusCodes.OK).json(results)
        } else {
            return res.status(StatusCodes.NOT_FOUND).end()
        }
    });

};

const bookByCategory = (req, res) => {

    const { category_id, news, limit, currentPage } = req.query;

    const offset = limit * (currentPage-1);
    let sql = `SELECT * FROM books`;
    let values = [parseInt(limit), offset]
    if (category_id && news) {
        sql += ` WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
        values = values.push(category_id, news);
    } else if (category_id) {
        sql += ` WHERE category_id=?`;
        values = values.push(category_id);
    } else if (news) {
        sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
        values = values.push(news);
    }

    conn.query(sql, values, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (results.length) {
            return res.status(StatusCodes.OK).json(results)
        } else {
            return res.status(StatusCodes.NOT_FOUND).end()
        }
    });

};


module.exports = {
    allBooks,
    bookDetail,
    bookByCategory
}