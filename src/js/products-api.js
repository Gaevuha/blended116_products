// src/js/products-api.js

// Функції для роботи з бекендом
import axios from 'axios';
// Функція для отримання категорій продуктів
export async function fetchProductCategories() {
    const API_URL_CATEGORY = 'https://dummyjson.com/products/category-list';
  try {
    const response = await axios.get(API_URL_CATEGORY);
    return response.data; // повертає масив категорій
  } catch (error) {
    console.error('Помилка під час отримання категорій:', error.message);
    throw error;
  }
}
// Функція для отримання продуктів за категорією
export async function fetchProductsByCategory(category) {
    // Встановлюємо поточну сторінку (статично — завжди 1)
    const currentPage = 1;

    // Формуємо URL для отримання 12 продуктів зі зміщенням відповідно до сторінки (skip = 0)
    const API_URL_PRODUCTS = `https://dummyjson.com/products/category/${category}?limit=12&skip=${(currentPage - 1) * 12}`;

    try {
        // Виконуємо GET-запит до API
        const response = await axios.get(API_URL_PRODUCTS);

        // Повертаємо тільки масив продуктів із відповіді
        return response.data.products;

    } catch (error) {
        // Якщо сталася помилка — виводимо повідомлення
        console.error('Помилка під час отримання продуктів:', error.message);

        // Передаємо помилку далі
        throw error;
    }
}
// Функція для отримання всіх продуктів
export async function fetchAllProducts() {
    // Встановлюємо поточну сторінку (статично — завжди 1)
    const currentPage = 1;

    // Формуємо URL для отримання 12 продуктів зі зміщенням відповідно до сторінки (skip = 0)
    const API_URL_PRODUCTS = `https://dummyjson.com/products?limit=12&skip=${(currentPage - 1) * 12}`;

    try {
        // Виконуємо GET-запит до API
        const response = await axios.get(API_URL_PRODUCTS);

        // Повертаємо тільки масив продуктів із відповіді
        return response.data.products;

    } catch (error) {
        // Якщо сталася помилка — виводимо повідомлення
        console.error('Помилка під час отримання продуктів:', error.message);

        // Передаємо помилку далі
        throw error;
    }
}
// Функція для отримання продуктів за ID
export async function fetchProductById(id) {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return await response.json();
}
// Функція для пошуку продуктів за назвою
export async function searchProductsByName(query) {
  const API_URL = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=12`;

  try {
    const response = await axios.get(API_URL);
    return response.data.products;
  } catch (error) {
    console.error('Помилка під час пошуку продуктів:', error.message);
    throw error;
  }
}
