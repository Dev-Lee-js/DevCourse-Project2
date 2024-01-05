const express = require('express');
const router = express.Router();
const ctrl = require("./controller")

router.use(express.json());

//전체 도서 조회
router.get('/', ctrl.allBooks );


//개별 도서 조회
router.get('/:id',ctrl.bookDetail );

// //카테고리별 도서 목록 조회
router.get('/', ctrl.bookByCategory)


module.exports = router