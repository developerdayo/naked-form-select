/* Naked Form Select v1.0.13 (https://github.com/developerdayo/naked-form-select)
 * Copyright 2019-2020 Sarah Ferguson
 * Licensed under MIT (https://github.com/developerdayo/naked-form-select/LICENSE) */

 const nakedFormSelect = (target = 'select', { settings = { dropupThreshold: 50 }, context = { value: undefined, queryDocument: false }, keywordSearch = { on: false, placeholder: undefined }, submitBtn = { on: false, text: undefined } } = {}) => {

  // in the context of Drupal, the context.queryDocument default value is not being set properly as defined above
  // therefore, the following ternary statement fixes it
  context.queryDocument === undefined ? context.queryDocument = false : context.queryDocument = context.queryDocument;

  let $source;
  let $targetSelector;
  let targetSelectorID;
  let dropupThreshold = settings.dropupThreshold;

  const build = {
    index: () => {
      let setIndex = () => {
        $source.querySelectorAll('[data-naked-select-id]').forEach(($nakedContainer, index) => {
          $nakedContainer.setAttribute('data-index', index);
        })
      }
      setTimeout(() => {
        setIndex();
      }, 1);
    },
    submitBtn: () => {
      let submitBtn = document.createElement('button');
      submitBtn.textContent = 'Submit the form';
      submitBtn.classList.add('naked-submit');

      submitBtn.addEventListener('click', (e) => {
        e.target.closest('form').submit();
      })

      return submitBtn;
    },
    keywordSearchInput: () => {
      let $searchContainer = document.createElement('div');
      $searchContainer.classList.add('keyword-search-wrap');

      let $input = document.createElement('input');

      if (keywordSearch.placeholder !== undefined) {
        $input.setAttribute('placeholder', keywordSearch.placeholder);
      }

      $searchContainer.appendChild($input);

      return $searchContainer;
    },
    lists: () => {
      $source.querySelectorAll($targetSelector).forEach((selectElement, index) => {
        // get an array of the options
        let options = Array.from(selectElement.childNodes).filter(option => option.nodeName === 'OPTION');
        let dataLabel;

        if (selectElement.getAttribute('data-label') === 'true') {
          dataLabel = options[0];
          options.shift();
        }

        let optionsTextArr = [];

        options.forEach((option) => {optionsTextArr.push(option.textContent)});

        // create placeholder text
        let placeholderText;

        if ( selectElement.getAttribute('data-label') === 'true') {
          placeholderText = dataLabel.textContent;
        } else {
          placeholderText = options[0].textContent;
        }
        let $placeholderContainer = document.createElement('button');


        $placeholderContainer.classList.add('toggle-dropdown');
        $placeholderContainer.setAttribute('aria-label', 'Click to expand options');
        $placeholderContainer.textContent = placeholderText;

        // create unordered list with the options text
        let $listContainer = document.createElement('div');
        $listContainer.classList.add('options-wrap');

        let $list = document.createElement('ul');
        $list.setAttribute('data-naked-select-list', index);

        // remove the first item from options array because its the placeholder text
        optionsTextArr.forEach((listItem, index) => {

          let item = document.createElement('li');

          item.setAttribute('data-index', index);

          item.appendChild(document.createTextNode(listItem));

          $list.appendChild(item);
        })

        $listContainer.appendChild($list);

        // create and add the entirely new markup that will be styled containing select options
        let $container = document.createElement('div');
        $container.classList.add('naked-form-select-wrap');
        $container.setAttribute('data-naked-select-id', $targetSelector);
        $container.setAttribute('data-naked-select', index);

        $container.appendChild($placeholderContainer);

        $container.appendChild($listContainer);


        selectElement.parentNode.insertBefore($container, selectElement);
        $container.appendChild(selectElement);


        // add predict search markup if this option is turned on
        if (keywordSearch.on === true) {

          let $searchContainer = build.keywordSearchInput();

          $list.insertAdjacentElement('beforebegin', $searchContainer);

        }

        // add submit button markup if option is on
        if (submitBtn.on === true) {
          let submitBtn = build.submitBtn();

          $list.insertAdjacentElement('afterend', submitBtn);
          console.log(selectElement);
        }

      }, build.index())
    },
    currentState: () => {
      $source.querySelectorAll(`${targetSelectorID}[data-naked-select] select`).forEach((select, index) => {

        let $placeholderContainer = document.querySelector(`${targetSelectorID}[data-naked-select='${index}'] .toggle-dropdown`);

        if (select.multiple) {
          // update placeholder text for multiple select
          let selectedOptionsArr = Array.from(select.options).filter(option => option.selected === true);
          let selectedIndex = select.options.selectedIndex;

          selectedOptionsArr.forEach((option) => {
            select.previousElementSibling.querySelector(`li[data-index='${option.index}']`).classList.add('selected');
           });

          let keyword;

          // if there is nothing selected, set it to the first option
          if (select.options.selectedIndex === -1) {
            $placeholderContainer.textContent = select.options[0].textContent;
          } else if (select.getAttribute('data-multiple-keyword') !== null && selectedOptionsArr.length > 1) {
            keyword = select.getAttribute('data-multiple-keyword') + 's';
            $placeholderContainer.textContent = `${selectedOptionsArr.length} ${keyword} selected`;
          } else {
            keyword = 'items';
            $placeholderContainer.textContent = select.options[selectedIndex].textContent;
          }

        } else {

          let selectedIndex = select.options.selectedIndex;

          // set the label
          if (select.getAttribute('data-label') === 'true' && selectedIndex === 0) {
            $placeholderContainer.textContent = select.options[0].textContent;
          } else {
            $placeholderContainer.textContent = select.options[selectedIndex].textContent;

            // add the 'selected' class
            select.previousElementSibling.querySelector(`li[data-index="${selectedIndex}"]`).classList.add('selected');
          }
        }
      })
    }
  }
  const interactive = {
    triggerEvent: (el, type) => {
      if ('createEvent' in document) {
        var e = document.createEvent('HTMLEvents');
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
      }
    },
    globalClose: () => {
      // close all dropdowns when clicked outside of select
      document.querySelector('body').addEventListener('click', (element) => {

        let selectArr = Array.from(document.querySelectorAll('[data-naked-select]'));

        for (let i = 0; i < selectArr.length; i++) {
          if (selectArr[i].classList.contains('open') && !selectArr[i].contains(element.target)) {

            let openSelectIndexID = parseInt(selectArr[i].getAttribute('data-index'));
            let openSelectID = selectArr[i].getAttribute('data-naked-select-id');
            selectArr[i].classList.remove('open');
            document.querySelector(`[data-naked-select-id='${openSelectID}'][data-index='${openSelectIndexID}'] .options-wrap`).style.height = '0';
            setTimeout(() => {
              selectArr[i].classList.remove('dropup');
            }, 255);
          }
        }
      })
    },
    toggle: () => {
      $source.querySelectorAll(`${targetSelectorID}[data-naked-select] .toggle-dropdown`).forEach((btnElement, index) => {

        let $selectContainer = $source.querySelector(`${targetSelectorID}[data-naked-select='${index}']`);
        let $listContainer = $source.querySelector(`${targetSelectorID}[data-naked-select='${index}'] .options-wrap`);

        // get list container's initial height to create slide toggle effect with css' help
        $listContainer.style.height = '0';

        // the slide toggle click event
        btnElement.addEventListener('click', (event) => {
          event.preventDefault();

          let listHeight = $listContainer.scrollHeight;
          if ($selectContainer.classList.contains('open')) {
            $selectContainer.classList.remove('open');
            $listContainer.style.height = '0';
            event.target.parentNode.classList.remove('dropup');
          } else {
            $selectContainer.classList.add('open');
            $listContainer.style.height = `${listHeight}px`;

            let windowHeight = window.innerHeight;
            let scrollPosition = window.scrollY;
            let btnPosition = window.scrollY + event.target.getBoundingClientRect().top + event.target.offsetHeight;
            if (windowHeight - btnPosition + scrollPosition < dropupThreshold) {
              event.target.parentNode.classList.add('dropup');
              event.target.nextSibling.style.bottom = `${event.target.offsetHeight}px`;
            }
          }
        })
      }, interactive.globalClose())
    },
    select: () => {

      let listValueArr = []

      $source.querySelectorAll(`${targetSelectorID}[data-naked-select] li`).forEach((listItem, index) => {

        listItem.addEventListener('click', () => {

          let listItemIndex = listItem.getAttribute('data-index');
          let listItemValue = listItem.textContent;
          let selectContainerIndex = listItem.parentNode.getAttribute('data-naked-select-list');
          let $select = $source.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] select`);

          let listHeight = $source.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] .options-wrap`).scrollHeight;

          // update the select value
          $select.options[parseInt(listItemIndex)].selected = true;

          interactive.triggerEvent($select, 'change');

          let $placeholderContainer = $source.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] .toggle-dropdown`);

          // handle multiple select
          if ($select.multiple) {

            // toggle selected class
            if (listItem.classList.contains('selected')) {
              listItem.classList.remove('selected');
              $select.options[parseInt(listItemIndex)].selected = false;
            } else {
              listItem.classList.add('selected');
              $select.options[parseInt(listItemIndex)].selected = true;
            }

            // update placeholder text
            let selectedOptionsArr = Array.from($select.options).filter(option => option.selected === true);

            if (selectedOptionsArr.length > 1) {
              selectedOptionsArr.forEach((option) => {
                $select.previousElementSibling.querySelector(`li[data-index="${option.index}"]`).classList.add('selected');
              });

              let keyword;
              $select.getAttribute('data-multiple-keyword') !== null ? keyword = $select.getAttribute('data-multiple-keyword') + 's' : keyword = 'items';
              $placeholderContainer.textContent = `${selectedOptionsArr.length} ${keyword} selected`;
            } else if (selectedOptionsArr.length === 1) {
              $placeholderContainer.textContent = selectedOptionsArr[0].text;
            }

            // if there is nothing selected, set it to the first option
            if ($select.options.selectedIndex === -1) {
              $placeholderContainer.textContent = $select.options[0].textContent;
            }

          } else {

            // handle single select
            let $selectContainer = $source.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}']`);
            let $listContainer = $source.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] .options-wrap`);

            if ($selectContainer.classList.contains('open')) {
              $selectContainer.classList.remove('open');
              $listContainer.style.height = '0';
            } else {
              $selectContainer.classList.add('open');
              $listContainer.style.height = `${listHeight}px`;
            }

            // toggle selected class
            $source.querySelectorAll(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] li`).forEach((li) => {li.classList.remove('selected')});
            listItem.classList.contains('selected') ? listItem.classList.remove('selected') : listItem.classList.add('selected');

            // update the placeholder text
            $placeholderContainer.textContent = listItemValue;
          }
        })
      })
    },
    keywordSearch: () => {
      if (keywordSearch.on === true) {

          $source.querySelectorAll(targetSelectorID).forEach(($container) => {
          $container.setAttribute('keywordSearch', 'on');
        })

        $source.querySelectorAll($targetSelector).forEach((selectElement, index) => {

          // get an array of the options
          let optionsTextArr = [];
          let options = Array.from(selectElement.childNodes).filter(option => option.nodeName === 'OPTION');

          options.forEach((option) => {optionsTextArr.push(option.textContent)});

          // create event to compare the entered value and filter the array of select options by matching substring
          let $input = selectElement.previousElementSibling.childNodes[0].childNodes[0];
          let $list = selectElement.previousElementSibling.childNodes[1];

          // show all list items initially
          let $listItem = $source.querySelectorAll(`[data-naked-select-id='${$targetSelector}'] .options-wrap li`);

          $listItem.forEach(($li) => { $li.classList.add('match') })

          $input.addEventListener('input', (e) => {

            let enteredValue = e.target.value.toLowerCase();

            let filteredResultsArr = options.filter((option) => {
              let lowercase = option.textContent.toLowerCase();
              if (lowercase.match(enteredValue)) {
                  return option;
              }
            })

            $listItem.forEach(($li) => {
              $li.classList.remove('match');
            })

            filteredResultsArr.forEach((option) => {
              $listItem.forEach(($li) => {
                let dataIndex = parseInt($li.getAttribute('data-index'));

                if (dataIndex === option.index) {
                  $li.classList.add('match');
                }
              })
            })

            // update options-wrap height
            let listHeight = $list.offsetHeight;
            let keywordSearchHeight = $source.querySelector(`${targetSelectorID}[data-naked-select='${index}'] .keyword-search-wrap`).offsetHeight;

            $source.querySelector(`${targetSelectorID}[data-naked-select='${index}'] .options-wrap`).style.height = listHeight + keywordSearchHeight + 'px';
          })
        })
      }
    }
  }

  if (context.value !== undefined && context.queryDocument === false) {
      $source = context.value;
  } else if (context.value !== undefined && context.queryDocument === true) {
      $source = document.querySelector(context.value);
  } else {
      $source = document;
  }

  $targetSelector = target;
  targetSelectorID = `[data-naked-select-id='${$targetSelector}']`;

  build.lists();
  build.currentState();
  interactive.toggle();
  interactive.select();
  interactive.keywordSearch();

}