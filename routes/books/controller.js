const { connection: conn } = require("../../mariadb.js");
const { StatusCodes } = require("http-status-codes");


const allBooks = (req, res) => {

    let allBooksRes = {};
    const { category_id, news, limit, currentPage } = req.query;

    const offset = limit * (currentPage - 1);
    let sql = `SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books`;
    let values = []
    if (category_id && news) {
        sql += ` WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
        values = [category_id];
    } else if (category_id) {
        sql += ` WHERE category_id=?`;
        values = [category_id];
    } else if (news) {
        sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }

    sql += ` LIMIT ? OFFSET ?`;
    values.push(parseInt(limit), offset);

    conn.query(sql, values, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (results.length) {
            results.map((result)=>{
                result.pubDate = result.pub_date;
                delete result.pub_date;
            })
            allBooksRes.books = results;
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    });

    sql = `SELECT found_rows()`;

    conn.query(sql, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        
        const pagination = {};
        pagination.currentPage = parseInt(currentPage);
        pagination.totalCount = results[0]["found_rows()"];

        allBooksRes.pagination = pagination;

        return res.status(StatusCodes.OK).json(allBooksRes);

    });
};

const bookDetail = (req, res) => {

    const { user_id } = req.session;
    const book_id = req.params.id;

    let sql = ``;
    let values = [];

    if (user_id) {

        sql = `SELECT *,
        (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes,
        (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked`;

        values = [user_id, book_id, book_id];

    } else {

        sql = `SELECT *,
        (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes`;

        values = [book_id];
    }

    sql += ` FROM books
             LEFT JOIN category
             ON books.category_id = category.category_id
             WHERE books.id = ?`;

    conn.query(sql, values, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (results.length) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    });

};

module.exports = {
    allBooks,
    bookDetail
}