const TerrariaWorldParser = require("../../terraria-world-parser.js");
const palette = require("./palette.json");
const pngjs = require('pngjs-image');

try {
	const world = new TerrariaWorldParser("../../Canvas.wld").Load();
	
	const img = pngjs.createImage(world.header.maxTilesX, world.header.maxTilesY);

	world.worldTiles.forEach((x, xi) => {
		x.forEach((tile, yi) => {

			let color;
			if (tile.blockId || tile.blockId == 0) color = palette.tiles[tile.blockId];
			else if (tile.liquid) color = palette.liquids[tile.liquid.type];
			else if (tile.wallId) color = palette.walls[tile.wallId];
			else {

				if (world.header.maxTilesY == 1800) {
					if (yi < 565) color = palette.backgrounds.sky;
					else if (yi > 1600) color = palette.backgrounds.underworld;
					else color = palette.backgrounds.cavern;
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