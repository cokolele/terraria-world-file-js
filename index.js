const TerrariaWorldParser = require("./terraria-world-parser.js");
const world = new TerrariaWorldParser("./Canvas.wld");

process.stdout.write('\033c'); //system("cls")
console.log(world.Load());