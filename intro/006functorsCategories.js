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

// foundation of category theory

// - a category is a collection of objects and arrows between objects

// - arrows are known as morphisms, which can be thought of and represented
//   in code as functions

// - for any group of connected objects, a -> b -> c, there must be a composition
//   that goes from a -> c
