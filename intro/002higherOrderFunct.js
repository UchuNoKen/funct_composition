// Higher order function:
//     a function that takes a function as an argument, or
//     returns a function

// this is in contrast to first-order functions, which don't take a function
// as an argument or return a function as output

Array.prototype.map(); // are both higher order functions
Array.prototype.filter();

// Ex.
//      First-order function which filters all the 4-letter words from a list of
//      words

const censor = words => {
  const filtered = [];
  for (let i = 0, { length } = words; i < length; i++) {
    const word = words[i];
    if (word.length !== 4) filtered.push(word);
  }
  return filtered;
};

censor(["oops", "gasp", "shout", "sun"]);

// ["shout", "sun"]

// Ex.
//      First-order function which filters all the words that begin with 's' from a list of
//      words

const startsWithS = words => {
  const filtered = [];
  for (let i = 0, { length } = words; i < length; i++) {
    const word = words[i];
    if (word.startsWith("s")) filtered.push(word);
  }
  return filtered;
};

startsWithS(["oops", "gasp", "shout", "sun"]);

// ["shout", "sun"]

// lots of repeated code, a pattern forming here that could be abstracted into a
// more generalized solution

// abstract interating a list and accumulating a return value using a reducer

const reduce = (reducer, initial, arr) => {
  // shared
  let acc = initial;

  for (let i = 0, { length } = arr; i < length; i++) {
    // specific
    acc = reducer(acc, arr[i]);

    // more shared
  }
  return acc;
};

reduce((acc, curr) => acc + curr, 0, [1, 2, 3]); // 6

// the reduce() implementation function takes:
//      - a reducer function
//      - an initial value for the accumulator
//      - an array of data to iterate over

// for each item in the array, the reducer is called
// passing it the accumulator and the current array element
// the return value is assigned to the accumulator
// once the reducer has been applied to all values in the list
// the accumulated value is returned

// reduce is called, and passed the function, (acc, curr) => acc + curr
// adds the accumulator and the current value and returns a new accumulated value
// next, the initial value of 0 is passed in
// and finally the data to iterate over

// more generalized filter() implementation

const filter = (fn, arr) => reduce((acc, curr) => (fn(curr) ? acc.concat([curr]) : acc), [], arr);

// the only thing not shared is the fn() predicate

// fn() is called with the current value, and if fn(curr) returns true, curr value is
// concated to the acccumulator array
// otherwise the accumulator value is returned

// now implement censor() with filter()
const censor = words => filter(word => word.length != 4, words);
