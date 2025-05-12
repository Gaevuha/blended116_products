// src/js/home.js

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import {
    fetchProductsByCategory,
    fetchAllProducts,
    fetchProductById,
    searchProductsByName
} from './js/products-api.js';
import {   
    createMarkupProducts,
    clearMarkupProducts,
    initPage,
    addLoadMoreProducts,
    addCardClickListener
} from "./js/render-function";
import { refs } from './js/refs.js';
import { cards, saveCardsToStorage, updateCartCount } from './js/storage.js';
import { openModal } from './js/modal.js';
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


document.addEventListener('DOMContentLoaded', async () => {
  showPageLoader();
  updateCartCount();

  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    await initPage();          // ✅ єдиний правильний виклик
    addCardClickListener();    // ✅ після завершення initPage()
  } catch (error) {
    console.error('Помилка під час ініціалізації сторінки:', error.message);
  } finally {
    hidePageLoader();
    document.getElementById('content').classList.remove('is-hidden');
  }
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
// Обробник події submit форми пошуку
refs.formEl.addEventListener('submit', async (e) => {
  e.preventDefault(); // Скасовуємо перезавантаження сторінки при відправці форми

  const query = refs.inputEl.value.trim(); // Отримуємо та обрізаємо значення з поля вводу

  // Якщо поле порожнє — показуємо повідомлення про помилку
  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query.',
      position: 'topCenter',
    });
    return; // Вихід із функції
  }

  clearMarkupProducts(); // Очищаємо попередні результати на сторінці
  hideLoadMoreBtn();     // Приховуємо кнопку "Load More"
  showLoader();          // Показуємо анімацію завантаження (спінер)

  try {
    // Шукаємо товари за введеним запитом
    const products = await searchProductsByName(query);

   
    // Якщо товари не знайдено — показуємо блок not-found
    if (!products || products.length === 0) {
      showNotFoundMessage();
      return;
    }

    // Якщо знайдено — ховаємо блок not-found
    hideNotFoundMessage();

    // Очищаємо масив карток і додаємо нові
    cards.length = 0;
    cards.push(...products);
    saveCardsToStorage(); // Зберігаємо картки у localStorage

    // Створюємо HTML-розмітку з отриманих товарів
    const markup = createMarkupProducts(products);

    // Вставляємо розмітку в DOM (в кінець списку)
    refs.productsListEl.insertAdjacentHTML('beforeend', markup);

    // Показуємо кнопку "Load More"
    showLoadMoreBtn();

  } catch (error) {
    // Якщо сталася помилка — виводимо її в консоль і показуємо повідомлення
    console.error('Search error:', error.message);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again.',
      position: 'topCenter',
    });
  } finally {
    // Завжди ховаємо лоадер і очищаємо поле вводу
    hideLoader();
    refs.formEl.reset();
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

