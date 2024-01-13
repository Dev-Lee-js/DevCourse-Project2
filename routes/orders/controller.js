// const conn = require("../../mariadb.js")
const { StatusCodes } = require("http-status-codes")
const mariadb = require("mysql2/promise")

const order = async (req, res) => {

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

};

const deleteCartItems = async (conn, items) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?)`;
    let values = [1,2,3];

    let result = await conn.query(sql, [items]);
    return result;

}

const getOrders = (req, res) => {
    res.json('결제하기');
}

const getOrderDetail = (req, res) => {
    res.json('결제하기');
}

module.exports = {
    order,
    getOrders,
    getOrderDetail
}