process.stdout.write('\033c\n'); //system("cls")

const TerrariaWorldParser = require("./terraria-world-parser.js");
const util = require('util')

try {
	const world = new TerrariaWorldParser("./Canvas.wld");
	const data = world.Load();
	console.log(util.inspect(data, false, null))
} catch(e) {
	console.log(e.message);
}