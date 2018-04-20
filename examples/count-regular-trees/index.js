const TerrariaWorldParser = require("../../terraria-world-parser.js");

try {

	let world = new TerrariaWorldParser("../../Canvas.wld").Load();

	let treeCount = 0;
	const treeBaseFrames = {
		x: [0, 22, 44, 66, 88],
		y: [132, 154, 176]
	};

	world.worldTiles.forEach((x, xi) => {
		x.forEach((tile, yi) => {

			if (tile.blockId == 5)
				if (treeBaseFrames.x.includes(tile.frameX) && treeBaseFrames.y.includes(tile.frameY))
					treeCount++;
		});
	});

	console.log(`This map contains ${treeCount} regular trees`);

} catch (e) {
	console.log(e.message)
}