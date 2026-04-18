// cart.js - إدارة عربة التسوق وإرسال الطلبات عبر البريد الإلكتروني (EmailJS)
document.addEventListener('DOMContentLoaded', () => {
  const cartItemsDiv = document.getElementById('cartItems');
  const totalPriceSpan = document.getElementById('totalPrice');
  const clearBtn = document.getElementById('clearCartBtn');
  const orderForm = document.getElementById('orderForm'); // التأكد من وجود ID للفورم في الـ HTML

  // تفعيل خدمة EmailJS بالمفتاح الخاص بك
  emailjs.init("IuxryG7bfg4phX9OO");

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    renderCart(cart);
  }

  function renderCart(cart) {
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = '<div class="alert alert-info text-center">عربة التسوق فارغة حالياً.</div>';
      totalPriceSpan.textContent = '0.00';
      return;
    }

    let html = `<table class="table table-bordered table-striped text-center align-middle shadow-sm">
      <thead class="table-primary">
        <tr>
          <th>المنتج</th>
          <th>السعر</th>
          <th>الإجراء</th>
        </tr>
      </thead>
      <tbody>`;

    let total = 0;
    cart.forEach((item, index) => {
      total += item.price;
      html += `
        <tr>
          <td class="fw-bold">${item.name}</td>
          <td class="text-primary">${item.price.toFixed(2)} جنيه</td>
          <td>
            <button class="btn btn-sm btn-danger rounded-pill px-3" onclick="removeItem(${index})">
              <i class="bi bi-trash"></i> حذف
            </button>
          </td>
        </tr>`;
    });

    html += `</tbody></table>`;
    cartItemsDiv.innerHTML = html;
    totalPriceSpan.textContent = total.toFixed(2);
  }

  // دالة حذف عنصر واحد
  window.removeItem = function(index) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    
    // التحقق من وجود دالة تحديث العداد لتجنب الأخطاء
    if (typeof updateCartCount === 'function') {
      updateCartCount();
    }
  }

  // مسح السلة بالكامل
  clearBtn.addEventListener('click', () => {
    if (confirm("هل أنت متأكد من مسح جميع محتويات السلة؟")) {
      localStorage.removeItem('cart');
      loadCart();
      if (typeof updateCartCount === 'function') {
        updateCartCount();
      }
    }
  });

  // --- كود إرسال الطلب للإيميل ---
  if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (cart.length === 0) {
        alert("عذراً، السلة فارغة! أضف بعض المنتجات أولاً.");
        return;
      }

      // تجميع البيانات من المدخلات (تأكد أن الـ IDs دي موجودة في ملف cart.html)
      const name = document.getElementById('custName').value;
      const phone = document.getElementById('custPhone').value;
      const address = document.getElementById('custAddress').value;
      const totalAmount = totalPriceSpan.textContent;

      // تجهيز قائمة المنتجات كنص مرتب للإيميل
      let orderDetails = "تفاصيل الطلب:\n";
      cart.forEach((item, i) => {
        orderDetails += `${i + 1}- ${item.name} (${item.price} EGP)\n`;
      });

      // المعاملات التي سيتم إرسالها للقالب (Template)
      // تأكد أن هذه الأسماء مطابقة لما وضعته بين {{ }} في موقع EmailJS
      const templateParams = {
        customer_name: name,
        customer_phone: phone,
        address: address,
        order_details: orderDetails,
        total_price: totalAmount
      };

      // تغيير حالة الزر لمنع التكرار أثناء الإرسال
      const submitBtn = orderForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      submitBtn.disabled = true;
      submitBtn.innerText = "جاري إرسال الطلب...";

      // عملية الإرسال الفعلية
      // استبدل 'YOUR_TEMPLATE_ID' بالآيدي الخاص بك من الموقع
      emailjs.send('service_hyrn654', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
          alert('✅ تم إرسال طلبك بنجاح! سنقوم بالتواصل معك قريباً.');
          localStorage.removeItem('cart');
          loadCart();
          if (typeof updateCartCount === 'function') updateCartCount();
          orderForm.reset();
        }, function(error) {
          alert('❌ فشل إرسال الطلب، برجاء المحاولة لاحقاً: ' + JSON.stringify(error));
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        });
    });
  }

  loadCart();
});