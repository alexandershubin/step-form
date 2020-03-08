class Form {
  constructor(form) {
    this.isStorageSupport = true;
    this.storage = undefined;
    this.localStorage = undefined;
    this.stage = 0;

    this.els = {
      form: form,
      formBlock: form.querySelectorAll('.form__block'),
      prevButton: form.querySelector('.button-prev'),
      nextButton: form.querySelector('.button-next'),
      submitButton: form.querySelector('.submit-button'),
      name: form.querySelector('[name=name]'),
      tel: form.querySelector('[name=tel]'),
      error: form.querySelector('.errors')
    };

    this._initStorage();
    this._addListeners();
    this._showForm();
  }

  /**
   * Инициализирует localStorage
   * @private
   */
  _initStorage() {
    try {
      this.localStorage = window.localStorage;
      this.storage = this.localStorage.getItem('name');
    } catch (error) {
      console.error('Не удалось инициализировать локальное хранилище', error);
      this.isStorageSupport = false;
    }
  }

  /**
   * Добавиляет обработчики событий
   * @private
   */
  _addListeners() {
    this.els.form.addEventListener('submit', this._onSubmit.bind(this));
    this.els.nextButton.addEventListener('click', this._onNextClick.bind(this));
    this.els.prevButton.addEventListener('click', this._onPrevClick.bind(this));
  }

  /**
   * Валидация формы
   * @returns {boolean}
   * @private
   */
  _validateForm() {
    const {name, tel} = this.els;
    if (!name.value || !tel.value) {
      this._setErrors('Заполните форму');
      return false;
    }

    return true;
  }

  _setErrors(text = '') {
    this.els.error.innerHTML = text;
}

  /**
   * показывает первый шаг формы
   * @private
   */
  _showForm() {
    this.els.formBlock[this.stage].classList.add('show');
    this.els.name.focus();
    if (this.storage) {
      this.els.name.value = this.storage;
    }
  };

  /**
   * Переименовывает кнопку на последнем шаге
   * @private
   */
  _namingButton() {
    if (this.stage === (this.els.formBlock.length - 1)) {
      this.els.nextButton.classList.add('hide');
      this.els.submitButton.classList.remove('hide');
    }
  };

  /**
   * Скрывает форму
   * @private
   */
  _hideBlock() {
    this.els.formBlock[this.stage].classList.remove('show');
  };

  /**
   * Скрывает кнопку на пследнем шаге
   * @private
   */
  _removeNamingButton() {
    if (this.stage !== (this.els.formBlock.length - 1)) {
      this.els.nextButton.classList.remove('hide');
      this.els.submitButton.classList.add('hide');
    }
  };

  /**
   * Показать следующий блок
   * @private
   */
  _nextBlock() {
    this.stage = this.stage + 1;
    this.els.formBlock[this.stage].classList.add('show');
    this.els.prevButton.classList.add('show');
    this._namingButton();
  };

  /**
   * Показать предыдущий блок
   * @private
   */
  _prevBlock() {
    this.stage--;
    this.els.formBlock[this.stage].classList.add('show');

    if (this.stage === 0) {
      this.els.prevButton.classList.remove('show');
      this.els.prevButton.classList.add('hide');
    }

    this._removeNamingButton();
  };

// событие клик на кнопку next
  _onNextClick() {
    const validated = this._validateForm();
    if (!validated) {
      return;
    }

    this._hideBlock();
    this._nextBlock();
  };

// событие клик на кнопку prev
  _onPrevClick() {
    this._hideBlock();
    this._prevBlock();
  };

  _onSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.els.form);

    console.log('Данные формы:' , {
      'Имя': formData.get('name'),
      'Телефон': formData.get('tel'),
      'Страна': formData.get('country'),
      'E-Mail': formData.get('email')
    });
  }
}

const form = document.querySelector('form');
new Form(form);
