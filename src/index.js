import './pages/index.css';

import { initialCards } from './scripts/cards';
import { showPopup, closePopup } from './scripts/modal';
import { renderCard, removeCard, likeCard } from './scripts/card';

// Место вставки списка карточек
const cardsList = document.querySelector('.places__list');

// Кнопки
const addButton = document.querySelector('.profile__add-button'); 
const profileEditButton = document.querySelector('.profile__edit-button');

// Попапы
const popupCloseButton = document.querySelector('.popup__close');
const newCardFormPopup = document.querySelector('.popup_type_new-card');
const profileEditPopup = document.querySelector('.popup_type_edit');
const imgCardPopup = document.querySelector('.popup_type_image');

// Профиль
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Формы
const editForm = document.forms['edit-profile'];
const addForm = document.forms['new-place'];

// Отрисовка списка карточек
function renderCards(cards) {
    cards.forEach((el) => {
        cardsList.appendChild(renderCard(el, removeCard, likeCard, addImgPopupHandler));
    });
}

// Открывающий попап при клике по изображению карточки
function addImgPopupHandler(elem) {
    const cardPopupImg =  imgCardPopup.querySelector('.popup__image');

    cardPopupImg.src = elem.target.src;
    cardPopupImg.alt = elem.target.alt;

    showPopup(imgCardPopup);
}

renderCards(initialCards);

// Форма добавления карточки
addButton.addEventListener('click', () => {
    showPopup(newCardFormPopup);
});

popupCloseButton.addEventListener('click', () => {
    closePopup(newCardFormPopup);
});

addForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const newCard = {
        name: addForm.elements['place-name'].value,
        link: addForm.elements.link.value
    };

    const newCardNode = renderCard(newCard, removeCard, likeCard, addImgPopupHandler);
    cardsList.insertBefore(newCardNode, cardsList.children[0]);

    addForm.reset();
    closePopup(newCardFormPopup);
});

// Форма редактирования карточки
profileEditButton.addEventListener('click', () => {
    editForm.elements.name.value = profileName.innerText; 
    editForm.elements.description.value = profileDescription.innerText;
    showPopup(profileEditPopup);
});

function handleEditFormSubmit(evt) {
    evt.preventDefault();
    profileName.textContent = editForm.elements.name.value;
    profileDescription.testContent = editForm.elements.description.value
    closePopup(profileEditPopup);
}

editForm.addEventListener('submit', handleEditFormSubmit); 

