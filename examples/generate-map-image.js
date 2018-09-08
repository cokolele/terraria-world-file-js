const terrariaWorldParser = require("../terraria-world-parser.js");
const palette = require("./map-image-palette.json");
const pngjs = require('pngjs-image');

try
{
	const world = new terrariaWorldParser("../tests/worlds/Canvas.wld").Load();
	
	const img = pngjs.createImage(world.header.maxTilesX, world.header.maxTilesY);

	const layers = {
		space: 80, //below
		// sky - between
		ground: world.header.worldSurface, //above
		cavern: world.header.rockLayer, //above
		underworld: world.header.maxTilesY - 192, //above
	}

	world.worldTiles.forEach((arrayX, x) => {
		arrayX.forEach((tile, y) => {

			let color;
			if (tile.blockId || tile.blockId == 0) color = palette.tiles[tile.blockId];
			else if (tile.liquid) color = palette.liquids[tile.liquid.type];
			else if (tile.wallId) color = palette.walls[tile.wallId];
			else {

				if (y < layers.space) color = palette.backgrounds.space;
				else if (y >= layers.space && y < layers.ground) color = palette.backgrounds.sky;
				else if (y >= layers.ground && y < layers.cavern) color = palette.backgrounds.ground;
				else if (y >= layers.cavern && y < layers.underworld) color = palette.backgrounds.cavern;
				else if (y >= layers.underworld) color = palette.backgrounds.underworld;
			}

			img.setAt(x, y, color);
		});
	});

	img.writeImage("./map-image.png", function (err) {
		if (err) console.log(err);
		console.log('Written to the file');
	});

}
catch(e)
{
	console.log(e.message);
}