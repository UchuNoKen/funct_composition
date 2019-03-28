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

// Ex.

const x = 20; // Some data of type 'a'
const f = n => n * 2; // A function from 'a' to 'b'
const arr = Array.of(x); // The type lift

// map() applies the function f to the value x, in the context of the array
const result = arr.map(f);

// Array is the context, and x is the value being mapped over

// You can flatten arrays in JS with .concat():

[].concat.apply([], [[1], [2, 3], [4]]); // [1, 2, 3, 4]

// You're Probably Already Using Monads -------------------------------

// Function composition creates function pipelines that data flows through. Put
// some input in the first stage of the pipeline, and some data pops out of the
// last stage of the pipeline, transformed.

// For that to work, each stage of the pipeline must be expecting the data type that
// the previous stage returns

// Composing simple functions is easy, because types all line up easily.
// Match output type b to input type b and all is good

// g:           a => b
// f:                b => c
// h = f(g(a)): a    =>   c

// Composing with functors is also easy if you're mapping because types line up
// Ex. F(a) => F(b)

// g:           F(a) => F(b)
// f:                   F(b) => F(c)
// h = f(g(Fa)): F(a)   =>      F(c)

// But if you want to compose from a => F(b), b => F(c), and so on, you need monads:

// g:                       a => M(b)
// f:                            b => M(c)
// h = composeM(f, g): a         =>   M(c)

// Here, the types don't line up.
// For 'f's' input, we wanted type b, but got M(b)
// composeM() needs to unwrap the M(b) that g returns so it can be passed to f
// this process (often called .bind() or .chain()), is where flatten and map happen
// it unwraps b from M(b) before passing it to the next function

// g:               a => M(b) flattens to => b (happens in)
// f:                                        b                        maps to => M(c)
// h composeM(f, g):
//                  a                    flatten(M(b)) => b => map(b => M(c)) => M(c)

// Monads are needed because lots of functions aren't simple mappings from a => b
// Some functions deal with side effects (promises, streams), handle branching, or exceptions

// Suppose you want to fetch a user from an asynchronous API, and then pass that data
// to another asynchronous API to perform some calculation:

// getUserById(id: String) => Promise(User)
// hasPermission(User) => Promise(Boolean)

// Let's demonstrate the problem.

// First, write the utilities:

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

const trace = label => value => {
  console.log(`${label}: ${value}`);
  return value;
};

// Functions to compose

{
  const label = "API call composition";
  // a => Promise(b)
  const getUserById = id =>
    id === 3 ? Promise.resolve({ name: "Kurt", role: "Author" }) : undefined;
  // b => Promise(c)
  const hasPermission = ({ role }) => Promise.resolve(role === "Author");
  // Try to compose them. Warning: this will fail.
  const authUser = compose(
    hasPermission,
    getUserById
  );
  // Oops! Always false!
  authUser(3).then(trace(label));
}

// When we try to compose hasPermission() with getUserById() to form authUser()
// there is a problem because hasPermission() is expecting a User object and
// getting a Promise(User) instead.

// To fix this, we can swap the compose() for composePromises() - a special version of
// compose that knows it needs to use .then() to accomplish the function composition:

{
  const composeM = chainMethod => (...ms) => ms.reduce((f, g) => x => g(x)[chainMethod](f));
  const composePromises = composeM("then");
  const label = "API call composition";
  // a => Promise(b)
  const getUserById = id =>
    id === 3 ? Promise.resolve({ name: "Kurt", role: "Author" }) : undefined;
  // b => Promise(c)
  const hasPermission = ({ role }) => Promise.resolve(role === "Author");
  // Compose the functions (this works!)
  const authUser = composePromises(hasPermission, getUserById);
  authUser(3).then(trace(label)); // true
}

// What Monads are Made of ------------------------------------------------

// A monad is based on simple symmetry -- A way to wrap a value into a context, and
// a way to unwrap the value from the context:

//  - Lift/Unit: A type lift from some type into the monad context: a => M(a)
//  - Flatten/Join: Unwrapping the type from the context: M(a) => a

// And since monads are also functors, they can also map:

//  - Map: Map with context preserved: M(a) -> M(b)

// ! Combine flatten with map, and you get chain -- function composition for monad-lifting
//   functions, aka Kleisli composition

//  - FlatMap/Chain: Flatten + map: M(M(a)) => M(b)

// If you can lift (aka of / unit) and chain (aka bind / flatMap), you can make .map():

