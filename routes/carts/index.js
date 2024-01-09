const express = require('express');
const router = express.Router();
const ctrl = require("./controller")
router.use(express.json());

//장바구니 담기
router.post('/', ctrl.addToCart)

//장바구니 아이템 목록 조회
router.get('/', ctrl.getCartItems)

//장바구니 삭제
router.delete('/:id', ctrl.removeCartItem)


//장바구니에서 선택한 주문 "예상" 상품 목록 조회
// router.get('/cart',(req,res)=>{
//     res.json('장바구니 예상 목록 조회')
// })

module.exports=router;