# TinyTimstamp

Unique small timestamps.

Handy for cross referencing logs or error reports, especially if your users tend to send you
screenshots and you don't want to be transcribing long codes.

It encodes a timestamp based on `process.hrtime()` to create unique identifiers.
See below for how this is handled

```
npm install tiny-timestamp
```

```javascript
const { decodeStamp, tinyStamp, toISOString } = require('tiny-timestamp');

const value = tinyStamp();
const originalTime = decodeStamp(value);

console.log(value); // '2tLJTc:s9V'
console.log(originalTime); // [ 1606876750, 123451 ]
console.log(toISOString(value)); // '2020-12-02T02:39:10.000123451'

// You can shorten identifiers by setting a repeat interval
// and any precision above that period will be discarded

const month = 60 * 60 * 24 * 30; // in seconds
const shorterValue = tinyStamp({
	repeatableInterval: month,
	time: originalTime,
});
console.log(shorterValue); // -eXc:s9V

// You won't be able to get back the exact original time
console.log(decodeStamp(shorterValue)); // [ 2428750, 123451 ]
console.log(toISOString(shorterValue)); // '1970-01-29T02:39:10.000123451'
```

### Under the hood

`hrtime()` produces a time in nanoseconds, though it's not guaranteed to have
nanosecond precision, the precision should be good enough to give a low likelihood
of collision between two identifiers.

However, because `hrtime()` is calculated in seconds from some arbitrary time, on it's own it
can't produce a good unique identifier. tinyStamp replaces the seconds value from hrtime
with the seconds since the UNIX epoch.

In other words

```
const arbitraryTime = process.hrtime();
const fixedTime = [parseInt(new Date() / 1000), arbitraryTime[1]];
```
