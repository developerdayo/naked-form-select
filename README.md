![](https://github.com/developerdayo/naked-form-select/blob/629d9706a5fe1f0e59b343ae50b2a6b5babd79b9/banner.png)
# Naked Form Select
Use this package to style form selects that adds minimal markup and requires minimal css. Naked Form Select supports single and multi-select as well as has an option to turn on keyword search. It is written in Javascript and requires no other dependencies.

## Demo
I've provided a simple demo in the [demo folder](https://github.com/developerdayo/naked-form-select/tree/master/demo).

## Quick start
• Install with npm: `npm install naked-form-select`

## Support
"browserslist": [<br />
&nbsp;&nbsp;&nbsp;&nbsp;"> 1%",<br />
&nbsp;&nbsp;&nbsp;&nbsp;"last 2 versions",<br />
&nbsp;&nbsp;&nbsp;&nbsp;"ie >= 11"<br />
]

### For IE11 Support
Include the files in the [dist/js/ie11-polyfills](https://github.com/developerdayo/naked-form-select/tree/master/dist/js/ie11-polyfills) as this plugin uses forEach, Array.from, and closest.

## Usage
### Initialize
Initialize by passing in your selector. For example: `nakedFormSelect('select')`

### Multi-select
To enable multi-select, just make sure your `<select>` has the multiple property, ex) `<select multiple>`

### Data Attributes
#### data-multiple-keyword
Add `data-multiple-keyword` to `<select multiple>` in order to control the verbiage used in the label when multiple options are selected. For example:

```
<select data-multiple-keyword="donut" multiple>
  <option>Option 1</option>
  <option>Option 2</option>
  <option>Option 3</option>
</select>
```
If option 1 is selected, the label will read 'Option 1'. However, if Option 1 and 2 are selected, the label will read '2 donuts selected'. The keyword provided is turned plural so I recommend that you enter in the singular version of your noun.

#### data-label
Add `data-label="true"` to any select (single or multiple) in order to set the default verbiage in the label to the text content to the first option but while excluding the first option from the dropdown itself. For example:
```
<select data-label="true">
  <option>Choose a fruit</option>
  <option>Banana</option>
  <option>Orange</option>
  <option>Apple</option>
</select>
```

Will result in an output that looks like this (the following is not the exact markup generated by naked form select, it is simplified for the example):
```
<button>Choose a fruit</button>
<ul>
  <li>Banana</li>
  <li>Orange</li>
  <li>Apple</li>
</ul>
```

### Keyword Search
Enabling keyword search adds an input with a button to the options dropdown. The options are reduced based off of the matching characters entered into the input by the user. In addition to the 'on' option, there is also a placeholder option in which you can control the input's placeholder text.

Enable keyword search for your select by the following example:

```
  nakedFormSelect('select', {
    keywordSearch: {
      on: true,
      placeholder: 'Enter keyword'
    }
  });
```

### Submit Button
Add a submit button to the bottom of your dropdown list by the following example:
```
  nakedFormSelect('select', {
    submitBtn: {
      on: true,
      text: 'Submit this form'
    }
  });
```
It will submit the parent form.

### Context Option
Query target select elements within a certain context. This option accepts both a value and a boolean property to query document. For instance, reference
Example #4 in the demo.html file. If you want to initialize select elements with a class of .example-4 within a containing element with a class of .section-with-context, you would do so like this:
```
nakedFormSelect('.example-4', {
  context: {
    value: '.section-with-context',
    queryDocument: true
  }
});
```
This essentially accomplishes what the context parameter in jQuery selectors does.

I specifically created the 'queryDocument' option for the Drupal projects I work on to take advantage of the context variable paired with Drupal Behaviors.
So, if this option is turned on (default is 'false'), context.value will be queried intead of document.

### Default Settings
```
{
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
}
```

## Copyright and license
Copyright (C) 2019-2020 [Sarah Ferguson](https://github.com/developerdayo).

Licensed under [the MIT license](LICENSE).
