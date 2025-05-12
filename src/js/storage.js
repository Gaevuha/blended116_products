//Робота з loacalStorage
// js/cards-storage.js

// cards-storage.js
export let cards = [];

export function saveCardsToStorage() {
  localStorage.setItem('cards', JSON.stringify(cards));
}

export function loadCardsFromStorage() {
  const saved = localStorage.getItem('cards');
  if (saved) {
    cards = JSON.parse(saved);
  }
}

// storage.js
const CART_KEY = 'cart';

export function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();
  cart.push(product);
  saveCart(cart);
}

export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(p => p.id !== productId);
  saveCart(cart);
}

export function isInCart(productId) {
  return getCart().some(p => p.id === productId);
}

export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const counterEl = document.querySelector('[data-cart-count]');
  if (counterEl) {
    counterEl.textContent = cart.length;
  }
}


