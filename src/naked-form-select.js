/* Naked Form Select v1.2.2 (https://github.com/developerdayo/naked-form-select)
 * Copyright 2019-2020 Sarah Ferguson
 * Licensed under MIT (https://github.com/developerdayo/naked-form-select/LICENSE) */
 const nakedFormSelect = (target = 'select', {
  events = {
    open: undefined,
    close: undefined
  },
  settings = {
    dropupThreshold: 50,
  },
  context = {
    value: undefined,
    queryDocument: false
  },
  keywordSearch = {
    on: false,
    placeholder: undefined
  },
  submitBtn = {
    on: false,
    text: undefined
  }
} = {}) => {

  // in the context of Drupal, the context.queryDocument default value is not being set properly as defined above
  // therefore, the following ternary statement fixes it
  context.queryDocument === undefined ? context.queryDocument = false : context.queryDocument = context.queryDocument;

  let $source;
  let $targetSelector;
  let targetSelectorID;
  let dropupThreshold = settings.dropupThreshold;

  const DOWN_ARROW_KEY_CODE = 40;
  const SPACEBAR_KEY_CODE = [0, 32];
  const ENTER_KEY_CODE = 13;
  const UP_ARROW_KEY_CODE = 38;
  const ESCAPE_KEY_CODE = 27;

  const build = {
    index: () => {
      let setIndex = () => {
        [...$source.querySelectorAll('[data-naked-select-id]')].forEach(($nakedContainer, index) => {

          $nakedContainer.setAttribute('data-index', index);
        })
      }
      setTimeout(() => {
        setIndex();
      }, 1);
    },
    submitBtn: () => {
      let $submitBtn = document.createElement('button');
      let $submitBtnText;

      if (submitBtn.text === undefined) {
        $submitBtnText = submitBtn.text = 'submit';
      } else {
        $submitBtnText = submitBtn.text;
      }

      $submitBtn.textContent = $submitBtnText;
      $submitBtn.classList.add('naked-submit');
      $submitBtn.setAttribute('tabindex', '-1');

      $submitBtn.addEventListener('click', (e) => {
        e.target.closest('form').submit();
      })

      return $submitBtn;
    },
    keywordSearchInput: () => {
      let $searchContainer = document.createElement('div');
      $searchContainer.classList.add('keyword-search-wrap');

      let $input = document.createElement('input');
      $input.setAttribute('aria-label', 'Enter a keyword to reduce the list of options');

      if (keywordSearch.placeholder !== undefined) {
        $input.setAttribute('placeholder', keywordSearch.placeholder);
      }

      $searchContainer.appendChild($input);

      return $searchContainer;
    },
    lists: () => {
      [...$source.querySelectorAll($targetSelector)].forEach((selectElement, index) => {
        if (!selectElement.getAttribute('data-initialized')) {

          // get an array of the options
          let options = Array.from(selectElement.childNodes).filter(option => option.nodeName === 'OPTION');
          let dataLabel;

          if (selectElement.getAttribute('data-label') === 'true') {
            dataLabel = options[0];
            options.shift();
          }

          let optionsTextArr = [];

          options.forEach((option) => {
            optionsTextArr.push([option.index, option.textContent])
          });

          // create placeholder text
          let placeholderText;

          if (selectElement.getAttribute('data-label') === 'true') {
            placeholderText = dataLabel.textContent;
          } else {
            placeholderText = options[0].textContent;
          }
          let $placeholderContainer = document.createElement('button');


          $placeholderContainer.classList.add('toggle-dropdown');
          $placeholderContainer.setAttribute('aria-label', 'Click to expand options');
          $placeholderContainer.textContent = placeholderText;
          $placeholderContainer.setAttribute('type', 'button');

          // create unordered list with the options text
          let $listContainer = document.createElement('div');
          $listContainer.classList.add('options-wrap');
          $listContainer.setAttribute('tabindex', '-1');

          let $list = document.createElement('ul');
          $list.setAttribute('data-naked-select-list', index);

          // remove the first item from options array because its the placeholder text
          optionsTextArr.forEach((listItem) => {

            let item = document.createElement('li');

            item.setAttribute('data-index', listItem[0]);
            item.setAttribute('tabindex', '0');

            item.appendChild(document.createTextNode(listItem[1]));

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
            let $submitBtn = build.submitBtn();

            $list.insertAdjacentElement('afterend', $submitBtn);
          }

          interactive.validationError(selectElement);
          build.index();

        }
      })
    },
    currentState: () => {
      [...$source.querySelectorAll(`${targetSelectorID}[data-naked-select] select`)].forEach((select, index) => {
        if (!select.getAttribute('data-initialized')) {

          let siblings = Array.from(select.parentNode.childNodes);
          let $placeholderContainer = siblings.filter(item => item.classList.contains('toggle-dropdown'))[0];

          if (select.multiple) {

            // update placeholder text for multiple select
            let selectedOptionsArr = Array.from(select.options).filter(option => option.selected === true);

            if (select.getAttribute('data-label') === 'true') {
              selectedOptionsArr = selectedOptionsArr.filter(option => option.index !== 0);
            }

            let selectedIndex = select.options.selectedIndex;

            selectedOptionsArr.forEach((option) => {
              select.previousElementSibling.querySelector(`li[data-index='${option.index}']`).classList.add('selected');
            });

            let keyword;

            // if there is nothing selected, set it to the first option
            if (select.options.selectedIndex === -1) {

              // if nothing is selected, default to first option value
              $placeholderContainer.textContent = select.options[0].textContent;

            } else if (select.getAttribute('data-pluralize') === 'false' && select.getAttribute('data-multiple-keyword') !== null && selectedOptionsArr.length > 1) {
              // if using data-multiple-keyword and there's more than one but we don't want to pluralize
              keyword = select.getAttribute('data-multiple-keyword');
              $placeholderContainer.textContent = `${selectedOptionsArr.length} ${keyword} selected`;

            } else if (select.getAttribute('data-multiple-keyword') !== null && selectedOptionsArr.length > 1) {
              // if using data-multiple-keyword and there's more than one
              keyword = select.getAttribute('data-multiple-keyword') + 's';
              $placeholderContainer.textContent = `${selectedOptionsArr.length} ${keyword} selected`;
            } else if (selectedOptionsArr.length > 1) {

              // if using data-label and there's more than one
              keyword = 'items';
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
          select.setAttribute('data-initialized', 'true');
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

      const close = e => {
        let selectArr = [...document.querySelectorAll('[data-naked-select]')].filter(item => !item.contains(e.target));

        if (!events.close) {
          selectArr.forEach(select => {
  
              select.classList.remove('open');
  
              const dropdown = select.querySelector('.options-wrap');
  
              dropdown.setAttribute('tabindex', '-1');
  
              setTimeout(() => {
                  select.classList.remove('dropup');
              }, 255);
  
              dropdown.style.height = '0';
          })
        } else {
            events.close();
        }
      }

      document.querySelector('body').addEventListener('click', e => {
        close(e);
      })

      document.querySelector('body').addEventListener('keydown', e => {
        if (e.keyCode === ESCAPE_KEY_CODE) close(e);
      })
    },
    toggle: eventType => {
      [...$source.querySelectorAll(`${targetSelectorID}[data-naked-select]`)].forEach((selectEl) => {
        [...selectEl.querySelectorAll('.toggle-dropdown')].forEach((btnElement) => {

          let index = btnElement.parentNode.getAttribute('data-naked-select');
          let $selectContainer = $source.querySelector(`${targetSelectorID}[data-naked-select='${index}']`);
          let $listContainer = $source.querySelector(`${targetSelectorID}[data-naked-select='${index}'] .options-wrap`);

          selectEl.setAttribute('data-keydown-event', 'initialized');
          selectEl.setAttribute('data-click-event', 'initialized');

          // get list container's initial height to create slide toggle effect with css' help
          $listContainer.style.height = '0';

          // the slide toggle click event
          btnElement.addEventListener(eventType, event => {

            const open = () => {
              $selectContainer.classList.add('open');
              $listContainer.setAttribute('tabindex', '0');

              let windowHeight = window.innerHeight;
              let scrollPosition = window.scrollY;
              let btnPosition = window.scrollY + event.target.getBoundingClientRect().top + event.target.offsetHeight;
              if (windowHeight - btnPosition + scrollPosition < dropupThreshold) {
                event.target.parentNode.classList.add('dropup');
                event.target.nextSibling.style.bottom = `${event.target.offsetHeight}px`;
              }

              if (selectEl.querySelector('.naked-submit')) selectEl.querySelector('.naked-submit').setAttribute('tabindex', '0');

              // optional callback
              if (typeof events.open === 'function' && events.open) {
                events.open($listContainer);
              } else {
                $listContainer.style.height = null;
              };
            }

            const close = () => {
              $selectContainer.classList.remove('open');
              $listContainer.setAttribute('tabindex', '-1');
              event.target.parentNode.classList.remove('dropup');

              if (selectEl.querySelector('.naked-submit')) selectEl.querySelector('.naked-submit').setAttribute('tabindex', '-1');

              // optional callback
              if (typeof events.close === 'function' && events.close) {
                events.close($listContainer);
              } else {
                $listContainer.style.height = '0';
              };
            }

            if (eventType === 'keydown') {

              if (event.keyCode === SPACEBAR_KEY_CODE) {

                open();

              } else if (event.keyCode === DOWN_ARROW_KEY_CODE) {

                const currentActiveElementIndex = listItemIds.indexOf(activeElementId);
                const currentActiveElementIsNotLastItem = currentActiveElementIndex < listItemIds.length - 1;

                currentActiveElementIsNotLastItem.querySelector('ul li:first-child').focus();

              } else if (event.keyCode === ESCAPE_KEY_CODE) {
                close();
              }

            } else if (eventType === 'click') {
              event.preventDefault();

              if ($selectContainer.classList.contains('open')) {
                close();
              } else {
                open();
              }
            }

          })
          selectEl.setAttribute('data-initialized', 'true');
        }, interactive.globalClose())
      })
    },
    addValidationMessage: (select) => {
      if (!select.querySelector('.naked-form-select-wrap--error-message')) {
        select.classList.add('error');

        let errorMessage = document.createElement('div');
        errorMessage.classList.add('naked-form-select-wrap--error-message');
        errorMessage.textContent = 'Please make a selection';

        select.insertBefore(errorMessage, select.childNodes[0]);
      }
    },
    removeValidationMessage: (select) => {
      if (select.classList.contains('error')) {
        select.classList.remove('error');

        let errorMessage = select.querySelector('.naked-form-select-wrap--error-message');
        select.removeChild(errorMessage);
      }
    },
    validationError: (select) => {
      const form = select.closest('form');
      
      if (form && form.querySelector('[type="submit"]')) {
        const formSubmitBtn = form.querySelector('[type="submit"]');

        formSubmitBtn.addEventListener('click', (e) => {
          let nakedSelect = select.parentNode;

          if (!select.checkValidity()) {
            interactive.addValidationMessage(nakedSelect);
          } else {
            interactive.removeValidationMessage(nakedSelect);
          }
        })
      }
    },
    select: () => {

      [...$source.querySelectorAll(`${targetSelectorID}[data-naked-select] li`)].forEach((listItem) => {

        listItem.addEventListener('click', () => {

          selectOption(listItem);

        })

        listItem.addEventListener('keydown', event => {

          if (event.keyCode === ENTER_KEY_CODE) {
            selectOption(listItem);
          }
        })
      })

      const selectOption = listItem => {
        let listItemIndex = parseInt(listItem.getAttribute('data-index'));
        let listItemValue = listItem.textContent;
        let selectContainerIndex = listItem.parentNode.getAttribute('data-naked-select-list');
        let $select = $source.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] select`);

        // update the select value
        $select.options[listItemIndex].selected = true;

        interactive.triggerEvent($select, 'change');

        let $placeholderContainer = $source.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] .toggle-dropdown`);

        // handle multiple select
        if ($select.multiple) {

          // toggle selected class
          if (listItem.classList.contains('selected')) {
            listItem.classList.remove('selected');
            $select.options[listItemIndex].selected = false;
          } else {
            listItem.classList.add('selected');
            $select.options[listItemIndex].selected = true;
          }

          // update placeholder text
          let selectedOptionsArr = Array.from($select.options).filter(option => option.selected === true);

          if ($select.getAttribute('data-label') === 'true') {
            selectedOptionsArr = selectedOptionsArr.filter(option => option.index !== 0);
          }

          if (selectedOptionsArr.length > 1) {

            selectedOptionsArr.forEach((option) => {
              // if data-label is being utilized, lets make sure we adjust the index for that scenario
              if ($select.getAttribute('data-label') !== 'true' || option.index !== 0) {
                $select.previousElementSibling.querySelector(`li[data-index="${option.index}"]`).classList.add('selected');
              }
            });

            let keyword;

            if ($select.getAttribute('data-multiple-keyword') !== null && $select.getAttribute('data-pluralize') === 'false') {
              keyword = $select.getAttribute('data-multiple-keyword');
            } else if ($select.getAttribute('data-multiple-keyword') !== null) {
              keyword = `${$select.getAttribute('data-multiple-keyword')}s`;
            } else {
              keyword = 'items';
            }

            $placeholderContainer.textContent = `${selectedOptionsArr.length} ${keyword} selected`;
          } else if (selectedOptionsArr.length === 1) {
            $placeholderContainer.textContent = selectedOptionsArr[0].text;
          }

          // if there is nothing selected, set it to the first option
          if (selectedOptionsArr.length === 0) {
            $placeholderContainer.textContent = $select.options[0].textContent;
          }

        } else {

          // handle single select
          let $selectContainer = $source.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}']`);
          let $listContainer = $source.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] .options-wrap`);

          if ($selectContainer.classList.contains('open')) {
            $selectContainer.classList.remove('open');
            $listContainer.setAttribute('tabindex', '-1');
            // optional callback
            if (typeof events.close === 'function' && events.close) {
                events.close($listContainer);
            } else {
                $listContainer.style.height = '0';
            };
          } else {
            $selectContainer.classList.add('open');
            $listContainer.setAttribute('tabindex', '0');
            // optional callback
            if (typeof events.open === 'function' && events.open) {
                events.open($listContainer);
            } else {
                $listContainer.style.height = null;
            };
          }

          // toggle selected class
          [...$source.querySelectorAll(`${targetSelectorID}[data-naked-select='${selectContainerIndex}'] li`)].forEach((li) => {
            li.classList.remove('selected')
          });
          listItem.classList.contains('selected') ? listItem.classList.remove('selected') : listItem.classList.add('selected');

          // update the placeholder text
          $placeholderContainer.textContent = listItemValue;
        }

        if ($select.getAttribute('required')) {
          if ($select.selectedIndex !== 0)
            interactive.removeValidationMessage($source.querySelector(`${targetSelectorID}[data-naked-select='${selectContainerIndex}']`));
        }
      }
    },
    keywordSearch: () => {
      if (keywordSearch.on === true) {

        [...$source.querySelectorAll(targetSelectorID)].forEach(($container) => {
          $container.setAttribute('keywordSearch', 'on');
        });

        [...$source.querySelectorAll($targetSelector)].forEach((selectElement, index) => {

          // get an array of the options
          let optionsTextArr = [];
          let options = Array.from(selectElement.childNodes).filter(option => option.nodeName === 'OPTION');

          options.forEach((option) => {
            optionsTextArr.push(option.textContent)
          });

          // create event to compare the entered value and filter the array of select options by matching substring
          let $input = selectElement.previousElementSibling.childNodes[0].childNodes[0];
          let $list = selectElement.previousElementSibling.childNodes[1];

          // show all list items initially
          let $listItem = [...$source.querySelectorAll(`[data-naked-select-id='${$targetSelector}'] .options-wrap li`)];

          $listItem.forEach(($li) => {
            $li.classList.add('match')
          })

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
            $source.querySelector(`${targetSelectorID}[data-naked-select='${index}'] .options-wrap`).style.height = null;

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
  interactive.toggle('keydown');
  interactive.toggle('click');
  interactive.select();
  interactive.keywordSearch();

}

if (typeof module !== 'undefined') module.exports = nakedFormSelect;