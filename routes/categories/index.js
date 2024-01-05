const express = require('express');
const router = express.Router();
const ctrl = require("./controller")

router.use(express.json());


//카테고리 전체 조회
router.get('/', ctrl.allCategory );

module.exports = router