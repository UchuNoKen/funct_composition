// What is a curried function?

// - a curried function is a function that takes multiple arguments one at a time

// curry with two parameters
const add = a => b => a + b;

const result = add(2)(3); // 5

// takes a, returns a new function
// new function takes b, returns a + b

// add takes one arg, then returns a partial application of itself with
// a in the fixed closure scope

// above, add is invoked with 2, which returns a partially applied function with a
// fixed to 2

// the retuned function is immediately invoked by passing 3 to it in parentheses

// application is completed, returns 5

// What is partial application ---------------------------------------

// partial application: a function which has been applied to some, but not yet
// all of its arguments

// a function with some of its parameters fixed is said to be partially applied

// What's the difference ---------------------------------------------

// partial applications can take as many or as few arguments a time as desired
// curried functions always return a unary function: (takes one argument)

// all curried applications return partial applications
// but not all partial applications are the result of curried functions

// the unary requirement for curried functions is an important feature

// What is point-free style -------------------------------------------

// point-free style is a style of programming where function definitions do not
// make reference to the function's arguments, generally created by calling a
// function that returns a function

// can't use the function keyword or the arrow function because they require
// formal parameters to be declared (which references its arguments)

// create a function with point-free style that increments by one

const inc = add(1);
inc(3); // 4

// the returned function is just a specialized version of the add function

// add() can be used to create many specialized versions

const inc10 = add(10);
const inc20 = add(20);

inc10(3); // => 13
inc20(3); // => 23

// due to closure scopes, the original inc() keeps working

inc(3); // 4

// the a parameter inside add() gets fixed to 1 in the returned function assigned to inc()

// inc(3) is called, the b parameter inside add() is replaced with the argument value, 3

// the application completes returning the sum of 1 and 3

// All curried functions are a form of higher order function which allows you to
// create specialized versions of the original function for the specific use case

// Why do we curry ----------------------------------------------

// curried functions are useful in the context of function of composition

const g = n => n + 1;
const f = n => n * 2;

const h = x => f(g(x));

h(20); // 42

// algebra definiton:

f.g = f(g(x));

// js translation
const compose = (f, g) => x => f(g(x));

// this allows composing only two functions at a time

// algebra allows for
f.g.h;

// write a function to compose as many function as desired
const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

// This version takes any number of functions and returns a function which takes the initial
// value, and then uses reduceRight() to iterate right-to-left over each function, f, in fns,
// and apply it in turn to the accumulated value, y. What we're accumulating with the accumulator,
// y in this function is the return value for the function returned by compose().

// now the composition can be written as:

const g = n => n + 1;
const f = n => n * 2;

const h = compose(
  f,
  g
);

h(20); // 42

// Trace ----------------------------------------------------------

// trace() is a handy utility that will inspect the values between functions

const trace = label => value => {
  console.log(`${label}: $ { value }`);
  return value;
};

// now the pipeline can be inspected

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);
const trace = label => value => {
  console.log(`${label}: ${value}`);
  return value;
};
const g = n => n + 1;
const f = n => n * 2;
/*
Note: function application order is
bottom-to-top:
*/
const h = compose(
  trace("after f"),
  f,
  trace("after g"),
  g
);
h(20);
/*
after g: 21
after f: 42
*/

// compose() is a great utility, but when more than two functions need composing,
// it would help to be able to read them in top-to-bottom order

// This can be done by reversing the order the function are called

// pipe() composes in reverse order

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

// rewrite the pipeline using trace()

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
const trace = label => value => {
  console.log(`${label}: ${value}`);
  return value;
};
const g = n => n + 1;
const f = n => n * 2;
/*
Now the function application order
runs top-to-bottom:
*/
const h = pipe(
  g,
  trace("after g"),
  f,
  trace("after f")
);
h(20);
/*
after g: 21
after f: 42
*/

// Currying and Function composition together ---------------------------

// a curried version of map() can be specialized to do many different things:

const map = fn => mappable => mappable.map(fn);
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
const log = (...args) => console.log(...args);
const arr = [1, 2, 3, 4];
const isEven = n => n % 2 === 0;
const stripe = n => (isEven(n) ? "dark" : "light");
const stripeAll = map(stripe);
const striped = stripeAll(arr);
log(striped);
// => ["light", "dark", "light", "dark"]
const double = n => n * 2;
const doubleAll = map(double);
const doubled = doubleAll(arr);
log(doubled);
// => [2, 4, 6, 8]

// the real power of curried functions is that they simplify function composition

// a function can take any number of inputs, but can only return a single output

// in order to be composable, the output type must align with the expected input type

// trace() defines two parameters, but takes them one at a time, allowing us to specialize
// the function inline. If trace() were not curried, we couldn't use it in this way. We'd
// have to write the pipeline like this:

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
const trace = (label, value) => {
  console.log(`${label}: ${value}`);
  return value;
};
const g = n => n + 1;
const f = n => n * 2;
const h = pipe(
  g,
  // the trace() calls are no longer point-free,
  // introducing the intermediary variable, `x`.
  x => trace("after g", x),
  f,
  x => trace("after f", x)
);
h(20);

// You also need to ensure that the function is expecting parameters in the correct order to
// specialize them. Look what happens if we curry trace() again, but flip the parameter order:

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
const trace = value => label => {
  console.log(`${label}: ${value}`);
  return value;
};
const g = n => n + 1;
const f = n => n * 2;
const h = pipe(
  g,
  // the trace() calls can't be point-free,
  // because arguments are expected in the wrong order.
  x => trace(x)("after g"),
  f,
  x => trace(x)("after f")
);
h(20);

// If you’re in a pinch, you can fix that problem with a function called flip(), which simply
// flips the order of two parameters:

const flip = fn => a => b => fn(b)(a);

// create flippedTrace() function

const flippedTrace = flip(trace);

// using flippedTrace

const flip = fn => a => b => fn(b)(a);
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
const trace = value => label => {
  console.log(`${label}: ${value}`);
  return value;
};
const flippedTrace = flip(trace);
const g = n => n + 1;
const f = n => n * 2;
const h = pipe(
  g,
  flippedTrace("after g"),
  f,
  flippedTrace("after f")
);
h(20);

// The correct way, called “data last”, which means that you should take the specializing
// parameters first, and take the data the function will act on last.

// Each application of trace() to a label creates a specialized version of the trace function
// that is used in the pipeline, where the label is fixed inside the returned partial application
// of trace. So this:

const trace = label => value => {
  console.log(`${label}: ${value}`);
  return value;
};
const traceAfterG = trace("after g");

// is equivalent to this:

const traceAfterG = value => {
  const label = "after g";
  console.log(`${label}: ${value}`);
  return value;
};

// 'data last' functions are convenient for function composition, because they can
// be easily used in point-free style
