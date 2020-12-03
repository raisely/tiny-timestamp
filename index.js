// https://stackoverflow.com/questions/5405677/good-algorithm-to-convert-timestamp-to-a-shorter-alphanumeric-representation

const charRange = (start, end) =>
	Array.from(Array(end - start), (v, i) => String.fromCharCode(i + start));

const digits = charRange(49, 49 + 9) // 1 to 9
	.concat(['-', '+', '='])
	.concat(charRange(97, 97 + 26)) // a to b
	.concat(charRange(65, 65 + 26)); // A to B

var base = digits.length;

const days = 60 * 60 * 24;

function encode(value) {
	let result = '';
	while (value >= base) {
		result = digits[value % base] + result;
		value = parseInt(value / base);
	}
	result = digits[value] + result;
	return result;
}

function decode(value) {
	let result = 0;
	for (let i = 0; i < value.length; i++) {
		result += digits.indexOf(value[i]) * base ** (value.length - i - 1);
	}
	return result;
}

function tinyStamp(options = {}) {
	let time = options.time;
	if (!time) {
		time = process.hrtime();
		time[0] = parseInt(new Date() / 1000);
	}
	if (options.repeatInterval)
		time = [parseInt(time[0] % options.repeatInterval), time[1]];

	const value = `${encode(time[0])}:${encode(time[1])}`;
	return value;
}

function decodeStamp(stamp) {
	const [seconds, nanos] = stamp.split(':');
	const hrtime = [decode(seconds), decode(nanos)];
	return hrtime;
}

const zeroPad = (val, length = 2) => {
	const str = `${val}`;
	return str.padStart(length, '0');
};

function toISOString(stamp) {
	const decoded = decodeStamp(stamp);
	const now = new Date(0);
	now.setUTCSeconds(decoded[0]);
	return `${now.getUTCFullYear()}-${zeroPad(now.getUTCMonth() + 1)}-${zeroPad(
		now.getUTCDate()
	)}T${zeroPad(now.getUTCHours())}:${zeroPad(
		now.getUTCMinutes(),
		2
	)}:${zeroPad(now.getUTCSeconds(), 2)}.${zeroPad(decoded[1], 9)}`;
}

exports.tinyStamp = tinyStamp;
exports.decodeStamp = decodeStamp;
exports.encode = encode;
exports.decode = decode;
exports.toISOString = toISOString;