const MyMonad = value => ({
  // insert arbitrary chain here
  map(f) {
    return this.chain(a => this.constructor.of(f(a)));
  }
});

// If you define .of() and .chain()/.join() for the monad, you can infer the definition of .map()

// The lift is the factory/constructor or constructor.of() method. In category theory, its
// called the 'unit'

// All it does is lift the type into the context of the monad. It turns 'a' into a Monad of 'a'

// The flattening process without map in .chain() is usually called flatten() or join()

// Frequently (but not always), flatten()/join() is omitted completely as it is built into
// .chain() / .flatMap()

// Unwrapping + map are both needed to compose a => M(a) functions

// Depending on what kind of monad you’re dealing with, the unwrapping process could be extremely
// simple. In the case of the identity monad, it’s just like .map(), except that you don't
// lift the resulting value back into the monad context. That has the effect of discarding
// one layer of wrapping:

{
  // Identity monad
  const Id = value => ({
    // Functor mapping
    // Preserve the wrapping for .map() by
    // passing the mapped value into the type
    // lift:
    map: f => Id.of(f(value)),
    // Monad chaining
    // Discard one level of wrapping
    // by omitting the .of() type lift:
    chain: f => f(value),
    // Just a convenient way to inspect
    // the values:
    toString: () => `Id(${value})`
  });
  // The type lift for this monad is just
  // a reference to the factory.
  Id.of = Id;
}

// The unwrapping part is also where the weird stuff like side effects, error branching,
// or waiting for async I/O typically hides

// For example, with promises, .chain() called .then(). Calling promise.then(f) won't invoke
// f() right away. Instead, it will wait for the promise to resolve, and then call f()
// (hence the name).

// Ex.

{
  const x = 20; // the value
  const p = Promise.resolve(x); // the context
  const f = n => Promise.resolve(n * 2); // the function

  const result = p.then(f); // the application

  result.then(
    r => console.log(r) // 40
  );
}

// A promise is not strictly a monad. That's because it will only unwrap the outer promise
// if the value is a promise to begin with
// Otherwise .then() behaves like .map()

// Building monadic (Kleisli) composition

const composeM = method => (...ms) => ms.reduce((f, g) => x => g(x)[method](f));

// The algebraic definition of function composition:

{
  // (f ∘ g)(x) = f(g(x))
  const compose = (f, g) => x => f(g(x));
  const x = 20; // The value
  const arr = [x]; // The container
  // Some functions to compose
  const g = n => n + 1;
  const f = n => n * 2;
  // Proof that .map() accomplishes function composition.
  // Chaining calls to map is function composition.
  trace("map composes")([
    arr.map(g).map(f),
    arr.map(
      compose(
        f,
        g
      )
    )
  ]);
  // => [42], [42]
}

// Generalized compose utility for all functors with map() method
const composeMap = (...ms) => ms.reduce((f, g) => x => g(x).map(f));

// Lots of things are asynchronous or lazy, and lots of functions need to handle messy
// things like branching for exceptions or empty values.

// That’s where monads come in. Monads can rely on values that depend on previous asynchronous
// or branching actions in the composition chain. In those cases, you can’t get a simple value
// out for simple function compositions. Your monad-returning actions take the form a => Monad(b)
// instead of a => b.

// Whenever you have a function that takes some data, hits an API, and returns a corresponding
// value, and another function that takes that data, hits another API, and returns the result
// of a computation on that data, you’ll want to compose functions of type a => Monad(b).

// Because the API calls are asynchronous, you'll need to wrap the return values in something
// like a promise or observable.

// The signatures for those functions are a -> Monad(b), and b -> Monad(c), respectively.

// Composing functions of type g: a -> b, f: b -> c is easy because the types line up:
// h: a -> c is just a => f(g(a))

// Composing functions of type g: a -> Monad(b), f: b -> Monad(c) is a little harder:
// h: a -> Monad(c) is not just a => f(g(a))
// because f is expecting b, not Monad(b)

// Compose a pair of async functions that each return a promise:

{
  const label = "Promise composition";

  const g = n => Promise.resolve(n + 1);
  const f = n => Promise.resolve(n * 2);

  const h = composePromises(f, g);

  h(20).then(trace(label));

  // 42
}

// To write composePromises so the result is logged correctly, in the composeMap()
// function change the .map() call to .then().

// Promise.then() is basically an asynchronous .map()

const composePromises = (...ms) => ms.reduce((f, g) => x => g(x).then(f));
const label = "Promise composition";
const g = n => Promise.resolve(n + 1);
const f = n => Promise.resolve(n * 2);
const h = composePromises(f, g);
h(20).then(trace(label));
// Promise composition: 42

