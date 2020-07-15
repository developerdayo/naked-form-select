const examples = () => {
  // context example
  nakedFormSelect('select', {
      context: {
          value: '.demos--context',
          queryDocument: true
      }
  });

  // events example
  const closeDropdown = () => {
      alert('dropdown closed');
  }

  const openDropdown = () => {
      alert('dropdown opened');
  }

  nakedFormSelect('.demos--events select', {
      events: {
          open: openDropdown,
          close: closeDropdown
      }
  });

  // keyword search example
  nakedFormSelect('.demos--keyword-search select', {
      keywordSearch: {
          on: true,
          placeholder: 'Type in some characters to filter this list'
      }
  });

  // regular select
  nakedFormSelect('.demos--regular-select select');

  // settings example
  nakedFormSelect('.demos--settings select', {
      settings: {
          dropupThreshold: 300
      }
  });

  // submit buttin example
  nakedFormSelect('.demos--submit-button select', {
      submitBtn: {
          on: true,
          text: 'fire!'
      }
  });
}

const postResults = () => {
  const submitBtn = document.getElementById('submitForm');
  const formResults = document.getElementById('formResults');
  const selects = [...document.querySelectorAll('select')];

  submitBtn.addEventListener('click', (e) => {
      formResults.innerHTML = '';
      let results = [];

      e.preventDefault();

      selects.forEach(select => {

          Array.from(select.selectedOptions).forEach(option => {
              results.push(`${select.name}: ${option.value}`)
          })
      })

      results.forEach((selectedOptionsSet) => {
          let container = document.createElement('div');
          container.classList.add('result');

          container.appendChild(document.createTextNode(selectedOptionsSet));
          formResults.appendChild(container);
      })

  })

  selects.forEach((select, i) => {
      let changeContainer = document.createElement('div');
      changeContainer.classList.add('changed');

      select.addEventListener('change', event => {
          formResults.appendChild(changeContainer);

          changeContainer.appendChild(document.createTextNode(`select ${i + 1} changed!`));
      })
  })
}

const goToLink = (item) => {

  const sections = [...document.querySelectorAll('main > section')];

  item.addEventListener('click', (e) => {

      e.preventDefault();

      // get selected category identifier
      let category = item.getAttribute('href').split('--')[0];
      category = category.split('#')[1];

      // get selected target href
      let href = e.target.getAttribute('href');
      let targetLink = href.split('#')[1];
      targetLink = document.querySelector(`[name="${targetLink}"]`);

      // toggle (hide/show) between menu sections
      sections.forEach(section => {
          if (section.classList.contains(category)) {

              // show

              section.style.display = 'block';

              setTimeout(() => {

                  section.style.opacity = 1;

              }, 195);

          } else {

              // hide

              section.style.opacity = 0;

              setTimeout(() => {
                  section.style.display = 'none';
              }, 195);

          }
      })

      // scroll to selected section
      if (targetLink) {
          setTimeout(() => {
              window.scrollTo({
                  top: targetLink.offsetTop,
                  behavior: 'smooth'
              })
          }, 250);

          // set href properly
          setTimeout(() => {
              window.location.href = href;
          }, 500);
      }
  })
}

const menu = () => {
  const menu = document.querySelector('nav');
  const menuItem = [...menu.querySelectorAll('a')];

  menuItem.forEach(item => {
      goToLink(item);
  })

  document.querySelectorAll('main a').forEach(item => {
      goToLink(item);
  })
}

const ready = () => {

  examples();

  postResults();

  menu();

}

if (document.readyState !== 'loading') {
  ready()
} else {
  document.addEventListener('DOMContentLoaded', ready)
}