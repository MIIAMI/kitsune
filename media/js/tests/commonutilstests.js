/*
 * Tests for common utility functions (k.*).
 */

$(document).ready(function(){

// Object.keys() shim
if (!Object.keys) {
    Object.keys = function keys(object) {
        var keys = [];
        for (var name in object) {
            if (object.hasOwnProperty(name)) {
                keys.push(name);
            }
        }
        return keys;
    };
}

module('k.getQueryParamsAsDict');

test('no params', function() {
    var url = 'http://example.com/',
        params = k.getQueryParamsAsDict(url);
    equals(Object.keys(params).length, 0);
});

test('one param', function() {
    var url = 'http://example.com/?test=woot',
        params = k.getQueryParamsAsDict(url);
    equals(Object.keys(params).length, 1);
    equals('woot', params['test']);
});

test('two params', function() {
    var url = 'http://example.com/?x=foo&y=bar',
        params = k.getQueryParamsAsDict(url);
    equals(Object.keys(params).length, 2);
    equals('foo', params['x']);
    equals('bar', params['y']);
});

test('google url', function() {
    var url = 'http://www.google.com/url?sa=t&source=web&cd=1&sqi=2&ved=0CDEQFjAA&url=http%3A%2F%2Fsupport.mozilla.com%2F&rct=j&q=firefox%20help&ei=OsBSTpbZBIGtgQfgzv3yBg&usg=AFQjCNFIV7wgd9Pnr0m3Ofc7r1zVTNK8dw',
        params = k.getQueryParamsAsDict(url);
    equals(Object.keys(params).length, 10);
    equals('firefox help', params['q']);
});


module('k.getReferrer');

test('search', function() {
    // If url has `?as=s`, getReferrer should return 'search'.
    var params = {'as': 's', 's': 'cookies'};
    equals(k.getReferrer(params), 'search');
});

test('inproduct', function() {
    // If url has `?as=u`, getReferrer should return 'inproduct'.
    var params = {'as': 'u'};
    equals(k.getReferrer(params), 'inproduct');
});

test('search', function() {
    // Otherwise, getReferrer should return `document.referrer` value.
    var params = {};
    equals(k.getReferrer(params), document.referrer);
});


module('k.getSearchQuery');

test('local search referrer', function() {
    // Local search referrer should return the `s` query string param value.
    var params = {'as': 's', 's': 'cookies'},
        referrer = 'search';
    equals(k.getSearchQuery(params, referrer), 'cookies');
});

test('inproduct referrer', function() {
    // inproduct referrers should return empty string for search query.
    var params = {'as': 'u'},
        referrer = 'inproduct';
    equals(k.getSearchQuery(params, referrer), '');
});

test('external search engine (google) referrer', function() {
    // External search referrer should return the `q` query string param value
    // from the referrer url.
    var params = {},
        referrer = 'http://google.com/?q=cookies';
    equals(k.getSearchQuery(params, referrer), 'cookies');
});


});
