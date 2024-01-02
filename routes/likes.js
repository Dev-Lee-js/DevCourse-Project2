const express = require('express');
const router = express.Router();

router.use(express.json());
//좋아요추가
router.post('/:id',(req,res)=>{
    res.json('좋아요 추가');
});

//좋아요취소
router.delete('/:id',(req,res)=>{
    res.json('좋아요 삭제');
})
module.exports=router;