# Naked Form Select
Use this package to style form selects that adds minimal markup and requires minimal css. Naked Form Select supports single and multi-select as well as has an option to turn on keyword search. It is written in Javascript and requires no other dependencies.

## Demo
I've provided a simple demo in the `demo` folder.

## Quick start
• Install with npm: `npm install naked-form-select`

## Support
"browserslist": [
    "> 1%",
    "last 2 versions",
    "ie >= 11"
]

## Usage
### Initialize
Initialize by passing in your selector. For example: `nakedFormSelect('select')`

### Multi-select
To enable multi-select, just make sure your `<select>` has the multiple property, ex) `<select multiple>`

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
