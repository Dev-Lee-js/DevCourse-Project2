const conn = require("../../mariadb.js")
const { StatusCodes } = require("http-status-codes")

const addToCart = (req,res)=>{
    
    const { book_id, quantity, user_id } = req.body;

    const sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);`;
    const values = [book_id, quantity, user_id];

    conn.query(sql, values,
        (err, results) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json(err);
            } else {
                res.status(StatusCodes.OK).json(results);
            }
        });
}

const getCartItems = (req,res)=>{
    
    const sql = `SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems LEFT JOIN books ON cartItems.book_id = books.id;`;

    conn.query(sql, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(err);
        } else {
            res.status(StatusCodes.OK).json(results);
        }
    });
}

const removeCartItem = (req,res)=>{
    res.json('장바구니 담기')
}


module.exports = {
    addToCart,
    getCartItems,
    removeCartItem
}