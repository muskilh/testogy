"use strict";
const BASE_MARKUP = 1.05;


/**
 * Adds markup to base price based on the number of people and mark up categories involved
 * @function priceCalc
 * @param {String} basePrice - base price in usd/cad currency
 * @param {String} people - number of people needed
 * @param {String} categoryPhrase - the markup category/categories
 * @return {String} The final price quote
 */
function priceCalc(basePrice, people, categoryPhrase) {
    var out = 0;
    
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
    out = priceCalcCore(basePriceTransformed, peopleTransformed, categoryPhraseTransformed);
    
    //Format to proper string and return
    return "$" + out.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}
function priceCalcCore(basePrice, people, category) {
    var out = Math.round(basePrice * 100) / 100 * BASE_MARKUP;
    var markups = 1 + (people * 0.012);
    
    for (var c of category) {
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
    
    //Apply markup
    out = out * markups;
    
    //Round and force 2 decimal points
    out = (Math.round( (out) *Math.pow(10,2))/Math.pow(10,2));
    return out;
}

//Maps words into markup categories
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