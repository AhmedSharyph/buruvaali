/* Buruvaali JS */
(function(){
  function Buruvaali(el){
    this.el = el;
    this.select = el.querySelector('.buruvaali-select');
    this.dropdown = el.querySelector('.buruvaali-dropdown');
    this.search = el.querySelector('.buruvaali-search');
    this.allowAdd = el.dataset.allowAdd === "true";
    this.selected = [];

    this.options = Array.from(this.select.options)
                        .map(o => o.textContent)
                        .filter(o => o);

    this.dropdown.style.display = 'none';
    this.renderDropdown();
    this.addEvents();
  }

  Buruvaali.prototype.renderDropdown = function(filter){
    const dropdown = this.dropdown;
    dropdown.innerHTML = '';
    let items = this.options.filter(opt => !filter || opt.toLowerCase().includes(filter.toLowerCase()));

    if(items.length === 0){
      const div = document.createElement('div');
      div.className = 'buruvaali-option no-options';
      div.textContent = 'No options found';
      dropdown.appendChild(div);
    } else {
      items.forEach(opt => {
        const div = document.createElement('div');
        div.className = 'buruvaali-option';
        if(this.selected.includes(opt)) div.classList.add('active');
        div.textContent = opt;
        div.addEventListener('click', () => this.selectOption(opt));
        dropdown.appendChild(div);
      });
    }
  }

  Buruvaali.prototype.addEvents = function(){
    const self = this;
    this.search.addEventListener('focus', function(){
      self.dropdown.style.display = 'block';
      self.renderDropdown(this.value);
    });
    this.search.addEventListener('input', function(){
      self.dropdown.style.display = 'block';
      self.renderDropdown(this.value);
    });
    this.search.addEventListener('keydown', function(e){
      if(e.key==='Enter' && self.allowAdd && this.value.trim()){
        const val = this.value.trim();
        if(!self.options.includes(val)){
          self.options.push(val);
          const opt = document.createElement('option');
          opt.textContent = val;
          self.select.appendChild(opt);
        }
        self.selectOption(val);
        this.value = '';
        e.preventDefault();
      }
    });
    document.addEventListener('click', function(e){
      if(!self.el.contains(e.target)){
        self.dropdown.style.display = 'none';
      }
    });
  }

  Buruvaali.prototype.selectOption = function(opt){
    if(!this.selected.includes(opt)){
      this.selected.push(opt);
      const selectOpt = Array.from(this.select.options).find(o=>o.textContent===opt);
      if(selectOpt) selectOpt.selected = true;

      const tag = document.createElement('div');
      tag.className = 'buruvaali-tag';
      tag.textContent = opt;

      const remove = document.createElement('span');
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        this.el.querySelector('.buruvaali-selection').removeChild(tag);
        this.selected = this.selected.filter(v => v!==opt);
        if(selectOpt) selectOpt.selected=false;
      });

      tag.appendChild(remove);
      this.el.querySelector('.buruvaali-selection').insertBefore(tag,this.search);
    }
    this.search.value='';
    this.dropdown.style.display='none';
  }

  window.Buruvaali = Buruvaali;
})();
