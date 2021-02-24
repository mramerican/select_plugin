const getTemplate = (data = [], placeholder, selectedId) => {
    let text = placeholder ?? 'Задайте placeholder по умолчанию';
    const items = data.map(item => {
        let classes = '';
        if (item.id === selectedId) {
            text = item.value;
            classes = 'selected';
        }
        return `
            <li 
              class="select__item ${classes}" 
              data-type="item" 
              data-id="${item.id}">
                ${item.value}
            </li>`
    })
    return `
          <div class="select__backdrop" data-type="backdrop"></div>
          <div class="select__input" data-type="input">
            <span data-type="placeholder">${text}</span>
            <i class="fa fa-chevron-down" data-type="arrow"></i>
          </div>
          <div class="select__dropdown">
            <ul class="select__list">
              ${items.join('')}
            </ul>
          </div>`;
}

export class Select {
    constructor(selector, options) {
        this.$el = document.querySelector(selector);
        this.options = options;
        this.selectedId = options.selectedId;

        this.#render();
        this.#setup();
    }

    #render() {
        const { placeholder, data } = this.options;
        this.$el.classList.add('select');
        this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId)
    }

    #setup() {
        this.clickHandler = this.clickHandler.bind(this);
        this.$el.addEventListener('click', this.clickHandler);
        this.$arrow = this.$el.querySelector('[data-type="arrow"]');
        this.$placeholder = this.$el.querySelector('[data-type="placeholder"]');
    }

    clickHandler(event) {
        const { type, id } = event.target.dataset;
        switch (type) {
            case 'input':
            case 'arrow':
            case 'placeholder':
                this.toggle();
                break;
            case 'item': this.select(id); break;
            case 'backdrop': this.close(id); break;
        }
    }

    get isOpen() {
        return this.$el.classList.contains('open');
    }

    get current() {
        return this.options.data.find(item => item.id === this.selectedId);
    }

    select(id) {
        this.selectedId = id;
        this.$placeholder.textContent = this.current.value;

        this.$el.querySelectorAll('[data-type="item"]').forEach(item => item.classList.remove('selected'))
        this.$el.querySelector(`[data-id="${this.selectedId}"]`).classList.add('selected');

        this.options.onSelect ? this.options.onSelect(this.current) : '';

        this.close();
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.$el.classList.add('open');
        this.$arrow.classList.remove('fa-chevron-down');
        this.$arrow.classList.add('fa-chevron-up');
    }

    close() {
        this.$el.classList.remove('open');
        this.$arrow.classList.add('fa-chevron-down');
        this.$arrow.classList.remove('fa-chevron-up');
    }

    destroy() {
        this.$el.removeEventListener('click', this.clickHandler);
        this.$el.innerHTML = '';
    }
}
