const express = require('express');
const cors = require('cors');
const path = require('path'); // Import module path để xử lý đường dẫn file
const app = express();
const port = 3000;

// Cho phép tất cả các nguồn gốc gọi API
app.use(cors()); 

// CẤU HÌNH EXPRESS PHỤC VỤ CÁC FILE TĨNH (HTML, CSS, JS)
// Express sẽ tìm kiếm file tĩnh trong thư mục chứa file server.js
app.use(express.static(__dirname)); 

// --- Dữ liệu MOCK (Giả lập Database) ---
const products = [
    { id: 1, name: "iPhone 15 Pro Max", price: 33990000, imageUrl: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-max-natural-titanium-select?wid=900&hei=1100&fmt=png-alpha", isHot: true, category: "apple", description: "iPhone 15 Pro Max với chip A17 Pro và khung Titan cao cấp. Màn hình 6.7 inch, camera 48MP." },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 28990000, imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-s928-sm-s928bztqxxv-539299440?$650_519_PNG$", isHot: true, category: "samsung", description: "Galaxy S24 Ultra tích hợp AI, bút S Pen, và camera 200MP. Màn hình Dynamic AMOLED 2X." },
    { id: 3, name: "Xiaomi 13T Pro", price: 13990000, imageUrl: "https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1695190988.66551699!400x400!85.png", isHot: true, category: "xiaomi", description: "Xiaomi 13T Pro sở hữu chip Dimensity 9200+ và sạc nhanh 120W. Thiết kế chống nước IP68." },
    { id: 4, name: "Oppo Find X7", price: 20500000, imageUrl: "https://www.oppo.com/content/dam/oppo/product-asset-library/find-x7-ultra/Find-X7-Ultra-pc.png", isHot: false, category: "oppo", description: "Oppo Find X7 với hệ thống camera Hasselblad tiên tiến và màn hình ProXDR." },
    { id: 5, name: "Asus ROG Phone 8", price: 25990000, imageUrl: "https://dlcdnwebimgs.asus.com/gain/3D70487B-E7FC-4F2A-9293-27B91979313D/w1000/h732", isHot: false, category: "asus", description: "Điện thoại chuyên game mạnh mẽ với Snapdragon 8 Gen 3 và hệ thống làm mát hiệu quả." },
    { id: 6, name: "Nokia G400 5G", price: 6500000, imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nokia-g400-5g.jpg", isHot: false, category: "nokia", description: "Sản phẩm tầm trung bền bỉ của Nokia, hỗ trợ 5G, pin trâu và màn hình 120Hz." },
    { id: 7, name: "OnePlus 12", price: 18000000, imageUrl: "https://oasis.opstatics.com/content/dam/oasis/page/product/oneplus-12/specs/flow/Flow-Green-480.png", isHot: false, category: "oneplus", description: "OnePlus 12 mang đến trải nghiệm nhanh chóng với sạc không dây 50W và chip Snapdragon mạnh mẽ." },
    { id: 8, name: "Realme GT 6", price: 12500000, imageUrl: "https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1695190988.66551699!400x400!85.png", isHot: false, category: "realme", description: "Realme GT 6 là chiếc flagship sát thủ với hiệu năng cao và thiết kế bóng bẩy." }
];

// --- 1. ROUTE CHUNG VÀ LỌC SẢN PHẨM (GET /api/products) ---
app.get('/api/products', (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : null;
    const category = req.query.category ? req.query.category.toLowerCase() : null;

    let filteredProducts = products;

    if (query) {
        // Lọc theo tên sản phẩm hoặc mô tả nếu có query
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
        );
    } else if (category) {
        // Lọc theo danh mục nếu có tham số category
        filteredProducts = filteredProducts.filter(p => 
            p.category === category
        );
    }
    
    setTimeout(() => {
        res.json(filteredProducts);
    }, 500);
});

// --- 2. ROUTE CHI TIẾT SẢN PHẨM (GET /api/products/:id) ---
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id); 

    const product = products.find(p => p.id === productId);

    if (product) {
        setTimeout(() => {
            res.json(product);
        }, 300);
    } else {
        res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
});

// --- 3. ROUTE GỐC (Tự động mở index.html) ---
app.get('/', (req, res) => {
    // Gửi file index.html về trình duyệt khi truy cập localhost:3000/
    res.sendFile(path.join(__dirname, 'index.html')); 
});

// --- KHỞI CHẠY SERVER ---
app.listen(port, () => {
    console.log(`Server Node.js đang chạy tại http://localhost:${port}`);
    console.log(`API Products: http://localhost:${port}/api/products`);
});