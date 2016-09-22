var expect = require('expect');
var NPPC = require('./NuPackPriceCalculator');

//Tests
console.log("Running Tests...");
//3 Provided Examples
console.log("Testing Basic Example 1: ($1,299.99, 3 people, food)");
expect(
    NPPC.priceCalc("$1,299.99", "3 people", "food")
).toEqual("$1,591.58");

console.log("Testing Basic Example 2: ($5,432.00, 1 person, drugs)");
expect(
    NPPC.priceCalc("$5,432.00", "1 person", "drugs")
).toEqual("$6,199.81");

console.log("Testing Basic Example 3: ($12,456.95, 4 people, books)");
expect(
    NPPC.priceCalc("$12,456.95", "4 people", "books")
).toEqual("$13,707.63");


//Leading 0s
console.log("Testing Leading 0s in Price pt1: ($0012,456.95, 4 people, books)");
expect(
    NPPC.priceCalc("$0012,456.95", "4 people", "books")
).toEqual("$13,707.63");

console.log("Testing Leading 0s in Price pt2: ($0,012,456.95, 4 people, books)");
expect(
    NPPC.priceCalc("$0,012,456.95", "4 people", "books")
).toEqual("$13,707.63");

console.log("Testing Leading 0s in Price pt3: (0012456.95, 4 people, books)");
expect(
    NPPC.priceCalc("0012456.95", "4 people", "books")
).toEqual("$13,707.63");


//Trailing 0s
console.log("Testing Trailing 0s in Price: ($1,299.99, 3 people, food)");
expect(
    NPPC.priceCalc("$1,299.9900000000000000000", "3 people", "food")
).toEqual("$1,591.58");


//No decimal
console.log("Testing No Decimals in Price Pt1: ($1,299.00, 3 people, food)");
expect(
    NPPC.priceCalc("$1,299.00", "3 people", "food")
).toEqual("$1,590.37");

console.log("Testing No Decimals in Price Pt2: ($1,299, 3 people, food)");
expect(
    NPPC.priceCalc("$1,299", "3 people", "food")
).toEqual("$1,590.37");


//Long decimal (What's appropriate behaviour? Maybe attempt to round base price first?)
console.log("Testing Long Decimals in Price: ($1,299.98756413135..., 3 people, food)");
expect(
    NPPC.priceCalc("$1,299.98756413135123152165325186513518312135351813212315132186541231653241946465121312356546", "3 people", "food")
).toEqual("$1,591.58");


//Output has no decimals
console.log("Testing Output Has No Decimals: ($1,301.97, 3 people, food)");
expect(
    NPPC.priceCalc("$1301.97", "3 people", "food")
).toEqual("$1,594.00");


//Each Category -- this was mostly tested with basic examples
console.log("Testing Category pharmaceuticals exact: ($5,432.00, 1 person, pharmaceuticals)");
expect(
    NPPC.priceCalc("$5,432.00", "1 person", "pharmaceuticals")
).toEqual("$6,199.81");


//$0
console.log("Testing $0 base: ($0, 1 person, pharmaceuticals)");
expect(
    NPPC.priceCalc("$0", "1 person", "pharmaceuticals")
).toEqual("$0.00");

//Small base price
console.log("Testing $1 base: ($1.00, 1 person, pharmaceuticals)");
expect(
    NPPC.priceCalc("$1.00", "3 people", "food")
).toEqual("$1.22");

//Large base price
console.log("Testing Large Base: ($1,000,000,000.00, 3 people, food)");
expect(
    NPPC.priceCalc("$1,000,000,000.00", "3 people", "food")
).toEqual("$1,224,300,000.00");


//1 person - tested by basic example


//0 ppl
console.log("Testing 0 People: ($1,299.99, 0 people, food)");
expect(
    NPPC.priceCalc("$1,299.99", "0 people", "food")
).toEqual("$1,542.44");

console.log("Testing 0 People and Other Category: ($1,299.99, 0 people, books)");
expect(
    NPPC.priceCalc("$1,299.99", "0 people", "books")
).toEqual("$1,364.99");

//Large amount of ppl
console.log("Testing Large Amount of People: ($1,299.99, 1000 people, food)");
expect(
    NPPC.priceCalc("$1,299.99", "1000 people", "food")
).toEqual("$17,922.31");

//Large amount of ppl and big base
console.log("Testing Large Amount of People w/ Large Base: ($1,299,000,000.99, 1000 people, food)");
expect(
    NPPC.priceCalc("$1,299,000,000.99", "1000 people", "food")
).toEqual("$17,908,663,513.65");

//0 ppl and big base
console.log("Testing 0 People w/ Large Base: ($1,299,000,000.99, 0 people, food)");
expect(
    NPPC.priceCalc("$1,299,000,000.99", "0 people", "food")
).toEqual("$1,541,263,501.17");





//Parameter Problem Testing
console.log("Testing Missing 1 Argument: ($1,299.99, food)");
expect(function () {
    NPPC.priceCalc("$1,299.99", "food")
}).toThrow(/Argument Missing/);

console.log("Testing Missing 2 Arguments: (food)");
expect(function () {
    NPPC.priceCalc("food")
}).toThrow(/Argument Missing/);


//Badly Formatted Args
console.log("Testing Badly Formatted Price: ($1,2.99.99, 3 people, food)");
expect(function () {
    NPPC.priceCalc("$1,29.9.99", "3 people", "food")
}).toThrow(/Price Badly Formatted/);

console.log("Testing Badly Formatted People: ($1,299.99, 3.5 people, food)");
expect(function () {
    NPPC.priceCalc("$1,299.99", "3.5 people", "food")
}).toThrow(/People Badly Formatted/);

console.log("Testing Badly Formatted Category: ($1,299.99, 3 people, 2)");
expect(function () {
    NPPC.priceCalc("$1,299.99", "3 people", 2)
}).toThrow(/Category Badly Formatted/);

console.log("Testing Negative Price: ($-1,299.99, 3 people, food)");
expect(function () {
    NPPC.priceCalc("$-1,299.99", "3 people", "food")
}).toThrow(/Price Badly Formatted/);

console.log("Testing Negative People: ($1,299.99, -3 people, food)");
expect(function () {
    NPPC.priceCalc("$1,299.99", "-3 people", "food")
}).toThrow(/People Badly Formatted/);

//Category not all in lower case
console.log("Testing Category Not In Lower Case: ($1,299.99, 3 people, FoOd)");
expect(
    NPPC.priceCalc("$1,299.99", "3 people", "FoOd")
).toEqual("$1,591.58");


//Markup Complexity Testing
console.log("Testing Multiple Categories: ($1,299.99, 3 people, food and drugs)");
expect(
    NPPC.priceCalc("$1,299.99", "3 people", "food and drugs")
).toEqual("$1,693.95");

console.log("Testing Food Category Association pt1: ($1,299.99, 3 people, cookie)");
expect(
    NPPC.priceCalc("$1,299.99", "3 people", "cookie")
).toEqual("$1,591.58");

console.log("Testing Food Category Association pt2: ($1,299.99, 3 people, cookies)");
expect(
    NPPC.priceCalc("$1,299.99", "3 people", "cookies")
).toEqual("$1,591.58");

console.log("Testing Food Category Association pt3: ($1,299.99, 3 people, foods)");
expect(
    NPPC.priceCalc("$1,299.99", "3 people", "foods")
).toEqual("$1,591.58");

console.log("Testing Electronics Category Association pt3: ($1,299.99, 3 people, tv)");
expect(
    NPPC.priceCalc("$1,299.99", "3 people", "tv")
).toEqual("$1,441.43");


console.log('...All Tests Passed !!');