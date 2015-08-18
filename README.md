# percento.js #

**`Percento.js`** is designed to be [Handlebars](http://handlebarsjs.com/) for JSON. It is a node module that allows you to template JSON objects with _mixins_ that can be resolved with a _context_ by this package.


_Mixins_ are defined using delimiters, the **default** ones are `%...%`.

For example, given the following JSON object _(template)_
```json
{
  "Jason": [
    "%actor%",
    "%murderer%",
    "%singer%"
  ]
}
```
And a _context_ of
```js
{
  singer: "Mraz",
  actor: "Statham",
  murderer: "Voorhees"
}
```
**`Percento.js`** will produce the following
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

**`Percento.js`** can be configured with a custom delimiter, or pair of opening and closing delimiters to define your own matchers.
```js
percento({delimiter: '$$'}).resolve(template, ctx);
percento({delimiter: {first: '{{', last: '}}'}}).resolve(template, ctx);
```

#### Chaining Resolutions ####

You can chain resolutions calls together in the following manner
```js
percento().chain().resolve(template, ctx1).resolve(ctx2).resolve(ctx3).value();
```
Chaining passes the resolved template through to each subsequent `resolve` call. You must call `.value()` at the end to return the current resolved template.

#### Nested Properties ####

_Templates_ can access nested properties of a _context_, for example this JSON object
```json
{
  "name": "%people[0].name%",
  "surname": "%people[1].surname%"
}
```
Can access the properties in this _context_
```js
{
    people:[
        { name: "Juliet", surname: "Capulet" },
        { name: "Romeo", surname: "Montague" }
    ]
}

```
To pick the values `"Juliet"` and `"Montague"`.
This uses [`lodash`'s deep get](https://lodash.com/docs#get) method, so the _accessor string_ in the _template_ should behave the same way.

#### Self Resolution ####

Calling `percento` with a single argument will try to resolve all mixins using _itself_ as the context, for example
```js
var template = {
    name: "william",
    surname: "shakespeare",
    fullname: "%name% %surname%"
}

var result = percento().resolve(template);

result.fullname; // william shakespeare
```
