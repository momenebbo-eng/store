document.addEventListener('DOMContentLoaded', () => {
    // قاعدة بيانات المنتجات (تجريبية)
    const allProducts = [
        { id: 1, name: 'ساعة ذكية رياضية', price: 150, category: 'إلكترونيات', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80' },
        { id: 2, name: 'سماعات بلوتوث لاسلكية', price: 80, category: 'إلكترونيات', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' },
        { id: 3, name: 'نظارة شمسية كلاسيك', price: 45, category: 'إكسسوارات', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80' },
        { id: 4, name: 'حقيبة ظهر للسفر', price: 120, category: 'حقائب', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80' },
        { id: 5, name: 'حذاء رياضي مريح', price: 90, category: 'أحذية', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' },
        { id: 6, name: 'تيشيرت قطني صيفي', price: 25, category: 'ملابس', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80' }
    ];

    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const noResultsMsg = document.getElementById('noResults');

    // 1. تعبئة قائمة الفئات (Categories) تلقائياً
    const categories = [...new Set(allProducts.map(p => p.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // 2. دالة عرض المنتجات
    function renderProducts(productsToRender) {
        productsGrid.innerHTML = ''; // مسح المحتوى القديم
        
        if (productsToRender.length === 0) {
            noResultsMsg.classList.remove('d-none');
        } else {
            noResultsMsg.classList.add('d-none');
            productsToRender.forEach(product => {
                const productHTML = `
                    <div class="col-sm-6 col-md-4 col-lg-3">
                        <div class="card h-100 product-card shadow-sm border-0">
                            <span class="badge bg-secondary position-absolute top-0 start-0 m-2">${product.category}</span>
                            <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                            <div class="card-body d-flex flex-column text-center">
                                <h5 class="card-title fw-bold fs-6">${product.name}</h5>
                                <p class="card-text text-primary fw-bold fs-5 mt-auto">${product.price} دولار</p>
                                <button class="btn btn-outline-primary w-100 mt-2" onclick="addToCart(${product.id})">
                                    <i class="bi bi-cart-plus"></i> أضف للسلة
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                productsGrid.innerHTML += productHTML;
            });
        }
    }

    // 3. دالة تطبيق الفلاتر
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedPrice = priceFilter.value;

        const filteredProducts = allProducts.filter(product => {
            // فلتر البحث
            const matchSearch = product.name.toLowerCase().includes(searchTerm);
            
            // فلتر الفئة
            const matchCategory = selectedCategory === '' || product.category === selectedCategory;
            
            // فلتر السعر
            let matchPrice = true;
            if (selectedPrice !== '') {
                const [min, max] = selectedPrice.split('-').map(Number);
                matchPrice = product.price >= min && product.price <= max;
            }

            return matchSearch && matchCategory && matchPrice;
        });

        renderProducts(filteredProducts);
    }

    // 4. إضافة مستمعي الأحداث (Event Listeners)
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);

    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        categoryFilter.value = '';
        priceFilter.value = '';
        renderProducts(allProducts); // إعادة عرض كل المنتجات
    });

    // عرض كل المنتجات عند تحميل الصفحة لأول مرة
    renderProducts(allProducts);
});

// دالة مبدئية لعربة التسوق (كما في الرئيسية)
let cartTotal = 0;
function addToCart(productId) {
    cartTotal++;
    document.getElementById('cartCount').innerText = cartTotal;
}