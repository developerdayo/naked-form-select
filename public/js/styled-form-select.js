function nakedFormSelect(target = 'select', userOptions = {
  keywordSearch: {
    on: false,
    placeholder: undefined
  }
}) {
  if (document.querySelector(target)) {
    const $targetSelector = target;
    const targetSelectorID = `[data-naked-select-id='${$targetSelector}']`;
    const build = {
      keywordSearchInput: function () {
        let $searchContainer = document.createElement('div');
        $searchContainer.classList.add('keyword-search-wrap');
        let $input = document.createElement('input');

        if (userOptions.keywordSearch.placeholder !== undefined) {
          $input.setAttribute('placeholder', userOptions.keywordSearch.placeholder);
        }

        let $btn = document.createElement('button');
        $searchContainer.appendChild($input);
        $searchContainer.appendChild($btn);
        return $searchContainer;
      },
      lists: function () {
        document.querySelectorAll($targetSelector).forEach(function (selectElement, index) {
          // get an array of the options
          let options = Array.from(selectElement.childNodes).filter(option => option.nodeName === 'OPTION');
          let optionsTextArr = [];
          options.forEach(option => {
            optionsTextArr.push(option.outerText);
          }); // create placeholder text

          let placeholderText = options[0].outerText;
          let $placeholderContainer = document.createElement('span');
          $placeholderContainer.classList.add('placeholder');
          $placeholderContainer.appendChild(document.createTextNode(placeholderText)); // create unordered list with the options text

          let $listContainer = document.createElement('div');
          $listContainer.classList.add('options-wrap');
          let $list = document.createElement('ul');
          $list.setAttribute('data-naked-select-list', index); // remove the first item from options array because its the placeholder text

          optionsTextArr.forEach((listItem, index) => {
            let item = document.createElement('li');
            item.setAttribute('data-index', index);
            item.appendChild(document.createTextNode(listItem));
            $list.appendChild(item);
          });
          $listContainer.appendChild($list); // create and add the entirely new markup that will be styled containing select options

          let $container = document.createElement('div');
          $container.classList.add('naked-form-select-wrap');
          $container.setAttribute('data-naked-select', index);
          $container.setAttribute('data-naked-select-id', $targetSelector);
          let $btnToggle = document.createElement('button');
          $btnToggle.classList.add('toggle-dropdown');
          $btnToggle.appendChild(document.createTextNode('Open to Select Options'));
          $container.appendChild($placeholderContainer);
          $container.appendChild($btnToggle);
          $container.appendChild($listContainer);
          selectElement.parentNode.insertBefore($container, selectElement);
          $container.appendChild(selectElement); // add predict search markup if this option is turned on

          if (userOptions.keywordSearch.on === true) {
            let $searchContainer = build.keywordSearchInput();
            $list.insertAdjacentElement('beforebegin', $searchContainer);
          }
        });
      },
      currentState: function () {
        document.querySelectorAll(`${targetSelectorID}[data-naked-select] select`).forEach((select, index) => {
          let $placeholderContainer = document.querySelector(`${targetSelectorID}[data-naked-select='${index}'] .placeholder`);

          if (select.multiple) {
            // update placeholder text for multiple select
            let selectedOptionsArr = Array.from(select.options).filter(option => option.selected === true);
            let placeholderArr = [];
            selectedOptionsArr.forEach(option => {
              placeholderArr.push(option.innerText);
            });
            $placeholderContainer.textContent = placeholderArr.join(', '); // if there is nothing selected, set it to the first option

            if (select.options.selectedIndex === -1) {
              $placeholderContainer.textContent = select.options[0].outerText;
            }
          } else {
            let selectedIndex = select.options.selectedIndex;
            $placeholderContainer.textContent = select.options[selectedIndex].outerText;
          }
        });
      }
    };
    const interactive = {
      globalClose: function () {
        // close all dropdowns when clicked outside of select
        document.querySelector('body').addEventListener('click', function (element) {
          document.querySelectorAll(`[data-naked-select]`).forEach((select, index) => {
            if (select.classList.contains('open') && !element.target.classList.contains('options-wrap') && !element.target.classList.contains('toggle-dropdown') && element.target.parentNode.getAttribute('data-naked-select-list') === null && !element.target.parentNode.classList.contains('keyword-search-wrap')) {
              document.querySelectorAll(`[data-naked-select]`).forEach(select => {
                select.classList.remove('open');
              });
              document.querySelectorAll(`[data-naked-select] .options-wrap`).forEach(listContainer => {
                listContainer.style.height = '0';
              });
            }
          });
        });
      },
      toggle: function () {
        document.querySelectorAll(`${targetSelectorID}[data-naked-select] .toggle-dropdown`).forEach(function (btnElement, index) {
          let $selectContainer = document.querySelector(`${targetSelectorID}[data-naked-select='${index}']`);
          let $listContainer = document.querySelector(`${targetSelectorID}[data-naked-select='${index}'] .options-wrap`); // get list container's initial height to create slide toggle effect with css' help

          $listContainer.style.height = '0'; // the slide toggle click event

          let $btnToggle = btnElement;
          $btnToggle.addEventListener('click', () => {
            let listHeight = $listContainer.scrollHeight;

            if ($selectContainer.classList.contains('open')) {
              $selectContainer.classList.remove('open');
              $listContainer.style.height = '0';
            } else {
              $selectContainer.classList.add('open');
              $listContainer.style.height = listHeight;
            }
          });
          interactive.globalClose();
        });
      },
      select: function () {
        let listValueArr = [];
        document.querySelectorAll(`${targetSelectorID}[data-naked-select] li`).forEach((listItem, index) => {
          listItem.addEventListener('click', () => {
            let listItemIndex = listItem.getAttribute('data-index');
            let listItemValue = listItem.textContent;
            let selectContainerIndex = listItem.parentNode.getAttribute('data-naked-select-list');
            let $select = document.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] select`); // update the select value

            $select[0].value = listItemValue;
            $select.options[parseInt(listItemIndex)].selected = true;
            let $placeholderContainer = document.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] .placeholder`); // handle multiple select

            if ($select.multiple) {
              // toggle selected class
              if (listItem.classList.contains('selected')) {
                listItem.classList.remove('selected');
                $select.options[parseInt(listItemIndex)].selected = false;
              } else {
                listItem.classList.add('selected');
              } // update placeholder text


              let selectedOptionsArr = Array.from($select.options).filter(option => option.selected === true);
              let placeholderArr = [];
              selectedOptionsArr.forEach(option => {
                placeholderArr.push(option.innerText);
              });
              $placeholderContainer.textContent = placeholderArr.join(', ');
            } else {
              // handle single select
              let $selectContainer = document.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}']`);
              let $listContainer = document.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] .options-wrap`);

              if ($selectContainer.classList.contains('open')) {
                $selectContainer.classList.remove('open');
                $listContainer.style.height = '0';
              } else {
                $selectContainer.classList.add('open');
                $listContainer.style.height = listHeight;
              } // toggle selected class


              document.querySelectorAll(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] li`).forEach(li => {
                li.classList.remove('selected');
              });
              listItem.classList.contains('selected') ? listItem.classList.remove('selected') : listItem.classList.add('selected'); // update the placeholder text

              $placeholderContainer.textContent = listItemValue;
            }
          });
        });
      },
      keywordSearch: function () {
        if (userOptions.keywordSearch.on === true) {
          document.querySelectorAll($targetSelector).forEach(function (selectElement, index) {
            // get an array of the options
            let optionsTextArr = [];
            let options = Array.from(selectElement.childNodes).filter(option => option.nodeName === 'OPTION');
            options.forEach(option => {
              optionsTextArr.push(option.outerText);
            }); // create event to compare the entered value and filter the array of select options by matching substring

            let $input = selectElement.previousElementSibling.childNodes[0].childNodes[0];
            let $list = selectElement.previousElementSibling.childNodes[1];
            $input.addEventListener('input', e => {
              $list.innerHTML = '';
              let enteredValue = e.target.value.toLowerCase();
              let filteredResultsArr = optionsTextArr.filter(function (option) {
                let lowercase = option.toLowerCase();

                if (lowercase.match(enteredValue)) {
                  return option;
                }
              });
              filteredResultsArr.forEach((item, index) => {
                let $listItem = document.createElement('li');
                $listItem.setAttribute('data-index', index);
                $listItem.appendChild(document.createTextNode(item));
                $list.appendChild($listItem);
              });
              interactive.select(); // update options-wrap height

              let listHeight = $list.offsetHeight;
              let keywordSearchHeight = document.querySelector(`${targetSelectorID}[data-naked-select='${index}'] .keyword-search-wrap`).offsetHeight;
              document.querySelector(`${targetSelectorID}[data-naked-select='${index}'] .options-wrap`).style.height = listHeight + keywordSearchHeight;
            });
          });
        }
      }
    };
    build.lists();
    build.currentState();
    interactive.toggle();
    interactive.select();
    interactive.keywordSearch();
  }
}

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
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready);
}