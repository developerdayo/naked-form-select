function nakedFormSelect(target = 'select', userOptions = {
  typeAhead: false
}) {
  if (document.querySelector(target)) {
    const $targetSelector = target;
    const targetSelectorID = `[data-naked-select-id='${$targetSelector}']`;
    let options = userOptions;
    const build = {
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
          $container.appendChild(selectElement);
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
      toggle: function () {
        document.querySelectorAll(`${targetSelectorID}[data-naked-select] .toggle-dropdown`).forEach(function (btnElement, index) {
          let $selectContainer = document.querySelector(`${targetSelectorID}[data-naked-select='${index}']`);
          let $listContainer = document.querySelector(`${targetSelectorID}[data-naked-select='${index}'] .options-wrap`); // get list container's initial height to create slide toggle effect with css' help

          let listHeight = $listContainer.scrollHeight;
          $listContainer.style.height = '0'; // the slide toggle click event

          let $btnToggle = btnElement;
          $btnToggle.addEventListener('click', () => {
            if ($selectContainer.classList.contains('open')) {
              $selectContainer.classList.remove('open');
              $listContainer.style.height = '0';
            } else {
              $selectContainer.classList.add('open');
              $listContainer.style.height = listHeight;
            }
          }); // close all dropdowns when clicked outside of select

          document.querySelector('body').addEventListener('click', function (element) {
            if (document.querySelector(`[data-naked-select='${index}']`).classList.contains('open') && !element.target.classList.contains('options-wrap') && !element.target.classList.contains('toggle-dropdown') && element.target.parentNode.getAttribute('data-naked-select-list') === null) {
              document.querySelectorAll(`[data-naked-select='${index}']`).forEach(select => {
                select.classList.remove('open');
              });
              document.querySelectorAll(`[data-naked-select='${index}'] .options-wrap`).forEach(listContainer => {
                listContainer.style.height = '0';
              });
            }
          });
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
      }
    };
    build.lists();
    build.currentState();
    interactive.toggle();
    interactive.select();
  }
}

function ready() {
  nakedFormSelect('select.normal');
  nakedFormSelect('select.typeahead', {
    typeAhead: true
  });
}

if (document.readyState !== 'loading') {
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready);
}