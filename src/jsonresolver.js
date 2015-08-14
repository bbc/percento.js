var _ = require('lodash');

function resolveWithContext(jsonString, ctx) {

    var prevString,
        value,
        keys;

    while (jsonString !== prevString) {
        prevString = jsonString;

        keys = jsonString.match(/%([\w\d-_\.]+)%/g);

        if (!keys) continue;

        keys.forEach(function(key) {
            key = key.match(/%([\w\d-_\.]+)%/)[1];
            value = _.get(ctx, key);
            if (value) jsonString = jsonString.replace('%'+key+'%', value);
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

function JSONResolver() {

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
