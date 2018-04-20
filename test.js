const TerrariaWorldParser = require("./terraria-world-parser.js");

try {

	let world = new TerrariaWorldParser("./Doge.wld").Load();

	console.log(world.header);

} catch (e) {
	console.log(e.message)
}