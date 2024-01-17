const { connection: conn } = require("../../mariadb.js");
const { StatusCodes } = require("http-status-codes")

const allCategory  = (req, res) => {

    const sql = `SELECT * FROM category`;

    conn.query(sql, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(err);
        } else {
            res.status(StatusCodes.OK).json(results);
        }
    });

};


module.exports = {
    allCategory
}