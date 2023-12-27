function showPopup(popup) {
    popup.classList.add('popup_is-opened');
    popup.classList.add('popup_is-animated');
    document.addEventListener('keydown', keyHandler);
    popup.addEventListener('mousedown', mouseHandler);
  }
  
  function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
    popup.removeEventListener('keydown', keyHandler);
    popup.removeEventListener('mousedown', mouseHandler);
  }
  
  function keyHandler(evt) {
    if (evt.key === 'Escape') {
      const popup = document.querySelector('.popup_is-opened');
      showPopup(popup);
    }
  }
  
  function mouseHandler(evt) {
    if (evt.target.classList.contains('popup_is-opened') || evt.target.classList.contains('popup__close')) {
      closePopup(evt.currentTarget);
    }
  }
  
  export { showPopup, closePopup };