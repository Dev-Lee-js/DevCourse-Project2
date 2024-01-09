INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date) VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다..", "김어림", 100, "목차입니다.", 20000, "2019-01-01");
INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date) VALUES ("신데렐라들", "종이책", 1, "유리구두..", "투명한 유리구두..", "김구두", 100, "목차입니다.", 20000, "2023-12-01");
INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date) VALUES ("백설공주들", "종이책", 2, "사과..", "빨간 사과..", "김사과", 100, "목차입니다.", 20000, "2023-11-01");
INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date) VALUES ("흥부와 놀부들", "종이책", 3, "제비..", "까만 제비..", "김제비", 100, "목차입니다.", 20000, "2023-12-08");

SELECT * FROM books LEFT
JOIN category ON books.category_id = category.id;

SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id=1;

// 좋아요 추가
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 2);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 3);
INSERT INTO likes (user_id, liked_book_id) VALUES (3, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (4, 4);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 2);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 3);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 5); 


// 좋아요 삭제
DELETE FROM likes WHERE user_id = 1 AND liked_book_id = 3;

// 장바구니 담기
INSERT INTO cartItems (book_id, quantity, user_id) VALUES (3, 2, 1);


// 장바구니 조회
SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems LEFT JOIN books ON cartItems.book_id = books.id;
