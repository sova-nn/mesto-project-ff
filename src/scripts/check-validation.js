export function addValidation(form, config) {
    // Коллекция инпутов данной формы
    const inputList = Array.from(form.querySelectorAll('.popup__input'));
    const submitButton = form.querySelector('.popup__button');

    inputList.forEach((input) => {
        input.addEventListener('input', () => {
            // Навешиваем валидаторы на инпут, исходя из конфига
            const validations = Object.keys(config[input.name]);

            // Одновременно показываем только одну ошибку для поля
            let error = '';

            validations.forEach((validation) => {
                if (input.validity[validation]) {
                    error = config[input.name][validation] ?? 'Ошибка';
                    return;
                } 
            });
            
            input.nextElementSibling.textContent = error;
            toggleFormSubmitButton(inputList, submitButton, !!error);
        })
    });
}

function toggleFormSubmitButton(inputList, buttonElement, setInactive = false) {
    // Доп флаг для того, чтобы не обходить коллекцию и уменьшить затраты на обход
    if (setInactive) {
        disableSubmitButton(buttonElement);
        return;
    }

    if (inputList.some((input) => !input.validity.valid)) {
      disableSubmitButton(buttonElement)
    } else {
      enableSubmitButton(buttonElement)
    }
  }
  
  function disableSubmitButton(buttonElement) {
    buttonElement.setAttribute('disabled', 'disabled');
  }
  
  function enableSubmitButton(buttonElement) {
      buttonElement.removeAttribute('disabled');
  }

  export function enableValidation(validationConfig, formsConfig) {
    const forms = document.querySelectorAll(validationConfig.formSelector);

    forms.forEach((form) => {
        addValidation(form, formsConfig[form.name]);
    });
  }