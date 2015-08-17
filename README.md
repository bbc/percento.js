# percento.js

This is a node module designed to give similar templating from [Handlebars](http://handlebarsjs.com/) to JSON. It allows you define your JSON files with _mixins_ that will be resolved by this package.


For example, given a json configuration like the following
```json
{
  "Jason": [
    "%actor%",
    "%murderer%",
    "%singer%"
  ]
}
```
And a context of
```js
{
  singer: "Mraz",
  actor: "Statham",
  murderer: "Voorhees"
}
```
Will produce the following
```json
{
  "Jason": [
    "Statham",
    "Voorhees",
    "Mraz"
  ]
}
```

## Installation ##

To install this package to your project, run
```
npm install --save percento
```
Then require it and use it with
```js
var percento = require('percento');

percento().resolve(json, ctx);
```

## Options ##

`Percento.js` can be configured with a delimiter, or pair of opening and closing delimiters so that you can define your own matchers.
```js
percento({delimiter: '$$'}).resolve(json, ctx);
percento({delimiter: {first: '{{', last: '}}'}}).resolve(json, ctx);
```
You can also chain together resolutions in the following manner
```js
percento().chain().resolve(json, ctx1).resolve(ctx2).resolve(ctx3).value();
```
