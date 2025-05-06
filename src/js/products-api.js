// src/js/products-api.js

// Функції для роботи з бекендом
import axios from 'axios';

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