const { connection: conn } = require("../../mariadb.js");
const { StatusCodes } = require("http-status-codes")

const addLike = (req, res) => {

    if (req.session.isLogin) {

        const { id } = req.params;
        const { user_id } = req.session;
        
        const sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
        const values = [user_id, id];

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


};

const removeLike = (req, res) => {

    if (req.session.isLogin) {
        
        const { id } = req.params;
        const { user_id } = req.session;

        const sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`;
        const values = [user_id, id];

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
};

module.exports = {
    addLike,
    removeLike
}