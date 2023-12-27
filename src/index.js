import './pages/index.css';

import { showPopup, closePopup } from './scripts/modal';
import { makeCardNode } from './scripts/card';

import { enableValidation } from './scripts/check-validation';
import { getUserData, getCards, editProfile, addCard, deleteCard, likeCard, unlikeCard, setAvatar } from './scripts/api';

const PATTERN_ERROR = 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';
const EMPTY_FIELD_ERROR = 'Вы пропустили это поле';
const EMPTY_LINK_ERROR = 'Введите адрес сайта';
const TOO_SHORT_FIELD_ERROR = 'Пожалуйста, введите не менее 2 знаков';
const TOO_LONG_FIELD_ERROR = 'Превышена допустимая длина строки';

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
let profileUserId = '';

// Конфиг из задания
// Хотелось обойтись без него, но он обязателен к использованию в задании
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  };

// Конфиг с текстами ошибок для форм
// Закладываюсь под возможные расширения
const formsConfig = {
    'edit-profile': {
        'edit-name': {
            patternMismatch: PATTERN_ERROR,
            valueMissing: EMPTY_FIELD_ERROR,
            tooShort: TOO_SHORT_FIELD_ERROR,
            tooLong: TOO_LONG_FIELD_ERROR
        },
        description: {
            patternMismatch: PATTERN_ERROR,
            valueMissing: EMPTY_FIELD_ERROR,
            tooShort: TOO_SHORT_FIELD_ERROR,
            tooLong: TOO_LONG_FIELD_ERROR
        }
    },
    'new-place': {
        'place-name': {
            patternMismatch: PATTERN_ERROR,
            valueMissing: EMPTY_FIELD_ERROR,
            tooShort: TOO_SHORT_FIELD_ERROR,
            tooLong: TOO_LONG_FIELD_ERROR
        },
        link: {
            patternMismatch: PATTERN_ERROR,
            valueMissing: EMPTY_LINK_ERROR,
        }
    },
    'edit-avatar': {
        avatar: {
            patternMismatch: PATTERN_ERROR,
            valueMissing: EMPTY_LINK_ERROR
        }
    }
}

// ОБЩИЙ ФУНКЦИОНАЛ

// Обновление данных профиля
function setProfile(profile) {
    profileName.textContent = profile.name;
    profileDescription.textContent = profile.about;
    profileImage.style.backgroundImage = `url(${profile.avatar})`;
    setAvatarListener();
}

// Обнуление формы
function resetForm(form) {
    form.reset();

    const inputList = Array.from(form.querySelectorAll('.popup__input'));

    inputList.forEach((input) => {
        input.nextElementSibling.textContent = '';
    });

    const popupButton = form.querySelector('.popup__button');

    popupButton.disabled = true;
    popupButton.textContent = 'Сохранить';
  }

// Отрисовка списка карточек
function renderCards(cards, userId) {
    cards.forEach((el) => {
        cardsList.appendChild(makeCardNode(el, userId, removeCardWithUpdate, likeCard, unlikeCard, addImgPopupHandler));
    });
}

// Декоратор для отрисовки нового списка карточек после удаления
// Изначально не хотелось увеличивать связность компонентов, поэтому api принципиально не импортируется в card.js
function deleteDecorator(f) {
    return function () {
        return f.apply(this, arguments).then(() => {
            getCards().then((cards) => {
                // Emptying a node https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren
                cardsList.replaceChildren(); 
                renderCards(cards, profileUserId);
            })
        });
    };
  }
  const removeCardWithUpdate = deleteDecorator(deleteCard);

// Открывающий попап при клике по изображению карточки
function addImgPopupHandler(elem) {
    const cardPopupImg =  imgCardPopup.querySelector('.popup__image');

    cardPopupImg.src = elem.target.src;
    cardPopupImg.alt = elem.target.alt;

    showPopup(imgCardPopup);
}


// РАБОТА С ФОРМАМИ

// Форма добавления карточки
addButton.addEventListener('click', () => {
    resetForm(addForm);
    showPopup(newCardFormPopup);
});

popupCloseButton.addEventListener('click', () => {
    closePopup(newCardFormPopup);
});

addForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const popupButton = addForm.querySelector('.popup__button');
    popupButton.textContent = 'Сохранение...';

    const newCard = {
        name: addForm.elements['place-name'].value,
        link: addForm.elements.link.value
    };

    addCard(newCard)
    .then(() => getCards())
    .then((cards) => renderCards(cards, profileUserId));

    closePopup(newCardFormPopup);
});



// Форма редактирования карточки
profileEditButton.addEventListener('click', () => {
    resetForm(editForm);

    editForm.elements['edit-name'].value = profileName.innerText; 
    editForm.elements.description.value = profileDescription.innerText;
    
    showPopup(profileEditPopup);
});

editForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const popupButton = editForm.querySelector('.popup__button');
    popupButton.textContent = 'Сохранение...';

    const name = editForm.elements['edit-name'].value;
    const description = editForm.elements.description.value;
    
    editProfile(name, description)
    .then(() => getUserData())
    .then((profile) => setProfile(profile)); // 

    closePopup(profileEditPopup);
}); 



// Форма редактирования аватара
function setAvatarListener() {
    profileImage.addEventListener('click', () => {
        resetForm(editAvatarForm);
        showPopup(avatarEditPopup);
    });
}
setAvatarListener();

editAvatarForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

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
enableValidation(validationConfig, formsConfig);