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

