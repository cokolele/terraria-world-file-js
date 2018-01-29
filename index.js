process.stdout.write('\033c\n'); //system("cls")

const TerrariaWorldParser = require("./terraria-world-parser.js");

try {
	const world = new TerrariaWorldParser("./Canvas.wld");
	const data = world.Load();
	console.log(data)
} catch(e) {
	console.log(e.message);
}