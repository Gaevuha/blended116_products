// wishlist.js
//Логіка сторінки Wishlist

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getCart, updateCartCount } from './js/storage.js';
import { createMarkupProducts } from './js/render-function.js';
import {
    showNotFoundMessage,
    hideNotFoundMessage,
    showLoadMoreBtn,
    hideLoadMoreBtn,
    showLoader,
    hideLoader,
    showPageLoader,
    hidePageLoader,
} from './js/handlers.js';
import { refs } from './js/refs.js';
  import { fetchProductById } from './js/products-api.js';
import { openModal } from './js/modal.js';

document.addEventListener('DOMContentLoaded', () => {
    // renderCartProducts();  
    updateCartCount();
});

