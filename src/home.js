// src/js/home.js

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { fetchProductsByCategory, fetchAllProducts, fetchProductById } from './js/products-api.js';
import {   
    createMarkupProducts,
    clearMarkupProducts,
    initPage,
    showLoadMoreBtn,
    hideLoadMoreBtn,
    showLoader,
    hideLoader,
    addLoadMoreProducts,
    renderCardsFromStorage,
    showPageLoader,
    hidePageLoader
} from "./js/render-function";
import { refs } from './js/refs.js';
import { cards, saveCardsToStorage, loadCardsFromStorage } from './js/storage.js';
import { openModal, closeModal } from './js/modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    showPageLoader();

    await initPage();   // Дочекайся завершення
    hidePageLoader();   // Ховаємо тільки після завантаження

    loadCardsFromStorage();        // Локальні картки
    renderCardsFromStorage();      // Відображення карток
});

// Змінна для збереження поточного пошукового запиту
let currentQuery = '';

// Змінна для відстеження поточної сторінки при пагінації
let currentPage = 1;

// Кількість продуктів, які будуть завантажені на одну сторінку
const IMAGES_PER_PAGE = 12;

 

// Додаємо обробник події на категорії
refs.categoriesListEl.addEventListener('click', async (e) => {
    if (e.target === e.currentTarget) return
    // Отримуємо ID категорії з атрибута data-id
    const categoryName = e.target.dataset.category;

    // Якщо ID не вказано — виходимо з функції
    if (!categoryName) return;

  // Додаємо/знімаємо клас активної кнопки
    const categoryButtons = refs.categoriesListEl.querySelectorAll('.categories__btn');
    categoryButtons.forEach(btn => btn.classList.remove('categories__btn--active'));
    e.target.classList.add('categories__btn--active');
    // Скидаємо номер сторінки на 1
    currentPage = 1;

    // Якщо запит валідний:
    clearMarkupProducts();  
    hideLoadMoreBtn();
    showLoader();
    try {
        const products = await fetchProductsByCategory(categoryName);

        if (products.length === 0) {
            iziToast.error({
                title: 'Error',
                message: 'No products found in this category.',
                position: 'topCenter',
            });
            hideLoader();
            return;
        }
            cards.length = 0;
            cards.push(...products);
            saveCardsToStorage();


         // Якщо продукти знайдені — створюємо HTML-розмітку
        const markup = createMarkupProducts(products);

        // Вставляємо згенеровану розмітку в DOM
        refs.productsListEl.insertAdjacentHTML('beforeend', markup);

        // Показуємо кнопку "Load More" для завантаження наступної сторінки
        showLoadMoreBtn();

    } catch (error) {
        console.error('Error fetching products:', error.message);
    } finally {
        hideLoader(); // Ховаємо анімацію завантаження
    }
});
// Додаємо обробник події на форму (пошуковий запит)
refs.formEl.addEventListener('submit', async (e) => {
    e.preventDefault(); // Відміняємо стандартну поведінку форми (перезавантаження сторінки)

    // Отримуємо значення з поля вводу та обрізаємо зайві пробіли
    currentQuery = refs.inputEl.value.trim();

    // Якщо поле порожнє — показуємо повідомлення про помилку і зупиняємо виконання
    if (!currentQuery) {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a search query.', // Повідомлення для користувача
            position: 'topCenter',                   // Позиція повідомлення
        });
        return; // Виходимо з функції
    }

    // Якщо запит валідний:
    currentPage = 1;           // Скидаємо лічильник сторінок на першу
    clearMarkupProducts();     // Очищаємо попередні результати зі сторінки
    showLoader();              // Показуємо анімацію завантаження (спінер)
     hideLoadMoreBtn();

    try {
        // Виконуємо запит до API на отримання продуктів (за пошуковим запитом, сторінкою і лімітом)
        const products = await fetchAllProducts(currentQuery, currentPage, IMAGES_PER_PAGE);

        // Якщо нічого не знайдено — показуємо повідомлення про помилку
        if (products.length === 0) {
            iziToast.error({
                title: 'Error',
                message: 'No products found.', // Текст повідомлення
                position: 'topCenter',         // Позиція
            });
            hideLoader(); // Ховаємо анімацію завантаження
            return;       // Виходимо з функції
        }
           cards.length = 0;
           cards.push(...products);
           saveCardsToStorage();


        // Якщо продукти знайдені — створюємо HTML-розмітку
        const markup = createMarkupProducts(products);

        // Вставляємо згенеровану розмітку в DOM
        refs.productsListEl.insertAdjacentHTML('beforeend', markup);

        // Показуємо кнопку "Load More" для завантаження наступної сторінки
        showLoadMoreBtn();

    } catch (error) {
        // Якщо сталася помилка при запиті — лог у консоль
        console.error('Error fetching products:', error.message);

    } finally {
        // У будь-якому випадку (успіх або помилка) — ховаємо лоадер і скидаємо форму
        hideLoader();         // Ховаємо анімацію завантаження
        refs.formEl.reset();  // Очищаємо форму пошуку
    }
});

// Додаємо обробник події на кнопку "Load More"
refs.loadMoreBtn.addEventListener('click', async () => {
  // Збільшуємо номер сторінки — це дозволяє завантажити наступну "партію" товарів
  currentPage += 1;

  // Показуємо індикатор завантаження
    showLoader();
    hideLoadMoreBtn();   

  // Встановлюємо мінімальний час показу лоадера (2 секунди)
  const startTime = Date.now();
  const MIN_LOADER_TIME = 2000;

  try {
    // Отримуємо продукти за поточним запитом і сторінкою
    const products = await fetchAllProducts(currentQuery, currentPage);

    // Якщо нових продуктів немає, показуємо повідомлення і ховаємо кнопку
    if (products.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'No more products found.',
        position: 'topCenter',
      });
      hideLoadMoreBtn();
      return;
    }

    // Рендеримо продукти до DOM (ця функція має вставити нову порцію продуктів)
    addLoadMoreProducts(products);

  } catch (error) {
    // Якщо сталася помилка — виводимо повідомлення
    iziToast.error({
      title: 'Error',
      message: 'Failed to load products.',
      position: 'topCenter',
    });
  } finally {
    // Забезпечуємо мінімальний час відображення лоадера
    const elapsedTime = Date.now() - startTime;
    const remainingTime = MIN_LOADER_TIME - elapsedTime;

    if (remainingTime > 0) {
        setTimeout(() => {
        showLoadMoreBtn();
        hideLoader();
      }, remainingTime);
    } else {
        hideLoader();
        showLoadMoreBtn();
    }
  }
});

// Додаємо обробник події на кнопку очищення пошуку
refs.clearSearchBtnEl.addEventListener('click', () => {
    // Очищаємо поле вводу
    refs.inputEl.value = '';

    // // Очищаємо список продуктів
    // clearMarkupProducts();

    // // Ховаємо кнопку "Load More"
    // hideLoadMoreBtn();

    // Скидаємо номер сторінки на 1
    currentPage = 1;

    // Показуємо повідомлення про очищення пошуку
    iziToast.info({
        title: 'Info',
        message: 'Search cleared.',
        position: 'topCenter',
    });
});

// Додаємо обробник події для відкриття модального вікна з деталями продукту
refs.productsListEl.addEventListener('click', async (e) => {
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

