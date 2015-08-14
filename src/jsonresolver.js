var _ = require('lodash');

function JSONResolver( options ) {

    var delimiter = options && options.delimiter ? options.delimiter : '%';

    function resolveWithContext(jsonString, ctx) {

        var replaceString,
            prevString,
            value,
            keys,
            re;

        while (jsonString !== prevString) {
            prevString = jsonString;

            re = new RegExp(delimiter+'([\\w\\d-_\\.]+)'+delimiter,'g');
            keys = jsonString.match(re);

            if (!keys) continue;

            keys.forEach(function(key) {
                re = new RegExp(delimiter+'([\\w\\d-_\\.]+)'+delimiter);
                key = key.match(re)[1];
                value = _.get(ctx, key);
                if (value) {
                    replaceString = delimiter + key + delimiter;
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
