// Abstraction -----------------------------------------------------------

// abstraction: the process of considering something independently of its associations,
// attributes, or concrete accompaniments

// !! software solutions should be decomposable into their component parts, and
// recomposable into new solutions, without changing the internal component
// implementation details

// Abstraction is the act of simplification -----------------------------

// The process of abstraction has two main components:

// Generalization: the process of finding similarities (the obvious) in repeated patterns, and
// and hiding similarities behind an abstraction

// Specialization: the process of using the abstraction, supplying only what is different
// (the meaningful) for each use case

// Abstraction is the process of extracting the underlying essence of a concept.

// By exploring common ground between different problems from different domains, we learn how to
// step outside our headspace for a moment and see a problem from a different perspective.

// Abstraction in software --------------------------------------

// abstraction in software takes many forms:
//  - algorithms
//  - data structures
//  - modules
//  - classes
//  - frameworks
//  - and functions

// Functions make great abstractions because they posses the qualities that are
// essential for good abstraction:

// Identity - ability to assign a name to it and reuse it in different contexts

// Composition - The ability to compose simple functions to form more complex functions

// Abstraction through composition --------------------------------------

// pure functions are the most useful for abstraction

// in the function below, you can say that 'f' defines a relationship between 'A' and 'B'

// f: A -> B

// another function 'g', could define a relationship between 'B' and 'C'

// This implies another function 'h', which defines a relationship directly from 'A' to 'C'

// h: A -> C

// Those relationships from the structure of the problem space, and the way
// you compose functions in the application forms the structure of the application

// good abstractions simplify by hiding structure, the same way 'h' reduces
// A -> B -> C
// down to A -> C

// How to do More with Less Code -----------------------------------

// abstraction is the key to doing more with less code

const add = (a, b) => a + b;

// if you use the above function frequently to increment, it might make sense to fix
// one of those numbers

const a = add(1, 1);
const b = add(a, 1);
const c = add(b, 1);

// the add function can be curried

const add = a => b => a + b;

// partial application can then be used, applying the function to its first argument,
// returning a new function that takes the new argument

const inc = add(a);

// now inc can be used instead of add when incrementing by 1 is needed

const a = inc(1);
const b = inc(a);
const c = inc(b);

// map can be written as a curried function

const map = f => arr => arr.map(f);

// this version takes a specializing function and returns a specialized version of itself
// that takes the array to be processed

const f = n => n * 2;

const doubleAll = map(f);
const doubled = doubleAll([1, 2, 3]);

// [2, 4, 6]

// characteristics of good abstractions:

// Simple
// Concise
// Reusable
// Independent
// Decomposable
// Recomposable
