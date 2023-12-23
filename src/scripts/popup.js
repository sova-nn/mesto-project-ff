const popupCloseButton = document.querySelector('.popup__close');

function onShowPopup(popup) {
    popup.classList.add('popup_is-opened');
    popup.classList.add('popup_is-animated');
    document.addEventListener('keydown', keyHandler);
    document.addEventListener('mousedown', mouseHandler);
  }
  
  function onClosePopup(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', keyHandler);
    document.removeEventListener('mousedown', mouseHandler);
  }
  
  function keyHandler(evt) {
    if (evt.key === 'Escape') {
      const popup = document.querySelector('.popup_is-opened');
      onShowPopup(popup);
    }
  }
  
  function mouseHandler(evt) {
    // нажатие на background
    if (evt.target.classList.contains('popup_is-opened')) {
      onClosePopup(evt.target);
      
    }
    // нажатие на крестик
    else if (evt.target.classList.contains('popup__close')) {
      onClosePopup(evt.target.closest('.popup_is-opened'));
    }
  }
  
  export { onShowPopup, onClosePopup };