// The weird part is that when you hit the second function, f (remember, f after g),
// the input value is a promise. It's not type b, it's type Promise(b), but f takes type b,
// unwrapped. So what's going on?

// nside .then(), there's an unwrapping process that goes from Promise(b) -> b. That operation
// is called join or flatten.

// composeMap() and composePromises() are almost identical functions

// Mix the chain method into a curried function, then use square bracket notation

const composeM = method => (...ms) => ms.reduce((f, g) => x => g(x)[method](f));

// Now we can write specialized implementations like this

const composePromises = composeM("then");
const composeMap = composeM("map");
const composeFlatMap = composeM("flatMap");

// The Monad Laws ---------------------------------------------------------

// There are three rules all monads should satisfy:

//  1. Left identity: unit(x).chain(f) === f(x)
//  2. Right identity: m.chain(unit) === m
//  3. Associativy: m.chain(f).chain(g) === m.chain(x => f(x).chain(g))

// The Identity Laws -------------------------------------------------------

// A monad is a functor.

// A functor is a morphism between categories:  A -> B

// The morphism is represented by an arrow

// Every object in a category has an arrow back to itself, so: X -> X

// Associativity ------------------------------------------------------------

// This means it doesn't matter where we put the parenthesis when we compose

// Just as:  a + (b + c)  =  (a + b) + c

// So does: (f . g) . h  =  f . (g . h)

// Same holds true for Kleisli composition, you just have to read it backwards

// When you see the composition operator (chain), think 'after':

// h(x).chain(x => g(x).chain(f)) ==== (h(x).chain(g)).chain(f)

// Proving the Monad Laws -----------------------------------------------------

// Prove that the identity monad satisfies the monad laws:

{
  // Identity monad
  const Id = value => ({
    // Functor mapping
    // Preserve the wrapping for .map() by
    // passing the mapped value into the type
    // lift:
    map: f => Id.of(f(value)),
    // Monad chaining
    // Discard one level of wrapping
    // by omitting the .of() type lift:
    chain: f => f(value),
    // Just a convenient way to inspect
    // the values:
    toString: () => `Id(${value})`
  });
  // The type lift for this monad is just
  // a reference to the factory.
  Id.of = Id;
  const g = n => Id(n + 1);
  const f = n => Id(n * 2);
  // Left identity
  // unit(x).chain(f) ==== f(x)
  trace("Id monad left identity")([Id(x).chain(f), f(x)]);
  // Id monad left identity: Id(40), Id(40)

  // Right identity
  // m.chain(unit) ==== m
  trace("Id monad right identity")([Id(x).chain(Id.of), Id(x)]);
  // Id monad right identity: Id(20), Id(20)
  // Associativity
  // m.chain(f).chain(g) ====
  // m.chain(x => f(x).chain(g)
  trace("Id monad associativity")([
    Id(x)
      .chain(g)
      .chain(f),
    Id(x).chain(x => g(x).chain(f))
  ]);
  // Id monad associativity: Id(42), Id(42)
}

// Conclusion --------------------------------------------------------

// Monads are a way to compose lifting functions:

// g: a => M(b)
// f: b => M(c)

// To accomplish this, monads must flatten M(b) to b before applying f()

// In other words, functors are things you can map over

// Monads are things you can flatMap over:

// Function map: a => b
// Functors map with context: Functor(a) => Functor(b)
// Monads flatten and map with context: Monad(Monad(a)) => Monad(b)

// Monads are based on simple symmetry:
//  - a way to wrap a value into a context
//  - and a way to unwrap the value from the context
//      lift/unit:     a => M(a)
//      flatten/join:  M(a) => a

// And since monads are also functors, they can also map:
//      Map: Map with context preserved:  M(a) -> M(b)

// Combine flatten with map and you get chain, function composition for lifting functions

//      FlatMap/Chain Flatten + map:  M(M(a)) => M(b)

// Examples of monads in every day JS code include:
//  promises
//  observables

// Kleisli composition allows you to compose your data flow logic without worrying about the
// particulars of the data type’s API, and without worrying about the possible side-effects,
// conditional branching, or other details of the unwrapping computations hidden in the
// chain()operation.

// This makes monads a very powerful tool to simplify your code. You don’t have to understand
// or worry about what’s going on inside monads to reap the simplifying benefits that monads
// can provide, but now that you know more about what’s under the hood, taking a peek under
// the hood isn’t such a scary prospect.
