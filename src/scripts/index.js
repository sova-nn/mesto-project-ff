import { onShowPopup, onClosePopup } from './popup';

const imgCardPopup = document.querySelector('.popup_type_image');

// @todo: Темплейт карточки
const template = document.querySelector('#card-template').content;

// @todo: DOM узлы
const cardsList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function makeCardNode(elem, removeCard, likeCard, addImgPopupHandler) {
    const card = template.querySelector('.card').cloneNode(true);
    const title = card.querySelector('.card__title');
    const img = card.querySelector('.card__image');
    
    title.textContent = elem.name;
    img.src = elem.link;
    img.alt = elem.name;
    img.addEventListener('click', addImgPopupHandler)
    
    const deleteBtn = card.querySelector('.card__delete-button');
    deleteBtn.addEventListener('click', removeCard);

    const cardLikeButton = card.querySelector('.card__like-button');
    cardLikeButton.addEventListener('click', likeCard);

    return card;
};

// @todo: Функция удаления карточки
function removeCard(event) {
    event.target.closest('.card').remove();
  };

// @todo: Вывести карточки на страницу
function addListTemplate(cards) {
    cards.forEach((el) => {
        cardsList.appendChild(makeCardNode(el, removeCard, likeCard, addImgPopupHandler));
    });
}

function addImgPopupHandler(elem) {
    const imgCardPopup_img =  imgCardPopup.querySelector('.popup__image');

    imgCardPopup_img.src = elem.target.src;
    imgCardPopup_img.alt = elem.target.alt;

    onShowPopup(imgCardPopup);
}

function likeCard(event) {
    event.target.classList.add('card__like-button_is-active');
}

export { addListTemplate as renderCards };

