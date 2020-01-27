function ready() {
  nakedFormSelect('.example-1');
  nakedFormSelect('.example-3', {
    settings: {
      dropupThreshold: 100
    },
    keywordSearch: {
      on: true,
    }
  });
  nakedFormSelect('.example-4', {
    context: {
      value: '.section-with-context',
      queryDocument: true
    }
  });
  function postResults() {
    const $submitBtn = document.getElementById('submitForm');
    const $formResults = document.getElementById('formResults');

    const select1 = document.querySelector('[name="select1"]');
    const select2 = document.querySelector('[name="select2"]');
    const select3 = document.querySelector('[name="select3"]');
    const select4 = document.querySelector('[name="select4"]');
    const select5 = document.querySelector('[name="select5"]');

    $submitBtn.addEventListener('click', (event) => {
      $formResults.innerHTML = '';
      let results = [];

      event.preventDefault();

      Array.from(select1.selectedOptions).forEach((option) => { results.push(option.value) })
      Array.from(select2.selectedOptions).forEach((option) => { results.push(option.value) })
      Array.from(select3.selectedOptions).forEach((option) => { results.push(option.value) })
      Array.from(select4.selectedOptions).forEach((option) => { results.push(option.value) })
      Array.from(select5.selectedOptions).forEach((option) => { results.push(option.value) })

      results.forEach((selectedOptionsSet) => {
        let $container = document.createElement('div');
        $container.classList.add('result');

        $container.appendChild(document.createTextNode(selectedOptionsSet));
        $formResults.appendChild($container);
      })

    })
    document.querySelectorAll('select').forEach(($select, i) => {
      let $changeContainer = document.createElement('div');
      $changeContainer.classList.add('changed');

      $select.addEventListener('change', event => {
        $formResults.appendChild($changeContainer);

        $changeContainer.appendChild(document.createTextNode(`select ${i + 1} changed!`));
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