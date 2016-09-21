"use strict";
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
function priceCalcCore(basePrice, people, category) {
    var out = Math.round(basePrice * 100) / 100 * BASE_MARKUP;
    var markups = 1 + (people * 0.012);
    
    for (c of category) {
        if (c == "food"){
            markups += 0.13;
        }
        if (c == "pharmaceuticals"){
            markups += 0.075;
        }
        if (c == "electronics"){
            markups += 0.02;
        }
    }
    
    return (Math.round( (out * markups) *Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
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

module.exports = {
  priceCalc,
  wordsToMarkupCategories
};