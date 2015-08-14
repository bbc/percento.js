var jsonResolver = require('../src/jsonResolver');

describe('JSON variable resolver', function () {

      it('should provide a resolve function', function () {
        expect(jsonResolver().resolve).toBeDefined();
      });

    it('should return json that its given', function () {
        var json = { 'foo':'bar','baz':'luhrmann' };
        expect(jsonResolver().resolve(json)).toEqual(json);
    });

    it('should return first arg if passed two', function () {
        var json = { 'foo':'bar','baz':'luhrmann' },
            ctx = { 'a':'b' };

        expect(jsonResolver().resolve(json, ctx)).toEqual(json);
    });

    it('should replace ctx within json', function () {
        var expected = { 'foo':'bar','baz':'luhrmann' },
            json = { 'foo':'%a%','baz':'luhrmann' },
            ctx = { 'a':'bar' };

        expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
    });

    describe('when given nested variables in ctx', function () {

        it('should resolve them', function () {
            var expected = { 'foo':'baz luhrmann' },
                json = { 'foo':'%name%' },
                ctx = { 'name':'baz %surname%', 'surname': 'luhrmann' };

            expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
        });

        it('should resolve them independently of order', function () {
            var expected = { 'foo':'baz luhrmann' },
                json = { 'foo':'%name%' },
                ctx = {  'surname': 'luhrmann', 'name':'baz %surname%' };

            expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
        });

        it('should break out when it can no longer resolve', function () {
            var expected = { 'foo':'%unfound%' },
                json = { 'foo':'%unfound%' },
                ctx = { };

            expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
        });

        it('should not break out when given mixed contexts', function () {
            var expected = { 'foo':'%unfound%', 'baz':'luhrmann' },
                json = { 'foo':'%unfound%', 'baz':'%baz%' },
                ctx = { baz: 'luhrmann' };

            expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
        });

        it('should resolve object variables', function () {
            var expected = { 'foo':'baz luhrmann' },
                json = { 'foo':'%person.name%' },
                ctx = { 'person': { 'name': 'baz luhrmann'} };

            expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
        });
    });

    describe('when not given a ctx', function () {

        it('should resolve self', function () {
            var expected = {
                surname:'luhrmann',
                'people':['baz luhrmann','catherine luhrmann']
            };
            var json = {
                'surname':'luhrmann',
                'people':['baz %surname%','catherine %surname%']
            };

            expect(jsonResolver().resolve(json)).toEqual(expected);
        });

        it('should resolve self with nested items', function () {
            var expected = {
                'surname':'luhrmann',
                'family': {
                    'baz': 'baz luhrmann',
                    'catherine': 'catherine luhrmann'
                },
                'people':['baz luhrmann','catherine luhrmann']
            };
            var json = {
                'surname':'luhrmann',
                'family':{
                    'baz': 'baz %surname%',
                    'catherine': 'catherine %surname%'
                },
                'people':['%family.baz%','%family.catherine%']
            };

            expect(jsonResolver().resolve(json)).toEqual(expected);
        });

    });

    describe('when not given JSON as ctx', function() {
        it('should ignore the ctx, returning the input JSON', function() {
            var expected = {'input': '%steinbeck%'},
                json = {'input': '%steinbeck%'},
                ctx = 7;

            expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
        });
    });

    describe('when not given JSON as json', function() {
        describe('when given a valid ctx', function() {
            it('will return the first input', function() {
                var expected = 'Romeo + Juliet',
                    json = 'Romeo + Juliet',
                    ctx = { 'a':'bar' };

                expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
            });
        });

        describe('when not given a valid ctx', function() {
            it('will return the first input', function() {
                var expected = 'Romeo + Juliet',
                    json = 'Romeo + Juliet',
                    ctx = 'The Great Gatsby';

                expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
            });
        });

        describe('when json is falsy', function() {
            describe('when undefined', function() {
                it('will return an empty object', function() {
                    var expected = { },
                        json = undefined,
                        ctx = { 'name':'baz %surname%' };

                    expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
                });
            });

            describe('when false', function() {
                it('will return an empty object', function() {
                    var expected = { },
                        json = false,
                        ctx = { 'name':'baz %surname%' };

                    expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
                });
            });

            describe('when null', function() {
                it('will return an empty object', function() {
                    var expected = { },
                        json = null,
                        ctx = { 'name':'baz %surname%' };

                    expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
                });
            });

            describe('when 0', function() {
                it('will return an empty object', function() {
                    var expected = { },
                        json = 0,
                        ctx = { 'name':'baz %surname%' };

                    expect(jsonResolver().resolve(json, ctx)).toEqual(expected);
                });
            });
        });
    });
});

describe('Custom delimiters', function () {
    var jsonResolverDelimiter = require('../src/jsonResolver')({delimiter: '&&'});
    
    it('should resolve when set', function () {
        var expected = { 'foo':'bar','baz':'luhrmann' },
                json = { 'foo':'&&a&&','baz':'luhrmann' },
                ctx = { 'a':'bar' };

        expect(jsonResolverDelimiter.resolve(json, ctx)).toEqual(expected);
    });
});

describe('chaining', function() {
    describe('chain a single resolve', function () {
        it('should resolve normally, returning after calling value()', function () {
            var expected = { 'foo':'bar','baz':'luhrmann' },
                json = { 'foo':'%a%','baz':'luhrmann' },
                ctx = { 'a':'bar' };

            expect(jsonResolver().chain().resolve(json, ctx).value()).toEqual(expected);
        });
    });

    describe('chain a multiple chain resolve', function () {
        it('should resolve normally, returning after calling value()', function () {
            var expected = { 'foo':'bang','baz':'luhrmann' },
                json = { 'foo':'%a%','baz':'luhrmann' },
                ctx = { 'a':'%bar%' },
                ctx2 = { 'bar': 'bang'};

            expect(
                jsonResolver()
                .chain()
                .resolve(json, ctx)
                .resolve(ctx2)
                .value()
            ).toEqual(expected);
        });
    });
});
