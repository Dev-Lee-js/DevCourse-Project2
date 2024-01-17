const { connection: conn } = require("../../mariadb.js");
const { StatusCodes } = require("http-status-codes")

const addToCart = (req, res) => {

    if (req.session.isLogin) {

        const { book_id, quantity } = req.body;
        const { user_id } = req.session;

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

    if (req.session.isLogin) {

        const { selected } = req.body;
        const { user_id } = req.session;

        const sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
                     FROM cartItems LEFT JOIN books 
                     ON cartItems.book_id = books.id
                     WHERE user_id = ?`;
        let values = [user_id]

        if (selected) {
            sql += ` AND cartItems.id IN (?)`;
            values.push(selected)
        }

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

    if (req.session.isLogin) {

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