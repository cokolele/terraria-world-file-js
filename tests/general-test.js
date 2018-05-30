const TerrariaWorldParser = require("../terraria-world-parser.js");

try {

	let world = new TerrariaWorldParser("./worlds/Canvas.wld").Load();
	console.log( Object.keys(world) );

} catch (e) {

	console.log(e.message)
}