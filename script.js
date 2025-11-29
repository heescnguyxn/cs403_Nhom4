const API_URL = 'http://localhost:3000/api/products';
const DETAIL_API_URL = 'http://localhost:3000/api/products/'; // Dùng cho trang chi tiết sản phẩm
const container = document.getElementById('product-list-container'); 

// --- 1. UTILITY FUNCTIONS ---

// Hàm format tiền tệ (ví dụ: 33990000 -> 33.990.000 VNĐ)
function formatCurrency(number) {
    if (typeof number !== 'number') return '0 VNĐ';
    return number.toLocaleString('vi-VN') + ' VNĐ'; 
}

// Hàm render một thẻ sản phẩm (dùng cho index.html và search.html)
function renderProductCard(product, isSearchPage = false) {
    const priceFormatted = formatCurrency(product.price);
    
    // Đảm bảo API trả về ID để tạo liên kết động
    if (!product.id) return ''; 

    // Kiểm tra xem đây là trang tìm kiếm hay không để hiển thị nhãn
    const label = isSearchPage 
        ? `<span class="label-found">TÌM THẤY</span>` 
        : (product.isHot ? `<span class="label-hot">HOT</span>` : '');

    const buttonText = isSearchPage ? 'Xem chi tiết' : 'Xem ngay';
    // Liên kết động tới trang chi tiết với ID
    const detailUrl = `product-detail.html?id=${product.id}`;

    return `
        <div class="product-card ${isSearchPage ? 'search-found' : ''}">
            ${label}
            <div class="product-img">
                <img src="${product.imageUrl || 'placeholder.png'}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                ${isSearchPage ? `<p class="product-sub-title">${product.category || ''}</p>` : ''}
                <div class="price">${priceFormatted}</div>
                <a href="${detailUrl}" class="btn-buy">${buttonText}</a>
            </div>
        </div>
    `;
}

/**
 * Hàm tạo HTML cho giao diện chi tiết sản phẩm (Cần khớp với product-detail.html)
 */
function renderProductDetailHTML(product) {
    const formattedPrice = formatCurrency(product.price);
    
    // Sử dụng cấu trúc HTML từ file product-detail.html của bạn
    return `
        <div class="product-detail-grid">
            
            <div class="product-image-display">
                <img src="${product.imageUrl || 'placeholder.png'}" alt="${product.name}">
            </div>

            <div class="product-info-area">
                
                <h1 class="product-name-title">${product.name}</h1>
                
                <div class="product-meta">
                    <p class="meta-label">Đơn vị tính:</p>
                    <p class="meta-value">Cái</p>
                </div>
                
                <div class="product-meta product-description-box">
                    <p class="meta-label">Mô tả:</p>
                    <p class="meta-value">${product.description || 'Sản phẩm này hiện chưa có mô tả chi tiết.'}</p>
                </div>
                
                <div class="product-price-display">
                    <p class="price-label">Giá bán:</p>
                    <p class="price-value">${formattedPrice}</p>
                </div>

                <div class="quantity-selection-group">
                    <p class="quantity-label">Số lượng:</p>
                    <div class="quantity-control-detail">
                        <button class="qty-btn minus-detail">-</button>
                        <input type="text" value="1" class="qty-input-detail">
                        <button class="qty-btn plus-detail">+</button>
                    </div>
                </div>

                <div class="action-buttons-group d-flex">
                    <button class="btn btn-add-to-cart" data-product-id="${product.id}"><i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ hàng</button>
                    <button class="btn btn-buy-now">Mua ngay</button>
                </div>
            </div>
        </div>
    `;
}

// --- 2. CORE FETCH LOGIC ---

/**
 * Hàm chính: Gọi API và hiển thị danh sách sản phẩm
 * @param {string} searchQuery - Từ khóa tìm kiếm (chỉ dùng cho trang search)
 */
async function fetchProducts(searchQuery = '') {
    if (!container) return;

    let finalApiUrl = API_URL;
    if (searchQuery) {
        finalApiUrl = `${API_URL}?q=${encodeURIComponent(searchQuery)}`;
    }

    container.innerHTML = '<p style="text-align: center; color: var(--text-gray);">Đang tải sản phẩm...</p>';
    
    const isSearchPage = window.location.pathname.includes('search.html'); 
    
    try {
        const response = await fetch(finalApiUrl);
        
        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        const products = await response.json(); 
        
        container.innerHTML = ''; 

        if (products.length === 0) {
            const message = searchQuery 
                ? `Không tìm thấy sản phẩm nào cho từ khóa "<strong>${searchQuery}</strong>".` 
                : 'Hiện tại chưa có sản phẩm nào.';
            
            container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-gray); padding: 30px;">${message}</p>`;
            return;
        }

        products.forEach(product => {
            container.innerHTML += renderProductCard(product, isSearchPage);
        });

    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red; padding: 30px;">❌ Lỗi kết nối đến Server Node.js (Kiểm tra xem Server đã chạy tại localhost:3000 chưa?).</p>';
    }
}

/**
 * Hàm tải chi tiết sản phẩm dựa trên ID (Dùng cho product-detail.html)
 * @param {string} productId - ID của sản phẩm cần tìm
 */
async function fetchProductDetail(productId) {
    // Container cho trang chi tiết sản phẩm
    const detailContainer = document.querySelector('.product-detail-card');
    if (!detailContainer) return;

    detailContainer.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 50px;">Đang tải chi tiết sản phẩm...</p>';

    try {
        const response = await fetch(DETAIL_API_URL + productId);
        
        if (response.status === 404) {
             throw new Error("Sản phẩm không tồn tại.");
        }
        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        
        const product = await response.json(); 
        
        // Cập nhật HTML động cho trang chi tiết
        detailContainer.innerHTML = renderProductDetailHTML(product);

    } catch (error) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', error);
        const errorMessage = error.message.includes('không tồn tại') 
            ? error.message 
            : '❌ Lỗi kết nối hoặc API không phản hồi đúng.';
        
        detailContainer.innerHTML = `<p style="text-align: center; color: red; padding: 50px;">${errorMessage}</p>`;
    }
}


// --- 3. INIT LOGIC ---

function initDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        fetchProductDetail(productId);
    } else {
        const detailContainer = document.querySelector('.product-detail-card');
        if (detailContainer) {
            detailContainer.innerHTML = '<p style="text-align: center; padding: 50px;">Không tìm thấy ID sản phẩm để hiển thị chi tiết.</p>';
        }
    }
}


function initApp() {
    // 1. Logic cho Trang Chi Tiết
    if (window.location.pathname.includes('product-detail.html')) {
        initDetailPage(); 
        return;
    } 
    
    // 2. Logic cho Trang Tìm Kiếm và Trang Chủ
    else if (window.location.pathname.includes('search.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const queryTextElement = document.querySelector('.search-query-text');
        
        if (query) {
            queryTextElement.innerHTML = `Kết quả tìm kiếm cho: <strong>"${query}"</strong>`;
            fetchProducts(query); 
        } else {
            queryTextElement.innerHTML = 'Vui lòng nhập từ khóa tìm kiếm.';
            fetchProducts(); 
        }
    } else if (container) {
        // Trang Chủ (index.html)
        fetchProducts();
    }
}

// Bắt đầu khởi tạo ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', initApp);