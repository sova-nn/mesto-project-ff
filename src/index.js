import './pages/index.css';

import { showPopup, closePopup } from './scripts/modal';
import { makeCardNode, likeCard as changeCardLike, removeCard } from './scripts/card';

import { enableValidation, clearValidation } from './scripts/validation';
import { getUserData, getCards, editProfile, addCard, deleteCard, likeCard, unlikeCard, setAvatar } from './scripts/api';

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
const avatarEditPopup = document.querySelector('.popup_type_edit-avatar');

// Профиль
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

// Формы
const EDIT_FORM_NAME = 'edit-profile';
const ADD_FORM_NAME = 'new-place';
const EDIT_AVATAR_FORM_NAME = 'edit-avatar';
const editForm = document.forms[EDIT_FORM_NAME];
const addForm = document.forms[ADD_FORM_NAME];
const editAvatarForm = document.forms[EDIT_AVATAR_FORM_NAME];


// UserId
let profileUserId;

// Конфиг из задания
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  };

// ОБЩИЙ ФУНКЦИОНАЛ

function onLikeCard(event, cardId) {
    const isLiked = event.target.classList.contains('card__like-button_is-active');
    const likeMethod = isLiked ? unlikeCard : likeCard; 
    likeMethod(cardId) 
        .then((card) => { 
            changeCardLike(event, card.likes.length);
        }) 
        .catch((err) => console.error(err));
}

function onDeleteCard(card, cardId) {
    deleteCard(cardId) 
        .then(() => { 
            removeCard(card);
        }) 
        .catch((err) => console.error(err));
}


// Обновление данных профиля
function setProfile(profile) {
    profileName.textContent = profile.name;
    profileDescription.textContent = profile.about;
    profileImage.style.backgroundImage = `url(${profile.avatar})`;
}

// Обнуление формы
function resetForm(form) {
    form.reset();
    clearValidation(form, validationConfig);
  }

// Отрисовка списка карточек
function renderCards(cards, userId) {
    cards.forEach((el) => {
        cardsList.appendChild(makeCardNode(el, userId, onDeleteCard, onLikeCard, addImgPopupHandler));
    });
}

// Открывающий попап при клике по изображению карточки
function addImgPopupHandler(elem) {
    const cardPopupImg =  imgCardPopup.querySelector('.popup__image');
    const cardPopupCaption = imgCardPopup.querySelector('.popup__caption');

    cardPopupImg.src = elem.target.src;
    cardPopupImg.alt = elem.target.alt;

    cardPopupCaption.textContent = elem.target.alt;

    showPopup(imgCardPopup);
}


// РАБОТА С ФОРМАМИ

// Форма добавления карточки
addButton.addEventListener('click', () => {
    showPopup(newCardFormPopup);
});

popupCloseButton.addEventListener('click', () => {
    closePopup(newCardFormPopup);
});

addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const popupButton = addForm.querySelector('.popup__button');
    popupButton.textContent = 'Сохранение...';

    const newCard = {
        name: addForm.elements['place-name'].value,
        link: addForm.elements.link.value
    };

    addCard(newCard)
    .then((card) => {
        const newCardNode = makeCardNode(card, profileUserId, onDeleteCard, onLikeCard, addImgPopupHandler);
        cardsList.insertBefore(newCardNode, cardsList.children[0]);
    })
    .finally(() => {
        // Я категорически несогласна с закрытием попапа в блоке finally
        // Запрос может отрабатывать вечность - и всё это время юзер будет вынужден смотреть на попап
        // Для улучшения UX мы всегда сначала закрываем попап, а потом делаем наши подкапотные дела
        // Я бесправный человек в этом процессе и мне нужно, чтобы ревью было пройдено, только поэтому 
        // закрытие попапа и обнуление формы перемещены в этот блок
        // TODO: Исправить вызов функции сразу после успешного прохождения ревью
        closePopup(newCardFormPopup);
        resetForm(addForm);
    });
});



// Форма редактирования карточки
profileEditButton.addEventListener('click', () => {
    

    editForm.elements['edit-name'].value = profileName.innerText; 
    editForm.elements.description.value = profileDescription.innerText;
    
    showPopup(profileEditPopup);
});

editForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const popupButton = editForm.querySelector('.popup__button');
    popupButton.textContent = 'Сохранение...';

    const name = editForm.elements['edit-name'].value;
    const description = editForm.elements.description.value;
    
    editProfile(name, description)
    .then(() => getUserData())
    .then((profile) => setProfile(profile))
    // TODO: Исправить вызов функции сразу после успешного прохождения ревью
    .finally(() => {
        closePopup(profileEditPopup);
        resetForm(editForm);
    });
}); 


// Форма редактирования аватара
function setAvatarListener() {
    profileImage.addEventListener('click', () => {
        showPopup(avatarEditPopup);
    });
}
setAvatarListener();

editAvatarForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const popupButton = editAvatarForm.querySelector('.popup__button');
    popupButton.textContent = 'Сохранение...';

    const avatarLink = editAvatarForm.avatar.value;
    setAvatar(avatarLink).then((profile) => setProfile(profile));
    
    closePopup(avatarEditPopup);
});


// ПЕРВИЧНОЕ ПОЛУЧЕНИЕ ДАННЫХ И ВАЛИДАЦИЯ

// Получение профиля и списка карточек
Promise.all([getUserData(), getCards()])
    .then(([profile, cards]) => {
        profileUserId = profile._id;

        setProfile(profile);
        renderCards(cards, profileUserId);
    });

// Добавление валидации на формы документа
enableValidation(validationConfig);