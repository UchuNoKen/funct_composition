// Expressions and Values ------------------------

// expression:  chunk of code that evaluates to a value

// The value of an expression can be given a name

// The expression is evaluated first, then assigned to the name

// const - assigned at declaration, can't be reassigned

// let - allows reassignment, but not redeclaration

// Types -----------------------------

// array: ordered list of values

// literal
[1, 2, 3];

// assignment
const arr = [1, 2, 3];

// object: collection of key:value pairs

// literal
{
  key: "value";
}

// assignment
const foo = { bar: "bar" };

// object property shorthand
const a = "a";
const longhand = { a: a };
const shorthand = { a };

// another shorthand example
const b = "b";
const longWay = { b: b };
const shortWay = { b };

// composing objects into new objects with spread operator
const c = { ...shorthand, ...shortWay };

// Object.assign()
const d = Object.assign({}, shorthand, shortWay);

// Destructuring -------------------------------------------------

// destructuring: extracting values from objs and arrs and assign the values to
//                named variables

// both objects and arrays support destructuring

const [t, u] = ["a", "b"];
t; // 'a'
u; // 'b'

const bleep = {
  blop: "blop"
};

const { blop } = bleep; // same as const blop = bleep.blop;
blop; // 'blop'

// multiple destructuring assignment
const { type, payload } = action;

// same as
const type = action.type;
const payload = action.payload;

// assign a new name
const { blop: bloop } = bleep; // assign bleep.blop as bloop
bloop; // 'blop'

// same as
const bloop = bleep.blop;

// Comparisons and Ternary -----------------------------------------

// === : strict equality
// == : loose equality
// > : greater than
// < : less than
// >= : greater than or equal to
// <= : less than or equal to
// != : not equal
// !== : not strictly equal
// && : logical AND
// || : logical OR

// ternary : as a question using a comparator, evaluate to answer based on the
//           expression is truthy

// Function ------------------------------------------------

// function expression assigned to a name
const double = x => x * 2;

// the value of a function expression is the function itself
double; // [Function: double]

double.toString(); // 'x => x * 2'

// invoking with a call
double(2); // 4

// Signatures -------------------------------------------------

// a function's signature consists of:
//      1. an optional function name
//      2. a list of parameter types, optionally named
//      3. type of the return value

// js figures out the types during runtime

// signature for double()
//   double(x: n) => Number

// Most reusable function composition utilities require you to
// pass functions which share the same type signature.

// Default Parameter Values -------------------------------------

// the following function works like an identity function (returns same value passed in)
const orZero = (n = 0) => n;

// if called with undefined or no argument passed, returns zero by default

// when default values assigned, type inference systems can infer the type of signature
// of your function automatically

// Parameters with defaults don’t count toward the function’s .length property, which will
// throw off utilities such as autocurry which depend on the .length value. Some curry utilities
// (such as lodash/curry) allow you to pass a custom arity to work around this limitation if you
// bump into it.

// Named Arguments --------------------------------------------------

// js functions can take object literals as arguments and use destructuring
// assignment in the parameter signature in order to achieve named arguments equivalent

const createUser = ({ name = "Anonymouse", avatar = "/anonymouse.jpg" }) => ({
  name,
  avatar
});

const george = createUser({
  name: "George",
  avatar: "/emoji.png"
});

george;

// Rest and Spread --------------------------------------------------

// rest : allows for gathering a group of remaining arguments in the function signature

// the below function discards the first arguments, returns the rest as an array
const aTail = (head, ...tail) => tail;
aTail(1, 2, 3); // [2, 3]

// rest gathers individual elements together into an array

// spread spreads the elements from an array to individual elements

const shiftToLast = (head, ...tail) => [...tail, head];
shiftToLast(1, 2, 3); // [2, 3, 1]

// spreads the rest parameters in the returned array

// Currying ---------------------------------------------------------

// A curried function is a function that takes multiple parameters one at a time. It
// takes a parameter, returns a function that takes the next parameter, and so on...

// curry and partial application can be implemented by returning another function

const highpass = cutoff => n => n >= cutoff;
const gt4 = highpass(4);

// read as:
//  'highpass is a function which takes 'cutoff' and returns a function which takes 'n',
//  and returns the result of n >= cutoff

// Autocurry lets you curry functions automatically
const add4 = curry((a, b, c, d) => a + b + c + d);

// usage
add4(1, 2, 3, 4); // 6
add4(1, 2, 3)(4); // 6
add4(1)(2, 3, 4); // 6
add4(1, 2)(3, 4); // 6
add4(1)(2)(3)(4); // 6

// Autocurry implementation
const curry = (f, arr = []) => (...args) =>
  (a => (a.length === f.length ? f(...a) : curry(f, a)))([...arr, ...args]);

// Function Composition ------------------------------------------------

// function composition is the process of passing the return value of one function as an
// argument to another function

f.g; // read "f composed with g"

f(g(x));

// x is evaluated
// g() is applied to x
// f() is applied  to the return value of

// the expression is evaluated before the function is applied
inc(double(2) * double(2)); // 17

// same as inc(4 * 4)

// Arrays --------------------------------------------------------------

const arr = [1, 2, 3];
arr.map(double); // [2, 4, 6]

// double is passed as a value instead of calling it, because .map() returns a new array containing
// the values returned by double()

// arr is not mutated
