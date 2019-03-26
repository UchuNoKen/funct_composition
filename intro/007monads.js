// JavaScript monads made simple

// monad - a way of composing function that require context in addition to the return value
//         monads 'type lift', 'flatten', and 'map'
//         so that the types line up for lifting functions
//         making them composable.

// It's a mapping from some type 'a' to some type 'b' along with some computational text,
// hidden in the implementation details of lift, flatten, and map:

// Functions map: a => b

// Functors map with context: Functor(a) => Functor(b)

// Monads flatten and map with context: Monad(Monad(a)) => Monad(b)

// Map: means to apply a function to an 'a' and return a 'b'. Given some input, return an output

// Context: the computational detail of the monad's composition. The Functor/Monad API and its
//   workings supply the context which allows for composing the monad
//   observables on the left? observables on the right. Observable(a) => Observable(b)
//   arrays on the left? arrays on the right.  Array(a) => Array(b)

// Type lift: to lift a type into a context, providing the value with an API that can be
//   used to compute from that value, trigger contextual computations, etc... a => F(a)

// Flatten: to unwrap the value from the context.  F(a) => a
