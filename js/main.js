// main.js - common helpers for pages

// Helper: load JSON products
async function loadProductsJson() {
  try {
    const res = await fetch('data/products.json');
    if (!res.ok) throw new Error('Failed to load products.json');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Helper: create product card HTML (Bootstrap)
function createProductCard(product) {
  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-md-4';
  col.innerHTML = `
    <div class="card h-100">
      <img src="${product.image}" class="card-img-top" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${product.name}</h5>
        <p class="product-price mb-2">${product.price} جنيه</p>
        <p class="text-muted mb-3">${product.category}</p>
        <div class="mt-auto">
          <a href="product-details.html?id=${product.id}" class="btn btn-sm btn-primary w-100">عرض المنتج</a>
        </div>
      </div>
    </div>
  `;
  return col;
}

// Populate featured on homepage (top 3)
async function populateFeatured(containerId = 'featuredRow') {
  const products = await loadProductsJson();
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  products.slice(0,3).forEach(p => container.appendChild(createProductCard(p)));
}

// Populate products grid with given filter function
async function populateProductsGrid(filterFn = null) {
  const products = await loadProductsJson();
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const list = filterFn ? products.filter(filterFn) : products;
  if (list.length === 0) {
    grid.innerHTML = '<div class="col-12"><p class="text-center">لا توجد نتائج.</p></div>';
    return;
  }
  list.forEach(p => grid.appendChild(createProductCard(p)));
}

// Fill category select options
async function populateCategoryOptions(selectId = 'categoryFilter') {
  const products = await loadProductsJson();
  const select = document.getElementById(selectId);
  if (!select) return;
  const cats = Array.from(new Set(products.map(p => p.category)));
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

// Load product detail by id and render into #productDetail
async function renderProductDetail() {
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'), 10);
  const container = document.getElementById('productDetail');
  if (!container) return;
  const products = await loadProductsJson();
  const p = products.find(x => x.id === id);
  if (!p) {
    container.innerHTML = '<div class="col-12"><p class="text-center">المنتج غير موجود.</p></div>';
    return;
  }
  container.innerHTML = `
    <div class="col-md-6">
      <img src="${p.image}" class="img-fluid" alt="${p.name}" onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'">
    </div>
    <div class="col-md-6">
      <h2>${p.name}</h2>
      <p class="product-price">${p.price} جنيه</p>
      <p class="text-muted">${p.category}</p>
      <p>${p.description}</p>
      <button id="addToCartBtn" class="btn btn-success">أضف إلى العربة</button>
      <div id="cartMsg" class="mt-3"></div>
    </div>
  `;

  document.getElementById('addToCartBtn').addEventListener('click', () => {
    // simple localStorage cart example
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ id: p.id, name: p.name, price: p.price });
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('cartMsg').innerHTML = `<div class="alert alert-success">أضيف المنتج للعربة (${cart.length})</div>`;
    updateCartCount();
  });
}

// Update cart count in navbar (if you want to show)
//function updateCartCount() {
//  const count = JSON.parse(localStorage.getItem('cart') || '[]').length;
//  // If you add an element to show count, update it here.
//  // Example: document.getElementById('cartCount').textContent = count;
//}
function updateCartCount() {
  const count = JSON.parse(localStorage.getItem('cart') || '[]').length;
  const cartCountSpan = document.getElementById('cartCount');
  if (cartCountSpan) cartCountSpan.textContent = count;
}



// Auto-run some functions for pages
document.addEventListener('DOMContentLoaded', () => {
  populateFeatured(); // safe to run on all pages (no-op if element not present)
  updateCartCount();
});
function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authContainer = document.querySelector('.d-flex.align-items-center.gap-2'); // الحاوية التي بها الأزرار

    if (user && authContainer) {
        authContainer.innerHTML = `
            <div class="dropdown">
                <div class="d-flex align-items-center gap-2 pointer shadow-sm p-1 px-2 rounded-pill bg-white" data-bs-toggle="dropdown" style="cursor:pointer">
                    <img src="https://ui-avatars.com/api/?name=${user.name}&background=4361ee&color=fff" class="rounded-circle" width="35">
                    <div class="d-none d-md-block">
                        <small class="d-block fw-bold text-dark" style="line-height:1">${user.name}</small>
                        <small class="text-muted" style="font-size:10px">${user.email}</small>
                    </div>
                </div>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                    <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>ملفي الشخصي</a></li>
                    <li><a class="dropdown-item" href="#"><i class="bi bi-bag-check me-2"></i>طلباتي</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="bi bi-box-arrow-right me-2"></i>تسجيل الخروج</a></li>
                </ul>
            </div>
            <a href="cart.html" class="btn btn-primary position-relative rounded-circle p-2 ms-2">
                <i class="bi bi-cart3"></i>
                <span id="cartCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
            </a>
        `;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// تنفيذها عند تحميل أي صفحة
document.addEventListener('DOMContentLoaded', updateNavbar);