//cart.js

//Логіка сторінки Cart

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getCart, updateCartCount } from './js/storage.js';
import { createMarkupProducts } from './js/render-function.js';
import {
    showNotFoundMessage,
    hideNotFoundMessage,
    showLoader,
    hideLoader,
} from './js/handlers.js';
import { refs } from './js/refs.js';
  import { fetchProductById } from './js/products-api.js';
import { openModal } from './js/modal.js';

document.addEventListener('DOMContentLoaded', () => {
    renderCartProducts();  
    updateCartCount();
});

function renderCartProducts() {
    const cartItems = getCart();
    const list = document.querySelector('.products');
  
    list.innerHTML = ''; // очищаємо список
  
    if (cartItems.length === 0) {
      showNotFoundMessage();
      updateSummary(cartItems); // Показати нульові значення
      return;
    }
  
    hideNotFoundMessage();
  
    const markup = createMarkupProducts(cartItems);
    list.insertAdjacentHTML('beforeend', markup);
  
    updateSummary(cartItems);
  }
  

function updateSummary(cartItems) {
  const countEl = document.querySelector('[data-count]');
  const priceEl = document.querySelector('[data-price]');
  const totalCount = cartItems.length;
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  countEl.textContent = totalCount;
  priceEl.textContent = `$${totalPrice.toFixed(2)}`;
}

// Додаємо обробник події для відкриття модального вікна з деталями продукту
refs.cartPageProduct.addEventListener('click', async (e) => {
    const productCard = e.target.closest('.products__item');
    if (!productCard) return;

    const productId = productCard.dataset.id;
    if (!productId) return;

    try {
        showLoader();
        const product = await fetchProductById(productId);
        openModal(product); // Показ модального вікна з деталями
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: 'Failed to load product details.',
            position: 'topCenter',
        });
        console.error('Error loading product:', error);
    } finally {
        hideLoader();
    }
});


refs.buyBtn.addEventListener('click', () => {
  const cartItems = getCart();

  if (cartItems.length === 0) {
    iziToast.warning({
      title: 'Cart is empty',
      message: 'Please add products before buying.',
      position: 'topCenter',
    });
    return;
  }

  iziToast.success({
    title: 'Success',
    message: 'Thank you for your purchase!',
    position: 'topCenter',
  });

  // Очистити кошик
  localStorage.removeItem('cart');
  renderCartProducts();
  updateCartCount();
});
