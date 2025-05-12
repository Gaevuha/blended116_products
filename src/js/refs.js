// File: src/js/refs.js

//Обʼєкт з посиланнями на ДОМ елементи

export const refs = {
    formEl: document.querySelector('.search-form'),
    inputEl: document.querySelector('.search-form__input'),
    clearSearchBtnEl: document.querySelector('.search-form__btn-clear'),
    searchBtnEl: document.querySelector('.search-form__btn'),
    categoriesListEl: document.querySelector('.categories'),
    productsListEl: document.querySelector('.products'),
    loadMoreBtn: document.querySelector('.btn'),
    loaderEl: document.querySelector('.loader'),
    modalEl: document.querySelector('.modal'),
    modalCloseBtnEl: document.querySelector('.modal__close-btn'),
    modalContentEl: document.querySelector('.modal__content'),
    modalOverlayEl: document.querySelector('.modal__overlay'),
    notFound: document.querySelector('.not-found'),
    modalProductBtnCart: document.querySelector('.modal-product__btn--cart'),
    modalProductBtnWishlist: document.querySelector('.modal-product__btn--wishlist'),
    cartPageProduct: document.querySelector('.product-page .products'),
    buyBtn: document.querySelector('.cart-summary__btn'),
    wishlistPageProduct: document.querySelector('.js-wishlist-product'),
};
