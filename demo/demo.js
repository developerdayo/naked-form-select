function ready() {
  nakedFormSelect('select.normal');
  nakedFormSelect('select.keyword-search', {
    keywordSearch: {
      on: true,
      placeholder: 'Enter keyword'
    }
  });
}

if (document.readyState !== 'loading') {
  ready()
} else {
  document.addEventListener('DOMContentLoaded', ready)
}