var expect = require('expect');
var NPPC = require('./NuPackPriceCalculator');



//Tests
console.log("Running Tests");
expect(
    NPPC.priceCalc(0)
).toEqual(0);

expect(function () {
    NPPC.priceCalc(0);
    throw new Error('test');
}).toThrow(/test/);



 //Tests
 
 //3 Provided Examples
 //Leading 0s
 //Trailing 0s
 //no decimal
 //long decimal (what to do? round first maybe?)
 //output has no decimal
 //Each category
 //No category
 //small num
 //big num
 //1 person
 //0 ppl (allowed)
 //big ppl #
 //big num big ppl
 //big decimal big ppl
 //0 w/ big ppl
 //missing args (each, combined, all 3)
 //badly formatted args (each, combined, all 3)
 //negative number (bad arg)
 //negative ppl (bad arg)
 //decimal ppl (bad arg)
 //args out of order (aka bad args)
 //category not lower case
 
 //Multiple markups
 //Pharmaceuticals 1 thing in table
 //Pharma - multiple things in table
 

console.log('Tests Passed!');