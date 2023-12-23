import './pages/index.css';

import { initialCards } from './scripts/cards';
import { renderCards } from './scripts/index';
import { onShowPopup, onClosePopup } from './scripts/popup';

const addButton = document.querySelector('.profile__add-button'); 
const profileEditButton = document.querySelector('.profile__edit-button');
const popupCloseButton = document.querySelector('.popup__close');
const newCardFormPopup = document.querySelector('.popup_type_new-card');
const profileEditPopup = document.querySelector('.popup_type_edit');

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const editForm = document.forms['edit-profile'];
const addForm = document.forms['new-place'];

renderCards(initialCards);

// Форма добавления карточки
addButton.addEventListener('click', () => {
    onShowPopup(newCardFormPopup);
});

popupCloseButton.addEventListener('click', () => {
    onClosePopup(newCardFormPopup);
});

addForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const newCard = {
        name: addForm.elements['place-name'].value,
        link: addForm.elements.link.value
    };
    initialCards.unshift(newCard);
    renderCards(initialCards);
    addForm.reset();
    onClosePopup(newCardFormPopup);
});

// Форма редактирования карточки
profileEditButton.addEventListener('click', () => {
    editForm.elements.name.value = profileName?.outerText; 
    editForm.elements.description.value = profileDescription?.outerText;
    onShowPopup(profileEditPopup);
});

function handleFormSubmit(evt) {
    evt.preventDefault();
    profileName.textContent = editForm.elements.name.value;
    profileDescription.testContent = editForm.elements.description.value
    onClosePopup(profileEditPopup);
}

editForm.addEventListener('submit', handleFormSubmit); 

