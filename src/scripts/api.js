const URL = 'https://mesto.nomoreparties.co';
const TOKEN = 'b2928e6a-c2c9-4a30-915d-2dde8c76b066';
const GROUP_ID = 'cohort-magistr-2';
const BASE_URL = `${URL}/v1/${GROUP_ID}`;

const config = {
    baseUrl: BASE_URL,
    headers: {
      authorization: TOKEN,
      'Content-Type': 'application/json'
    }
  }

function getUserData() {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
      }).then(res => handleResponse(res));
}

function getCards() {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
      }).then(res => handleResponse(res));
}

function editProfile(name, about) {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
          name,
          about
        })
      }).then(res => handleResponse(res));
}

function addCard({name, link}) {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
          name,
          link
        })
      }).then(res => handleResponse(res));
}

function deleteCard(cardId) {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
      }).then(res => handleResponse(res));
}

function likeCard(cardId) {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'PUT',
        headers: config.headers
      }).then(res => handleResponse(res));
}

function unlikeCard(cardId) {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
      }).then(res => handleResponse(res));
}

function setAvatar(avatar) {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar
          })
      }).then(res => handleResponse(res));
}

 function handleResponse(res) {
    if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`); 
 }

export { getUserData, getCards, editProfile, addCard, deleteCard, likeCard, unlikeCard, setAvatar }