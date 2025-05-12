// js/handlers.js

// Функції, які передаються колбеками в addEventListners

import { openModal } from './modal.js';
import { cards } from './storage.js';
import { refs } from './refs.js';

// Показ повідомлення "не знайдено"
export function showNotFoundMessage() {
    const notFound = document.querySelector('.not-found');
    if (notFound) {
      notFound.classList.add('not-found--visible');
    }
  }
// Сховати повідомлення "не знайдено" 
  export function hideNotFoundMessage() {
    const notFound = document.querySelector('.not-found');
    if (notFound) {
      notFound.classList.remove('not-found--visible');
    }
  }  
  // Функція для відображення кнопки 
export function showLoadMoreBtn() {
    if (refs.loadMoreBtn) {
        refs.loadMoreBtn.classList.remove('is-hidden');
        refs.loadMoreBtn.classList.add('is-visible');
    }
}
// Функція для приховування кнопки 
export function hideLoadMoreBtn() {
    if (refs.loadMoreBtn) {
        refs.loadMoreBtn.classList.add('is-hidden');
        refs.loadMoreBtn.classList.remove('is-visible');
    }
}
// Функція для відображення лоадера
export function showLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.classList.remove('is-hidden');
      loader.classList.add('is-visible');
    }
  }
  // Функція для приховування лоадера
  export function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.classList.add('is-hidden');
      loader.classList.remove('is-visible');
    }
  }
// Функція для очищення розмітки продуктів та відображення лоадера
export function showPageLoader() {
  document.querySelectorAll('.loader-page').forEach(loader => {
    loader.classList.remove('is-hidden');
    loader.classList.add('is-visible');
  });
}
// Функція для приховування лоадера
export function hidePageLoader() {
  document.querySelectorAll('.loader-page').forEach(loader => {
    loader.classList.add('is-hidden');
    loader.classList.remove('is-visible');
  });
}
// Функція для обробки кліка на картку продукту
export function onProductCardClick(e) {
    const card = e.target.closest('.products__item');
    if (!card) return;
  
    const productId = card.dataset.id;
    const product = cards.find(p => p.id === Number(productId));
  
    if (product) {
      openModal(product);
    }
}
  
