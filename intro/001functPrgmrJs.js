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

// assign a new name
const { blop: bloop } = bleep;
bloop; // 'blop'
