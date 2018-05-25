const TerrariaWorldParser = require("../terraria-world-parser.js");
const fs = require('fs');

class Stopwatch {
	constructor() {
		this.start = new Date().getTime();
	}

	Stop() {
		this.stop = new Date().getTime();
		return this.stop - this.start;
	}
}

//old 505.35 ms
//new 503.89 ms nice

for (let i = 0; i<100; i++) {

	let stopwatch;

	try {

		stopwatch = new Stopwatch();

		let world = new TerrariaWorldParser("../d.wld").Load();
	} catch (e) {
		console.log(e.message)
	} finally {

		let ms = stopwatch.Stop();

		fs.appendFileSync("./loading-times.txt", ms + "\n");
	}
}