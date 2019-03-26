// Functors & Categories

// functor data type: something you can map over. A container which has an interface
// which can be used to apply a function to the values inside it.

// When you see a functor, you should think 'mappable'

// Functor types are usually represented as an object with a .map() method that maps
// from inputs to outputs while preserving structure.

// An array is a good example of a function

// arrays and promises act like functors

// for collections (arrays, streams, etc...) .map() typically iterates over the
// collection and applies a given function to each value in the collection

// promises use .then() instead of .map(). You can think of .then as an
// asynchronous map method, except for when you have a nested promise, which
// automatically unwraps the outer promise

// for values not a promise .then acts as an asynchronous map method

// for promises, .then acts like the .chain() method from monads, sometimes also
// called .bind() or .flatMap()

// so promises are not quite functors and not quite monads, but you can usually treat
// them as either

// using a functor is easy -- just call map()

const f = [1, 2, 3];
f.map(double);

// Functor Laws ----------------------------------------------------

// Categories have two important properties

// 1. Identity
// 2. Composition

// Since a functor is mapping between categories, functors must respect these
// laws

// Identity --------------------------------------------------------

// If the following identity function

x => x;

// is passed into f.map(), where f is any functor, the result should be equivalent to f

// Composition ------------------------------------------------------

// Functors must obey the composition law:

F.map(x => f(g(x)));

// is equivalent to...

F.map(g).map(f);

// Foundation of category theory

// - a category is a collection of objects and arrows between objects

// - arrows are known as morphisms, which can be thought of and represented
//   in code as functions

// - for any group of connected objects, a -> b -> c, there must be a composition
//   that goes from a -> c

// - all arrows can be represented as compositions.  All objects in a category have
//   identity arrows

// say you have a function 'g' that takes an 'a' and returns 'b'
// and a function 'f' that takes a 'b' and returns a 'c'
// there must also be a function 'h' that represents the composition of f and g

// the composition from a -> c is the composition:  f . g (f after g)

// so h(x) = f(g(x))

// function composition works right to left

// composition is associative, meaning you don't need parentheses

// Given a function 'F':

const F = [1, 2, 3];

// the following are equivalent

F.map(x => f(g(x)));

// and

F.map(g).map(f);

// Endofunctors -------------------------------------------------------

// endofunctor: a functor that maps from a category back to the same category

// functor can map from category to category:  X -> Y

// endofunctors map from category to the same category:  X -> X

// Build Your Own Functor --------------------------------------------

// Ex. simple functor

const Identity = value => ({
  map: fn => Identity(fn(value))
});

// As you can see, this satisfies the functor laws:

const trace = x => {
  console.log(x);
  return x;
};

const u = Identity(2);

// Identity law
u.map(trace); // 2
u.map(x => x).map(trace); // 2

// Composition law
const r1 = u.map(x => f(g(x)));
const r2 = u.map(g).map(f);

r1.map(trace); // 5
r2.map(trace); // 5

// make the '+' operator work for number and string values

const Identity = value => ({
  map: fn => Identity(fn(value)),
  valueOf: () => value,
  toString: () => `Identity(${value})`,
  [Symbol.iterator]: function*() {
    yield value;
  }
});

const ints = Identity(2) + Identity(4);
trace(ints); // 6

const hi = Identity("h") + Identity("i");
trace(hi); // 'hi'

// now this will work

const arr = [6, 7, ...Identity(8)];
trace(arr); // [6, 7, 8]

// putting it all together

const Identity = value => ({
  map: fn => Identity(fn(value)),
  valueOf: () => value,
  toString: () => `Identity(${value})`,
  [Symbol.iterator]: function*() {
    yield value;
  },
  constructor: Identity
});

Object.assign(Identity, {
  toString: () => "Identity",
  is: x => typeof x.map === "function"
});

// Why Functors ---------------------------------------------------------

// Functors can be used to implement many useful things in a way that works
// with any type of data

// Ex.
//    - Start a chain of operations only if the value inside the functor is not
//      undefined or null

const exists = x => x.valueOf() !== undefined && x.valueOf() !== null;

const ifExists = x => ({
  map: fn => (exists(x) ? x.map(fn) : x)
});

const add1 = n => n + 1;
const double = n => n * 2;

// Nothing happens...
ifExists(Identity(undefined)).map(trace);
// Still nothing...
ifExists(Identity(null)).map(trace);

// 42
ifExists(Identity(20))
  .map(add1)
  .map(double)
  .map(trace);

// Customize map using curry function

const map = curry((fn, F) => F.map(fn));

const double = n => n * 2;

const mdouble = map(double);
mdouble(Identity(4)).map(trace);

// Functors are things we can map over. More specifically, a functor is a mapping from
// category to category. A functor can even map from a category back to the same category
// (i.e., an endofunctor).
