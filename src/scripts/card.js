// Темплейт карточки
const template = document.querySelector('#card-template').content;

// Функция создания карточки
function makeCardNode(elem, userId, deleteCard, likeCard, addImgPopupHandler) {
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
            deleteCard(card, elem._id);
        });
    } else {
        deleteBtn.remove();
    }

    const cardLikeButton = card.querySelector('.card__like-button');
    // Если среди лайков есть пользователь, добавляем кнопке активный класс
    if (elem.likes.some((like) => like._id === userId)) {
        cardLikeButton.classList.add('card__like-button_is-active');
    }
    cardLikeButton.addEventListener('click', (event) => {
        likeCard(event, elem._id);
    });

    const likesCounter = card.querySelector('.card__like-counter');
    likesCounter.textContent = elem.likes.length;

    return card;
};

// Я думала, что сохранялось предыдущее правило экспорта из этого файла только одного метода makeCardNode
// Теперь понятно, что количество экспортов можно увеличить.
function likeCard(event, likeCount) {
    event.target.classList.toggle('card__like-button_is-active')
    const likesCounter = event.target.nextElementSibling; 
    likesCounter.textContent = likeCount; 
}

function removeCard(card) {
    card.remove();
}

export { makeCardNode, likeCard, removeCard };

