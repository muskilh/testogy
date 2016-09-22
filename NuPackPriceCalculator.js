"use strict";
const BASE_MARKUP = 1.05;


/**
 * Adds markup to base price based on the number of people and mark up categories involved as per requirements doc.
 * @function priceCalc
 * @param {String} basePrice - Base price in usd/cad currency format. Also accepts double and int as inputs.
 * @param {String} people - Number of people needed. 
 *                  The first "word" of the string must be an int (i.e. "3 people"). All other numbers will be ignored
 * @param {String} categoryPhrase - A word/phrase containing word(s) associated with the markup categories
 *                  If multiple categories are detected, duplicates will be ignored and all unique markups will be applied
 * @return {String} The final price quote as a string formatted as usd/cad currency
 */
function priceCalc(basePrice, people, categoryPhrase) {
    var out = 0; //The final output, will be over written below.
    
    //First check the args and transform them into useable values; (aka double, int, str)
    if (typeof basePrice === 'undefined' || basePrice == null)  throw new Error("Argument Missing");
    if (typeof people === 'undefined' || people == null)  throw new Error("Argument Missing");
    if (typeof categoryPhrase === 'undefined' || categoryPhrase == null) throw new Error("Argument Missing");
    
    var basePriceTransformed = basePrice;
    var peopleTransformed = people;
    var categoryPhraseTransformed = categoryPhrase;
    
    
    //Convert the basePrice into a useable number
    if (typeof basePriceTransformed === 'string'){ //If it's a str, we strip out any thing other than numbers and decimals
        basePriceTransformed = Number(basePriceTransformed.replace(/[^\-0-9\.]+/g,""));
        
        //If it's not a number or negative, it's no good
        if (isNaN(basePriceTransformed) || (basePriceTransformed < 0)){ 
            throw new Error("Price Badly Formatted");
        }
    } else if (typeof basePriceTransformed !== 'number'){ //If anything other than str or number, it's no good
        console.log(basePriceTransformed);
        throw new Error("Price Badly Formatted");
    }
    
    
    //Convert people into a useable number
    var regexFirstWord = /(?:^|\s)\w(.*?)(?:\s|$)/g;
    var match = regexFirstWord.exec(peopleTransformed);
    if (!match || match == null || match.length < 1){
        throw new Error("People Badly Formatted");
    }
    peopleTransformed =  Number(match[0]);
    if (isNaN(peopleTransformed) || (peopleTransformed !== parseInt(peopleTransformed, 10))){
        throw new Error("People Badly Formatted");
    }
    
    
    //Convert Category Phrase into a list of official categories
    if (typeof categoryPhrase !== 'string'){
        throw new Error("Category Badly Formatted");
    }
    categoryPhraseTransformed = wordsToMarkupCategories(categoryPhraseTransformed);
    
    //Run the actual calculations
    out = priceCalcHelper(basePriceTransformed, peopleTransformed, categoryPhraseTransformed);
    
    //Format to proper string and return
    return "$" + out.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}


/**
 * Helper function for priceCalc. Given actual numbers and a list of markup categories, calculates the quote as per requirements doc.
 * @function priceCalcHelper
 * @param {double} basePrice - Base price to be used in calculations
 * @param {int} people - Number of people needed.
 * @param {Array} categories - A list of markup categories. 
 *                  If multiple categories are detected, all will be applied, including duplicates.
 * @return {double} The final price quote as a double
 */
function priceCalcHelper(basePrice, people, categories) {
    //Start by adding base markup
    var out = Math.round(basePrice * 100) / 100 * BASE_MARKUP; //This will be the final price outputted
    var markups = 1; //The markups to be added
    
    //Set the rates for various aspects
    var peopleRate = 0.012;
    var categoryRates = {
        "food": 0.13,
        "pharmaceuticals": 0.075,
        "electronics": 0.02,
        "other": 0.00 //We'll add this instead of skipping it in case we need to change it later
    };
    
    //Calculate the additional markups to be added
    markups += people * peopleRate; 
    
    //Add markups from categories
    for (var category of categories) {
        if (category in categoryRates){
            markups += categoryRates[category];
        } else {
            markups += categoryRates['other'];
        }
    }
    
    //Apply markup to the price
    out = out * markups;
    
    //Round and force 2 decimal points, then return
    return (Math.round( (out) *Math.pow(10,2))/Math.pow(10,2));
}


/**
 * Maps a word/phrase into a list of the associated markup categories
 * @function wordsToMarkupCategories
 * @param {String} words - A word or phrase containing word(s) associated with markup categories
 * @return {Array} An array of all markup categories found within the "words" input 
 *                  or an empty array if none were found
 */
function wordsToMarkupCategories(words) {
    // In reality this should be using a database and/or use some natural language library to
    // group the word associations and deal with plurality (i.e. food vs foods)
    
    var out = []; //The output which will be a list of all applicable markup categories
    
    //Define the word associations    
    var wordAssociations = {
        "food": ["food", "foods", "cookie", "cookies"],
        "pharmaceuticals": ["pharmaceutical", "pharmaceuticals", "drug", "drugs"],
        "electronics": ["electronics", "electronic", "tv", "tvs"]
    }

    //Loop through the word association lists
    for (var markupCategory in wordAssociations) {
        if (wordAssociations.hasOwnProperty(markupCategory)) {
            var wordList = wordAssociations[markupCategory];
            
            //Loop through the words for each category
            for (var word of wordList) {
                //If the association word is located anywhere in the entire word phrase, add the markup key to the output
                if (words.toLowerCase().indexOf(word) !== -1){ 
                    out.push(markupCategory);
                    break; //We only want to add it at most once so we jump to the next list
                }
            }
        }
    }
    
    return out;
}

module.exports = {
  priceCalc,
  wordsToMarkupCategories
};