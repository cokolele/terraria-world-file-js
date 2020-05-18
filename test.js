const util = require('util');
const terrariaWorldParser = require("./src/node/terraria-world-parser.js");

const dir = "C:/Users/Lukáš/Documents/my games/Terraria/Worlds/";
const maps = [
    "Curious_Fold_of_Lips.wld",
    "crash.wld",
    "Stupid_Zone_of_Eggs.wld",
    "Trashy_Farm_of_Carnage.wld",
    "example_map.wld",
    "Doge2.wld",
    "Canvas.wld"
]

for (map of maps) {
    let world = new terrariaWorldParser(dir + map);
    world = world.parse(["worldTiles"]);
    console.log(map, Object.keys(world).length + "/12");
}



