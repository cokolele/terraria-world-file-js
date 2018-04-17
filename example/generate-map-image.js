const TerrariaWorldParser = require("../terraria-world-parser.js");
const pallete = require("./pallete.js");
const pngjs = require('pngjs-image');

try {
	const world = new TerrariaWorldParser("../Canvas.wld").Load();
	
	const img = pngjs.createImage(world.header.maxTilesX, world.header.maxTilesY);

	world.worldTiles.forEach((x, xi) => {
		x.forEach((tile, yi) => {

			let color;
			if (tile.blockId || tile.blockId == 0) color = pallete.tiles[tile.blockId];
			else if (tile.liquid) color = pallete.liquids[tile.liquid.type];
			else if (tile.wallId) color = pallete.walls[tile.wallId];
			else {

				if (world.header.maxTilesY == 1800) {
					if (yi < 565) color = pallete.backgrounds["sky"];
					else if (yi > 1600) color = pallete.backgrounds["underworld"];
					else color = pallete.backgrounds["cavern"];
				}
			}

			img.setAt(xi, yi, color);
		});
	});

	img.writeImage("./img.png", function (err) {
		if (err) console.log(err);
		console.log('Written to the file');
	});

} catch(e) {
	console.log(e.message);
}