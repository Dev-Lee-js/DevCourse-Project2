const { connection: conn } = require("../../mariadb.js");
const { StatusCodes } = require("http-status-codes")

const addToCart = (req, res) => {

    if (req.session.is_logined) {
        const { book_id, quantity, user_id } = req.body;

        const sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)`;
        const values = [book_id, quantity, user_id];

        conn.query(sql, values,
            (err, results) => {
                if (err) {
                    return res.status(StatusCodes.BAD_REQUEST).json(err);
                } else {
                    res.status(StatusCodes.OK).json(results);
                }
            });
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "세션이 만료되었습니다. 계속하려면 로그인하십시오",
        });
    }
}

const getCartItems = (req, res) => {

    if (req.session.is_logined) {

        const { user_id, selected } = req.body;

        const sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
                 FROM cartItems LEFT JOIN books 
                 ON cartItems.book_id = books.id
                 WHERE user_id = ? AND cartItems.id IN (?)`;
        let values = [user_id, selected]
        conn.query(sql, values, (err, results) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json(err);
            } else {
                res.status(StatusCodes.OK).json(results);
            }
        });
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "세션이 만료되었습니다. 계속하려면 로그인하십시오",
        });
    }
}

const removeCartItem = (req, res) => {

    if (req.session.is_logined) {

    const { id } = req.params;

    const sql = `DELETE FROM cartItems WHERE id = ?`;

    conn.query(sql, id,
        (err, results) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json(err);
            } else {
                res.status(StatusCodes.OK).json(results);
            }
        });
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "세션이 만료되었습니다. 계속하려면 로그인하십시오",
        });
    }
}


module.exports = {
    addToCart,
    getCartItems,
    removeCartItem
}