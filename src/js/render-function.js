// src/js/render-function.js

import { fetchProductCategories, fetchAllProducts } from './products-api.js';
import { refs } from './refs.js';
import { cards } from './storage.js';
import { openModal } from './modal.js';
import {
  onProductCardClick,
  showLoadMoreBtn,
  hideLoader,
  showNotFoundMessage,
  hideNotFoundMessage
} from './handlers.js';
import { getCart, addToCart, removeFromCart, isInCart, updateCartCount } from './storage.js';


//Функції для створення, рендеру або видалення розмітки
const listProducts = document.querySelector('.products');
// Функція для створення розмітки категорій
export function createMarkupCategories(categories) {
    return categories
        .map(category => {
            return `<li class="categories__item">
   <button class="categories__btn" type="button" data-category="${category}">${category}</button>
 </li>
`
        }).join('');
}
// Функція для створення розмітки продуктів
export function createMarkupProducts(products) {
    return products
        .map(product => {
            return `<li class="products__item" data-id="${product.id}">
                  <img class="products__image" src="${product.thumbnail}" alt="${product.title}"/>
                   <p class="products__title">${product.title}</p>
                    <p class="products__brand"><span class="products__brand--bold">Brand: </span>${product.brand}</p>
                    <p class="products__category">Category: ${product.category}</p>
                    <p class="products__price">Price: ${product.price} $</p>
 </li>
`   }).join('');
}
// Функція для ініціалізації сторінки
export async function initPage() {
  // Сховати список категорій та продуктів перед завантаженням
  refs.categoriesListEl.classList.add('hidden');
  refs.productsListEl.classList.add('hidden');

  // Сховати блок "not-found", якщо він був показаний раніше
  document.querySelector('.not-found').classList.add('is-hidden');


  try {
    // Отримати список категорій з API
    const categories = await fetchProductCategories();

    // Отримати список всіх продуктів (наприклад, перших 12 або всі, залежно від реалізації)
    const products = await fetchAllProducts();

    // Створити HTML-розмітку для списку категорій
    const categoriesMarkup = createMarkupCategories(categories);

    // Створити HTML-розмітку для списку продуктів
    const productsMarkup = createMarkupProducts(products);

    // Отримати посилання на DOM-елементи списків
    const categoriesList = document.querySelector('.categories');
    const productsList = document.querySelector('.products');

    // Додати HTML категорій до списку на сторінці
    categoriesList.insertAdjacentHTML('beforeend', categoriesMarkup);

    // Якщо масив продуктів порожній:
    if (products.length === 0) {
      // Показати блок "No Products Found"
      document.querySelector('.not-found').classList.remove('is-hidden');
    } else {
      // Якщо продукти є — вставити HTML до DOM
      productsList.insertAdjacentHTML('beforeend', productsMarkup);

      // Показати список продуктів
      refs.productsListEl.classList.remove('hidden');
    }
    showLoadMoreBtn();// Показати кнопку "Load more"
    
    // Показати список категорій
    refs.categoriesListEl.classList.remove('hidden');

    //  Додати делегування подій на картки
    productsList.addEventListener('click', e => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    const id = card.dataset.id;
    if (!id) return;

      openModal(id);
      
});

  } catch (error) {
    // Вивести помилку у консоль, якщо щось пішло не так при запиті
    console.error('Помилка при ініціалізації сторінки:', error.message);
  } finally {
    // У будь-якому випадку — сховати спінер
    hideLoader();
  }
}

// Функція для очищення розмітки продуктів
export function clearMarkupProducts() {
    listProducts.innerHTML = '';
}
// Функція додавання елементів на сторінку по кліку на кнопку 'Load more'
export async function addLoadMoreProducts(products) {
    try {
        const products = await fetchAllProducts();
        const markup = createMarkupProducts(products);
        listProducts.insertAdjacentHTML('beforeend', markup);
    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
}

// Функція для рендерингу карток з localStorage
export async function renderCardsFromStorage() {
    if (cards.length > 0) {
        const markup = createMarkupProducts(cards);
        refs.productsListEl.insertAdjacentHTML('beforeend', markup);
        showLoadMoreBtn();
    }
}

// Функція для рендерингу продукту в модальному вікні
export async function renderModalProduct(product) {
  const {
    id,
    images,
    title,
    description,
    tags,
    shippingInformation,
    returnPolicy,
    price,
  } = product;

  //шукаємо контейнер для модального продукту
   const modalProductContainer = refs.modalContentEl.querySelector('.modal-product');
  if (!modalProductContainer) {
    console.warn('Element .modal-product not found');
    return;
  }

  // Оновлюємо лише вміст .modal-product
  modalProductContainer.innerHTML = `
    <img class="modal-product__img" src="${images[0]}" alt="${title}" />
    <div class="modal-product__content">
      <p class="modal-product__title">${title}</p>
      <ul class="modal-product__tags">${tags?.map(tag => `<li>${tag}</li>`).join('')}</ul>
      <p class="modal-product__description">${description}</p>
      <p class="modal-product__shipping-information">Shipping: ${shippingInformation || "Not specified"}</p>
      <p class="modal-product__return-policy">Return Policy: ${returnPolicy || "Not specified"}</p>
      <p class="modal-product__price">Price: ${price}$</p>
      <button class="modal-product__buy-btn" type="button">Buy</button>
    </div>
  `;
  const cartBtn = refs.modalContentEl.querySelector('.modal-product__btn--cart');
  if (!cartBtn) return;

  // Перевірка, чи товар у кошику
  const inCart = isInCart(id);
  cartBtn.textContent = inCart ? 'Remove from Cart' : 'Add to Cart';

  // Обробник кліку
  cartBtn.onclick = () => {
    const cartList = document.querySelector('.products');
  
    if (isInCart(id)) {
      removeFromCart(id);
      cartBtn.textContent = 'Add to Cart';
  
      // 🔥 Видаляємо відповідну картку з кошика (якщо на сторінці Cart)
      const productCard = cartList?.querySelector(`.products__item[data-id="${id}"]`);
      if (productCard) productCard.remove();
  
      // 🔁 Після видалення оновлюємо підсумки
      const updatedCart = getCart();
      updateCartCount();
      updateSummary(updatedCart);
  
      if (updatedCart.length === 0) {
        showNotFoundMessage();
      }
  
    } else {
      addToCart(product);
      cartBtn.textContent = 'Remove from Cart';
  
      // 🛒 Рендеримо товар у список, якщо на сторінці Cart
      if (cartList) {
        const markup = createMarkupProducts([product]);
        cartList.insertAdjacentHTML('beforeend', markup);
      }
  
      updateCartCount();
    }
  };
}

// Функція для додавання слухача подій на картки продуктів
export function addCardClickListener() {
  if (refs.productsListEl) {
    refs.productsListEl.addEventListener('click', onProductCardClick);
  } else {
    console.warn('refs.productsListEl не знайдено');
  }
}
// Функція для відображення повідомлення "No Products Found"
export function renderCartProducts() {
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

// Функція для оновлення підсумків у кошику
export function updateSummary(cartItems) {
const countEl = document.querySelector('[data-count]');
const priceEl = document.querySelector('[data-price]');
const totalCount = cartItems.length;
const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

countEl.textContent = totalCount;
priceEl.textContent = `$${totalPrice.toFixed(2)}`;
}