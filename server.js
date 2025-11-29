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

    try {
        const response = await fetch(finalApiUrl);
        if (!response.ok) throw new Error('Lỗi khi gọi API');
        fetchProducts(query || '');
    } catch (error) {
        console.error('Lỗi khi lấy tham số tìm kiếm:', error);
    }
// Khởi chạy server
app.listen(port, () => {
    console.log(`Server Node.js đang chạy tại http://localhost:${port}`);
});
// Ví dụ về cấu trúc dữ liệu sản phẩm trong server.js:

// 2. ROUTE CHI TIẾT SẢN PHẨM (MỚI)
// Dùng route parameter ':id' để bắt ID từ URL
app.get('/api/products/:id', (req, res) => {
    // Lấy ID từ URL (đây sẽ là chuỗi)
    const productId = parseInt(req.params.id); 

    // Tìm sản phẩm tương ứng trong danh sách (giả lập database)
    const product = products.find(p => p.id === productId);

    if (product) {
        // Trả về dữ liệu của sản phẩm đó
        res.json(product);
    } else {
        // Trả về lỗi 404 nếu không tìm thấy
        res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
});

// ... (app.listen)
app.get('/api/products', (req, res) => {
    const query = req.query.q; // Lấy tham số tìm kiếm
    if (query) {
        // ... Logic lọc sản phẩm theo query ...
    }
    res.json(products);});