import terrariaWorldParser from "../src/browser/terraria-world-parser.js";
import palette from "./tile-colors.json";
//import "@babel/polyfill";

document.querySelector("button").addEventListener("click", async () => {

    let canvas = document.getElementById("Canvas");
    let context = canvas.getContext("2d");
    context.font = "20px Arial";

    context.fillText("Wait a few seconds", 10, 50);

    const file = document.getElementsByTagName("input")[0].files[0];
    let world = await new terrariaWorldParser().loadFile(file);
    world = world.parse(["header", "worldtiles"], (percentVal) => {
        console.log(percentVal + "%");
    });

    console.log("rendering");

    const layers = {
        space: 80, // below
        // sky - betweens
        ground: world.header.worldSurface, //above
        cavern: world.header.rockLayer, //above
        underworld: world.header.maxTilesY - 192, //above
    };

    let img = context.createImageData(world.header.maxTilesX, world.header.maxTilesY);

    canvas.width = world.header.maxTilesX;
    canvas.height = world.header.maxTilesY;

    let position = 0;
    for (let y = 0; y < world.header.maxTilesY; y++) {
        for (let x = 0; x < world.header.maxTilesX; x++) {

            let color;
            if (world.worldTiles[x][y].blockId || world.worldTiles[x][y].blockId == 0)  color = palette.tiles[world.worldTiles[x][y].blockId];
            else if (world.worldTiles[x][y].liquid)                                     color = palette.liquids[world.worldTiles[x][y].liquid.type];
            else if (world.worldTiles[x][y].wallId)                                     color = palette.walls[world.worldTiles[x][y].wallId];
            else {
                if (y < layers.space)                                                   color = palette.backgrounds.space;
                else if (y >= layers.space && y < layers.ground)                        color = palette.backgrounds.sky;
                else if (y >= layers.ground && y < layers.cavern)                       color = palette.backgrounds.ground;
                else if (y >= layers.cavern && y < layers.underworld)                   color = palette.backgrounds.cavern;
                else if (y >= layers.underworld)                                        color = palette.backgrounds.underworld;
            }

            img.data[position + 0] = color.red;
            img.data[position + 1] = color.green;
            img.data[position + 2] = color.blue;
            img.data[position + 3] = color.alpha;

            position += 4;
        }
    }

    context.putImageData( img, 0, 0 );
});