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

## Installation & Usage ##

To install this package to your project, run
```
npm install --save percento
```
Then require it and use it with
```js
var percento = require('percento');

percento().resolve(json, ctx);
```
Percento _returns_ the modified string, so you will have to assign it to a variable.

## Options ##

#### Custom Delimiteres ####

`Percento.js` can be configured with a delimiter, or pair of opening and closing delimiters so that you can define your own matchers.
```js
percento({delimiter: '$$'}).resolve(json, ctx);
percento({delimiter: {first: '{{', last: '}}'}}).resolve(json, ctx);
```

#### Chaining Resolutions ####

You can also chain together resolutions in the following manner
```js
percento().chain().resolve(json, ctx1).resolve(ctx2).resolve(ctx3).value();
```

#### Nested Properties ####

You can also define nested properties from within a context, for example this json
```json
{
  "name": "%people[0].name%",
  "surname": "%people[1].surname%"
}
```
Can access the properties in this context
```js
{
    people:[
        { name: "Juliet", surname: "Capulet" },
        { name: "Romeo", surname: "Montague" }
    ]
}

```
To pick the values `"Juliet"` and `"Montague"`.
This uses [`lodash`'s deep get](https://lodash.com/docs#get) method, so the _accessor string_ should behave the same way

#### Self Resolution ####

Calling `percento` with a single argument will try to resolve all mixins using _itself_ as the context, for example
```js
var json = {
    name: "william",
    surname: "shakespeare",
    fullname: "%name% %surname%"
}

var result = percento().resolve(json);

result.fullname; // william shakespeare
```
