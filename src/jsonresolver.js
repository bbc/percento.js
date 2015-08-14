var _ = require('lodash');

function escape(delimiterObject) {
    function escapeReplace(str) {
        return str.replace(/([\[\]\{\}\(\)\$])/g, '\\\$1');
    }

    delimiterObject.first = escapeReplace(delimiterObject.first);
    delimiterObject.last = escapeReplace(delimiterObject.last);
}

function JSONResolver( options ) {

    var del = { first: '%', last: '%' };
    if (options && options.delimiter) {
        del = {
            first: options.delimiter.first || options.delimiter,
            last: options.delimiter.last || options.delimiter
        };
    }
    escape(del);

    function resolveWithContext(jsonString, ctx) {

        var replaceString,
            prevString,
            value,
            keys,
            re;

        while (jsonString !== prevString) {
            prevString = jsonString;

            re = new RegExp(del.first+'([\\w\\d-_\\.]+)'+del.last,'g');
            keys = jsonString.match(re);

            if (!keys) continue;

            keys.forEach(function(key) {
                re = new RegExp(del.first+'([\\w\\d-_\\.]+)'+del.last);
                key = key.match(re)[1];
                value = _.get(ctx, key);
                if (value) {
                    replaceString = new RegExp(del.first+key+del.last);
                    jsonString = jsonString.replace(replaceString, value);
                }
            });
        }

        return jsonString;

    }

    function resolve ( json, ctx ) {
        var jsonString = JSON.stringify(json || { });

        jsonString = ctx ?
            resolveWithContext(jsonString, ctx) :
            resolveWithContext(jsonString, json);

        return JSON.parse(jsonString);
    }

    return {
        chain: function() {
            return {
                lastAns: undefined,
                resolve: function ( json, ctx ) {
                    this.lastAns = resolve(this.lastAns || json, ctx || json);
                    return this;
                },
                value: function() {
                    return this.lastAns || { };
                }
            };
        },
        resolve: resolve

    };

}

module.exports = JSONResolver;
