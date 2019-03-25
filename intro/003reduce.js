// reduce()
// aka: fold, accumulate

// iterate over a list
// applying a function to an accumulated value and the next item in the list
// until iteration is complete, and the accumulated value is returned

// takes a reducer function, and an initial value
// returns the accumulated value

Array.prototype.reduce(); // initial list provided by 'this'

// array.reduce(
//     reducer: (accumulator: any, current: Any) => Any, current: Any) => Any,
//     initialValue: Any
// ) => accumulator: Any

// the reducer's job is to "fold" the current value into the accumulated value

// the reducer returns the new accumulated value, and reduce() moves on to the next
// value in the array

// an initial value may be needed, but in this case it's zero

[2, 4, 6].reduce((acc, n) => acc + n, 0); // 12

// first time the reducer is called, acc starts at 0
// reducer returns 0 + 2
// next call, acc = 2, n = 4
// reducer returns 2 + 4
// last call, acc = 6, n = 6
// reducer returns 12
// since iteration is finished, reduce() returns 12

// abstracting a summing reducer
const summingReducer = (acc, n) => acc + n;

[2, 4, 6].reduce(summingReducer, 0);

// Reduce is Versatile -------------------------------------------------
