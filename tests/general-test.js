const terrariaWorldParser = require("../terraria-world-parser.js");

const worlds = ["Canvas", "Doge", "Doge2"];

try
{
	worlds.forEach( map => {
		let world = new terrariaWorldParser("./worlds/" + map + ".wld").Load();
		console.log("\n" + map);
		console.log( Object.keys(world) );
	});
}
catch (e)
{
	console.log(e.message)
}