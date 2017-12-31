const TerrariaWorldParser = require("./TerrariaWorldFile.js");
const world = new TerrariaWorldFile("./Canvas.wld");

process.stdout.write('\033c'); //system("cls")
console.log(world.Load());