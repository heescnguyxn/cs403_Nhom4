const express = require('express');
const cors = require('cors'); // Dùng để kết nối Frontend
const app = express();
const port = 3000;

// Cho phép tất cả các nguồn gốc gọi API
app.use(cors()); 

// Dữ liệu sản phẩm MOCK (Sản phẩm cứng), sau này sẽ thay bằng Database
const products = [
    { id: 1, name: "iPhone 15 Pro Max", price: 33990000, imageUrl: "https://.../iphone.png", isHot: true },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 28990000, imageUrl: "https://.../samsung.png", isHot: true },
    { id: 3, name: "Xiaomi 13T Pro", price: 13990000, imageUrl: "https://.../xiaomi.png", isHot: true },
    // ... thêm các sản phẩm khác
];

// Định nghĩa Endpoint API
app.get('/api/products', (req, res) => {
    // Trả về danh sách sản phẩm dưới dạng JSON
    res.json(products);
});

// Khởi chạy server
app.listen(port, () => {
    console.log(`Server Node.js đang chạy tại http://localhost:${port}`);
});