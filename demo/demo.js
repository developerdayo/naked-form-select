function ready() {
  nakedFormSelect('select.normal');
  nakedFormSelect('select.keyword-search', {
    keywordSearch: {
      on: true,
      placeholder: 'Enter keyword'
    }
  });
  function postResults() {
    const $submitBtn = document.getElementById('submitForm');
    const $formResults = document.getElementById('formResults');

    const select1 = document.querySelector('[name="select1"]');
    const select2 = document.querySelector('[name="select2"]');
    const select3 = document.querySelector('[name="select3"]');

    $submitBtn.addEventListener('click', (event) => {
      $formResults.innerHTML = '';
      let results = [];

      event.preventDefault();

      Array.from(select1.selectedOptions).forEach((option) => { results.push(option.value) })
      Array.from(select2.selectedOptions).forEach((option) => { results.push(option.value) })
      Array.from(select3.selectedOptions).forEach((option) => { results.push(option.value) })

      results.forEach((selectedOptionsSet) => {
        let $container = document.createElement('div');
        $container.classList.add('result');

        $container.appendChild(document.createTextNode(selectedOptionsSet));
        $formResults.appendChild($container);
      })

    })
  }
  postResults();
}

if (document.readyState !== 'loading') {
  ready()
} else {
  document.addEventListener('DOMContentLoaded', ready)
}