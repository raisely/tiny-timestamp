const assert = require('assert');
const {
	encode,
	decode,
	decodeStamp,
	tinyStamp,
	toISOString,
} = require('./index');

describe('stamp()', () => {
	it('creates unique stamps when called in succession', () => {
		const results = [tinyStamp(), tinyStamp(), tinyStamp(), tinyStamp()];
		const unique = results.filter(
			(r, index) => results.indexOf(r) === index
		);
		assert.deepEqual(results, unique);
	});
	it('creates the same stamp from the same time', () => {
		const time = process.hrtime();
		const stamp1 = tinyStamp({ time });
		const stamp2 = tinyStamp({ time });
		assert.equal(stamp1, stamp2);
	});
	it('creates a short timestamp when using repeatInterval', () => {
		const month = 60 * 60 * 24 * 30;

		const value = tinyStamp({
			time: [1606878505, 533007549],
			repeatInterval: month,
		});
		const decoded = decodeStamp(value);
		const isoString = toISOString(value);
		assert(
			isoString.startsWith('1970-'),
			`${isoString} doesn't start with 1970`
		);
		assert.equal(decoded[0], 2430505);
	});
});

describe('encode', () => {
	it('is reversible', () => {
		assert.equal(decode(encode(5)), 5);
		assert.equal(decode(encode(25)), 25);
		assert.equal(decode(encode(1024)), 1024);
		assert.equal(decode(encode(4096)), 4096);
	});
});

describe('decodeTimestamp', () => {
	it('can decode', () => {
		const time = process.hrtime();
		const value = tinyStamp({ time });
		assert.deepEqual(time, decodeStamp(value));
	});
});

describe('toISOString', () => {
	it('is valid', () => {
		const time = [1606876750, 123451];

		const value = tinyStamp({ time });
		const isoString = toISOString(value);
		assert.equal(isoString, '2020-12-02T02:39:10.000123451');
	});
});
