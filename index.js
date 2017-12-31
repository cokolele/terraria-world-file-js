process.stdout.write('\033c'); //system("cls")

const TerrariaWorldParser = require("./terraria-world-parser.js");
const world = new TerrariaWorldParser("./Canvas.wld");

console.log(world.Load());