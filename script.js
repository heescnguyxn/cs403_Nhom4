const API_URL = 'http://localhost:3000/api/products';
const DETAIL_API_URL = 'http://localhost:3000/api/products/'; 
const container = document.getElementById('product-list-container'); 

// --- UTILITY FUNCTIONS ---
function formatCurrency(number) {
    if (typeof number !== 'number') return '0 VNĐ';
    return number.toLocaleString('vi-VN') + ' VNĐ'; 
}

// Hàm render thẻ sản phẩm (dùng cho danh sách)
function renderProductCard(product, isSearchPage = false) {
    const priceFormatted = formatCurrency(product.price);
    if (!product.id) return ''; 

    const label = isSearchPage 
        ? `<span class="label-found">TÌM THẤY</span>` 
        : (product.isHot ? `<span class="label-hot">HOT</span>` : '');

    const buttonText = isSearchPage ? 'Xem chi tiết' : 'Xem ngay';
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

// Hàm render nội dung trang chi tiết sản phẩm
function renderProductDetailHTML(product) {
    const formattedPrice = formatCurrency(product.price);
    
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

// --- CORE FETCH LOGIC ---
let currentCategory = null;

async function fetchProducts(filterValue = '', filterType = 'query') {
    if (!container) return;

    let finalApiUrl = API_URL;
    
    if (filterValue) {
        if (filterType === 'query') { 
            finalApiUrl = `${API_URL}?q=${encodeURIComponent(filterValue)}`;
        } else if (filterType === 'category') { 
            finalApiUrl = `${API_URL}?category=${encodeURIComponent(filterValue)}`;
        }
    }

    container.innerHTML = '<p style="text-align: center; color: var(--text-gray);">Đang tải sản phẩm...</p>';
    const isSearchPage = window.location.pathname.includes('search.html'); 
    
    try {
        const response = await fetch(finalApiUrl);
        if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
        const products = await response.json(); 
        container.innerHTML = ''; 

        if (products.length === 0) {
            const message = filterValue 
                ? `Không tìm thấy sản phẩm nào cho từ khóa/danh mục "<strong>${filterValue}</strong>".` 
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

async function fetchProductDetail(productId) {
    const detailContainer = document.querySelector('.product-detail-card');
    if (!detailContainer) return;

    detailContainer.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 50px;">Đang tải chi tiết sản phẩm...</p>';

    try {
        const response = await fetch(DETAIL_API_URL + productId);
        
        if (response.status === 404) throw new Error("Sản phẩm không tồn tại.");
        if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
        
        const product = await response.json(); 
        detailContainer.innerHTML = renderProductDetailHTML(product);

    } catch (error) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', error);
        const errorMessage = error.message.includes('không tồn tại') ? error.message : '❌ Lỗi kết nối hoặc API không phản hồi đúng.';
        detailContainer.innerHTML = `<p style="text-align: center; color: red; padding: 50px;">${errorMessage}</p>`;
    }
}


// --- INIT LOGIC ---

function handleCategoryFilter(event) {
    event.preventDefault(); 
    const link = event.target.closest('.category-link');
    if (!link) return;

    const categoryId = link.getAttribute('data-category-id');

    // Cập nhật trạng thái active (CSS)
    document.querySelectorAll('.category-link').forEach(item => {
        item.classList.remove('active');
    });
    link.classList.add('active');
    
    // Gọi API để lọc sản phẩm
    currentCategory = categoryId;
    fetchProducts(categoryId, 'category'); 
}

function initCategoryFilter() {
    const categoryList = document.getElementById('category-list');
    if (categoryList) {
        categoryList.addEventListener('click', handleCategoryFilter);
    }
}

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
        initCategoryFilter();
    }
}

document.addEventListener('DOMContentLoaded', initApp);