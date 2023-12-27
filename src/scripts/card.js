// Темплейт карточки
const template = document.querySelector('#card-template').content;

// Функция создания карточки
function makeCardNode(elem, userId, removeCard, likeCard, unlikeCard, addImgPopupHandler) {
    if (!userId) {
        console.error('Не получен id профиля!');
        return;
    }

    const card = template.querySelector('.card').cloneNode(true);
    const title = card.querySelector('.card__title');
    const img = card.querySelector('.card__image');
    
    title.textContent = elem.name;
    img.src = elem.link;
    img.alt = elem.name;
    img.addEventListener('click', addImgPopupHandler)
    
    const deleteBtn = card.querySelector('.card__delete-button');
    if (elem.owner?._id === userId) {
        deleteBtn.addEventListener('click', () => {
            removeCard(elem._id);
        });
    } else {
        deleteBtn.remove();
    }

    const cardLikeButton = card.querySelector('.card__like-button');
    // Если среди лайков есть пользователь, добавляем кнопке активный класс
    if (elem.likes.some((like) => like._id === userId)) {
        cardLikeButton.classList.add('card__like-button_is-active');
    }
    cardLikeButton.addEventListener('click', (evt) => {
        toggleLikeCard(evt, elem._id, likeCard, unlikeCard);
    });

    const likesCounter = card.querySelector('.card__like-counter');
    likesCounter.textContent = elem.likes.length;

    return card;
};


function toggleLikeCard(event, id, likeCard, unlikeCard) {
    console.log('card id', id);
    if (event.target.classList.contains('card__like-button_is-active')) {
        // Сначала откликаемся на action пользователя, чтобы показать, что он всё сделал правильно,
        // потом сверяемся по результатам запроса
        event.target.classList.remove('card__like-button_is-active');

        unlikeCard(id)
        .then((card) => {
            event.target.classList.remove('card__like-button_is-active');
            const likesCounter = event.target.nextElementSibling;
            likesCounter.textContent = card.likes.length;
        })
        .catch(() => event.target.classList.add('card__like-button_is-active'));
        
    } else {
        event.target.classList.add('card__like-button_is-active');

        likeCard(id)
        .then((card) => {
            event.target.classList.add('card__like-button_is-active');
            const likesCounter = event.target.nextElementSibling;
            likesCounter.textContent = card.likes.length;
        })
        .catch(() => event.target.classList.remove('card__like-button_is-active'));
    }
    
}

export { makeCardNode };

