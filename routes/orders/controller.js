// const conn = require("../../mariadb.js")
const { StatusCodes } = require("http-status-codes")
const mariadb = require("mysql2/promise")

const order = async (req, res) => {

    if (req.session.is_logined) {

        const conn = await mariadb.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'Bookstore',
            dateStrings: true,
        })

        const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;

        let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`
        let values = [delivery.address, delivery.receiver, delivery.contact];
        let results = await conn.execute(sql, values);
        let delivery_id = results[0].insertId;

        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?,?,?,?,?)`;
        values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id]

        results = await conn.execute(sql, values);

        let order_id = results[0].insertId;

        sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
        let [orderItems, fields] = await conn.query(sql, [items]);

        sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;

        values = [];
        orderItems.forEach((item) => {
            values.push([order_id, item.book_id, item.quantity])
        })

        results = await conn.query(sql, [values]);

        let result = await deleteCartItems(conn, items);

        return res.status(StatusCodes.OK).json(result);

    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "세션이 만료되었습니다. 계속하려면 로그인하십시오",
        });
    }
};

const deleteCartItems = async (conn, items) => {

    if (req.session.is_logined) {
        let sql = `DELETE FROM cartItems WHERE id IN (?)`;

        let result = await conn.query(sql, [items]);
        return result;
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "세션이 만료되었습니다. 계속하려면 로그인하십시오",
        });
    }
}

const getOrders = async (req, res) => {

    if (req.session.is_logined) {

        const conn = await mariadb.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'Bookstore',
            dateStrings: true,
        })

        sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price
           FROM orders LEFT JOIN delivery
           ON orders.delivery_id = delivery.id`;

        let [rows, fields] = await conn.query(sql);
        return res.status(StatusCodes.OK).json(rows);
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "세션이 만료되었습니다. 계속하려면 로그인하십시오",
        });
    }
}

const getOrderDetail = async (req, res) => {

    if (req.session.is_logined) {

        const { id } = req.params;

        const conn = await mariadb.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'Bookstore',
            dateStrings: true,
        })

        sql = `SELECT book_id, title, author, price, quantity
           FROM orderedBook LEFT JOIN books
           ON orderedBook.book_id = books.id
           WHERE order_id = ?`;

        let [rows, fields] = await conn.query(sql, [id]);
        return res.status(StatusCodes.OK).json(rows);
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "세션이 만료되었습니다. 계속하려면 로그인하십시오",
        });
    }
}

module.exports = {
    order,
    getOrders,
    getOrderDetail
}