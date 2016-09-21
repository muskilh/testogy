"use strict";
var expect = require('expect');
const BASE_MARKUP = 1.05;


/**
 * Adds markup to base price
 * @function priceCalc
 * @param {String} basePrice - base price in usd/cad currency
 * @param {String} people - number of people needed
 * @param {String} category - the markup category
 * @return {String} The final price quote
 */
function priceCalc(basePrice, people, category) {
    return basePrice * BASE_MARKUP;
}

//Maps words into markup categories
function wordsToMarkupCategories(words) {
    if (words == "food") {
        return ["food"];
    }
    if (words == "drugs") {
        return ["pharmaceuticals"];
    }
    return [];
}

console.log(priceCalc(2));

//Tests
expect(function () {
    priceCalc(0);
    throw new Error('test');
}).toThrow(/test/);

expect(
    priceCalc(0)
).toEqual(0);

console.log('Tests Passed!');