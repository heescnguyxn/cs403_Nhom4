const API_URL = 'http://localhost:3000/api/products';
// Lấy container sản phẩm, sử dụng ID chung cho cả index và search
const container = document.getElementById('product-list-container'); 

// --- 1. UTILITY FUNCTIONS ---

// Hàm format tiền tệ (ví dụ: 33990000 -> 33.990.000 VNĐ)
function formatCurrency(number) {
    if (typeof number !== 'number') return '0 VNĐ';
    // Sử dụng 'vi-VN' để có dấu chấm phân cách
    return number.toLocaleString('vi-VN') + ' VNĐ'; 
}

// Hàm render một thẻ sản phẩm
function renderProductCard(product, isSearchPage = false) {
    const priceFormatted = formatCurrency(product.price);
    
    // Kiểm tra xem đây là trang tìm kiếm hay không để hiển thị nhãn
    const label = isSearchPage 
        ? `<span class="label-found">TÌM THẤY</span>` 
        : (product.isHot ? `<span class="label-hot">HOT</span>` : '');

    // Đổi nút Xem ngay thành Xem chi tiết nếu ở trang tìm kiếm
    const buttonText = isSearchPage ? 'Xem chi tiết' : 'Xem ngay';

    // Thẻ HTML sản phẩm
    return `
        <div class="product-card ${isSearchPage ? 'search-found' : ''}">
            ${label}
            <div class="product-img">
                <img src="${product.imageUrl}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                ${isSearchPage ? `<p class="product-sub-title">${product.category}</p>` : ''}
                <div class="price">${priceFormatted}</div>
                <a href="/detail/${product.id}" class="btn-buy">${buttonText}</a>
            </div>
        </div>
    `;
}

// --- 2. CORE FETCH LOGIC ---

/**
 * Hàm chính: Gọi API và hiển thị sản phẩm
 * @param {string} searchQuery - Từ khóa tìm kiếm (chỉ dùng cho trang search)
 */
async function fetchProducts(searchQuery = '') {
    if (!container) return; // Ngừng nếu không tìm thấy container (ví dụ: trên trang admin)

    // Xây dựng URL API: Thêm tham số 'q' nếu có từ khóa
    let finalApiUrl = API_URL;
    if (searchQuery) {
        // Giả định Node.js API của bạn lắng nghe tham số 'q' (query)
        finalApiUrl = `${API_URL}?q=${encodeURIComponent(searchQuery)}`;
    }

    container.innerHTML = '<p style="text-align: center; color: var(--text-gray);">Đang tải sản phẩm...</p>';
    
    // Kiểm tra xem có đang ở trang tìm kiếm (search.html) không
    const isSearchPage = window.location.pathname.includes('search.html'); 
    
    try {
        const response = await fetch(finalApiUrl);
        
        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        const products = await response.json(); 
        
        container.innerHTML = ''; // Xóa nội dung "Đang tải"

        // Nếu không có sản phẩm
        if (products.length === 0) {
            const message = searchQuery 
                ? `Không tìm thấy sản phẩm nào cho từ khóa "<strong>${searchQuery}</strong>".` 
                : 'Hiện tại chưa có sản phẩm nào.';
            
            container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-gray); padding: 30px;">${message}</p>`;
            return;
        }

        // Chèn từng sản phẩm vào container
        products.forEach(product => {
            container.innerHTML += renderProductCard(product, isSearchPage);
        });

    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red; padding: 30px;">❌ Lỗi kết nối đến Server Node.js (Kiểm tra xem Server đã chạy tại localhost:3000 chưa?).</p>';
    }
}

// --- 3. INIT LOGIC ---

function initApp() {
    // Kiểm tra nếu là trang tìm kiếm
    if (window.location.pathname.includes('search.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        
        const queryTextElement = document.querySelector('.search-query-text');
        
        if (query) {
            // Cập nhật tiêu đề kết quả tìm kiếm trên trang search.html
            queryTextElement.innerHTML = `Kết quả tìm kiếm cho: <strong>"${query}"</strong>`;
            
            // Tải sản phẩm với từ khóa tìm kiếm
            fetchProducts(query); 
        } else {
            // Nếu không có từ khóa tìm kiếm
            queryTextElement.innerHTML = 'Vui lòng nhập từ khóa tìm kiếm.';
            fetchProducts(); 
        }
    } else if (container) {
        // Nếu là trang chủ (index.html)
        fetchProducts();
    }
}

// Bắt đầu khởi tạo ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', initApp);