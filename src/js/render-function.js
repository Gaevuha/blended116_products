// src/js/render-function.js

import { fetchProductCategories, fetchAllProducts } from './products-api.js';
import { refs } from './refs.js';

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

// Функція для ініціалізації сторінки (отримання даних і рендеринг)
export async function initPage() {
  try {
    // Отримуємо категорії і продукти
    const categories = await fetchProductCategories();
    const products = await fetchAllProducts();

    // Створюємо розмітку категорій і продуктів
    const categoriesMarkup = createMarkupCategories(categories);
    const productsMarkup = createMarkupProducts(products);

    // Вставляємо розмітку в DOM
    const categoriesList = document.querySelector('.categories');
    const productsList = document.querySelector('.products');
    
    categoriesList.insertAdjacentHTML('beforeend', categoriesMarkup);
    productsList.insertAdjacentHTML('beforeend', productsMarkup);
      
      showLoadMoreBtn();
  
  } catch (error) {
    console.error('Помилка при ініціалізації сторінки:', error.message);
  }
}

// Функція для очищення розмітки продуктів
export function clearMarkupProducts() {
    listProducts.innerHTML = '';
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

// Функція додавання елементів на стлорінку по кліку на кнопку 'Load more'
export async function addLoadMoreProducts(products) {
    try {
        const products = await fetchAllProducts();
        const markup = createMarkupProducts(products);
        listProducts.insertAdjacentHTML('beforeend', markup);
    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
}
