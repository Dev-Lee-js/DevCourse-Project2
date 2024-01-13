const express = require('express');
const router = express.Router();
const ctrl = require("./controller");

router.use(express.json());

//결제하기 = 주문하기
router.post('/', ctrl.order);

//주문 목록 조회
router.get('/', ctrl.getOrders);

//주문 상세 상품 조회
router.get('/:id', ctrl.getOrderDetail);



module.exports=router;