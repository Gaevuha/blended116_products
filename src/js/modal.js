// modal.js

//Описана робота модалки - відкриття закриття і все що з модалкою повʼязано
// modal.js

import { refs } from "./refs";
import { renderModalProduct } from "./render-function";


// Відкрити модалку
export function openModal(product) {
  renderModalProduct(product);
  refs.modalEl.classList.add('modal--is-open');
}

// Закрити модалку
export function closeModal() {
  refs.modalEl.classList.remove('modal--is-open');
  // Очищаємо тільки вміст .modal-product
  const modalProductContainer = refs.modalContentEl.querySelector('.modal-product');
  if (modalProductContainer) {
    modalProductContainer.innerHTML = '';
  }
}

// === 👇 Додай ось цей код прямо після функцій ===

// Закриття по кліку на кнопку або на оверлей
refs.modalEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal__close-btn') || e.target === refs.modalEl) {
    closeModal();
  }
});

// Закриття по клавіші Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
