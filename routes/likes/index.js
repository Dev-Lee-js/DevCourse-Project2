const express = require('express');
const router = express.Router();
const ctrl = require("./controller")

router.use(express.json());

//좋아요추가
router.post('/:id', ctrl.addLike);

//좋아요취소
router.delete('/:id', ctrl.removeLike);

module.exports=router;