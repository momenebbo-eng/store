// validation.js - simple client-side form validation for contact form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const msg = document.getElementById('message');
    const alertBox = document.getElementById('formAlert');

    // Reset validation states
    [name, email, msg].forEach(el => {
      el.classList.remove('is-invalid');
    });
    alertBox.innerHTML = '';

    if (!name.value.trim()) {
      name.classList.add('is-invalid');
      valid = false;
    }
    if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) {
      email.classList.add('is-invalid');
      valid = false;
    }
    if (!msg.value.trim()) {
      msg.classList.add('is-invalid');
      valid = false;
    }

    if (!valid) return;

    // Simulate successful submission
    alertBox.innerHTML = `<div class="alert alert-success">تم استلام رسالتك، شكرًا لتواصلك معنا!</div>`;
    form.reset();
  });
});
