function addValidation(form, config) {
    // Коллекция инпутов данной формы
    const inputList = Array.from(form.querySelectorAll(config.inputSelector));
    const submitButton = form.querySelector(config.submitButtonSelector);

    inputList.forEach((input) => {
        input.addEventListener('input', () => {
          const isInputValid = validateInput(input, config);
          toggleFormSubmitButton(inputList, submitButton, !isInputValid);
        })
    });
}

function validateInput(input, config) {
  if (input.validity.patternMismatch) { 
     input.setCustomValidity(input.dataset.error);    
   }
   else {
      input.setCustomValidity('');
   }

   if (input.validity.valid) {
       hideError(input, config);
       return true;
   }

   showError(input, config);
   return false;
}

function showError(inputElement, config) {
  const errorElement = inputElement.nextElementSibling;

  errorElement.textContent = inputElement.dataset.error;
  errorElement.classList.add(config.errorClass);
}

function hideError(inputElement, config) {
  const errorElement = inputElement.nextElementSibling;

  errorElement.textContent = '';
  errorElement.classList.remove(config.errorClass);
}

function toggleFormSubmitButton(inputList, buttonElement, setInactive = false) {
    if (setInactive || inputList.some((input) => !input.validity.valid)) {
      disableSubmitButton(buttonElement);
    } else {
      enableSubmitButton(buttonElement);
    }
  }
  
  function disableSubmitButton(buttonElement) {
    buttonElement.setAttribute('disabled', true);
  }
  
  function enableSubmitButton(buttonElement) {
    buttonElement.removeAttribute('disabled');
  }

  export function enableValidation(config) {
    const forms = document.querySelectorAll(config.formSelector);

    forms.forEach((form) => {
        addValidation(form, config);
    });
  }

  export function clearValidation(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const submitButton = formElement.querySelector(config.submitButtonSelector);
  
    inputList.forEach(inputElement => {
      hideError(inputElement, config);
    })
  
    toggleFormSubmitButton(inputList, submitButton);
    submitButton.textContent = 'Сохранить';
  }