import terrariaFileParser from "./utils/terraria-file-parser.js";
import TerrariaWorldParserError from "./utils/terraria-world-parser-error.js";

import pako from "pako";

export default class terrariaWorldParser extends terrariaFileParser {
    constructor() {
        super();
    }

    async loadFile(file) {
        try {
            await super.loadFile(file);
        } catch(e) {
            throw new TerrariaWorldParserError("Problem with loading the file", e);
        }

        return this;
    }

    parse(options) {
        let data = {};

        data.version        = this.readInt32();
        data.magicNumber    = this.readString(7);
        data.fileType       = this.readUInt8();
        data.revision       = this.readUInt32();
        data.favorite       = this.readBoolean();
        this.skipBytes(7);

        data.mapName = this.readString();
        data.worldId = this.readInt32();
        data.maxTilesX = this.readInt32();
        data.maxTilesY = this.readInt32();

        data.tilesCount = this.readInt16();
        data.wallsCount = this.readInt16();
        data.liquidsCount = this.readInt16();
        data.skyGradientsCount = this.readInt16();
        data.dirtGradientsCount = this.readInt16();
        data.rockGradientsCount = this.readInt16();

        data.tileHasOptions = this.parseBitsByte(data.tilesCount);
        data.wallHasOptions = this.parseBitsByte(data.wallsCount);

        data.tileOptionsCount = data.tileHasOptions.map(has => has ? this.readUInt8() : 1);
        data.wallOptionsCount = data.wallHasOptions.map(has => has ? this.readUInt8() : 1);

        data.tileOptionsCountSum = data.tileOptionsCount.reduce((a, b) => a + b, 0);
        data.wallOptionsCountSum = data.wallOptionsCount.reduce((a, b) => a + b, 0);

        data.tilesCountEnd          = 1 + data.tileOptionsCountSum;
        data.wallsCountEnd          = data.tilesCountEnd + data.wallOptionsCountSum;
        data.liquidsCountEnd        = data.wallsCountEnd + data.liquidsCount;
        data.skyGradientsCountEnd   = data.liquidsCountEnd + data.skyGradientsCount;
        data.dirtGradientsCountEnd  = data.skyGradientsCountEnd + data.dirtGradientsCount;
        data.rockGradientsCountEnd  = data.dirtGradientsCountEnd + data.rockGradientsCount;
        data.colorsEnd              = data.rockGradientsCountEnd + 1;

        try {
            this.buffer = new DataView(pako.deflate(this.buffer.buffer.slice(this.offset)));
            this.offset = 0;

            data.grid = []
            for (let y = 0; y < data.maxTilesX; y++) {

                data.grid[y] = [];
                for (let x = 0; x < data.maxTilesX; x++) {
                    const flags1 = this.readUInt8();
                    const flags2 = flags1 & 0b1110 >> 1;
                    const paint = ((flags1 & 1 && this.readUInt8()) >> 1) & 31;

                    let type = 0;
                    if ([1,2,7].includes(flags2)) {
                        if (flags1 & 16)
                            type = this.readUInt8();
                        else
                            type = this.readUInt16();
                    }

                    let lightning = flags1 & 32 ? this.readUInt8() : 255;

                    let RLE = 0;
                    switch (flags1 & 192 >> 6) {
                        case 1:
                            RLE = this.readUInt8();
                            break;
                        case 2:
                            RLE = this.readInt16();
                            break;
                    }

                    switch (flags2) {
                        case 0:
                            x += RLE;
                            break;
                        case 1:
                            type += 1;
                            break;
                        case 2:
                            type += data.tilesCountEnd;
                            break;
                        case 3:
                        case 4:
                        case 5:
                            type += data.wallsCountEnd + flags2 - 3;
                            break;
                        case 6:
                            if (y < 400) {
                                const gradient = skyGradientsCount * (y/400);
                                type += data.liquidsCountEnd + gradient;
                            }
                            else
                                type += data.colorsEnd;
                            break
                        case 7:
                            type += y < 700 ? data.dirtGradientsCountEnd : data.skyGradientsCountEnd;
                            break
                    }

                    grid[y][x] = [type, lightning, paint];

                    if (lightning == 255) {
                        const previousGrid = grid[y][x];
                        for (let i = 0; i < RLE; i++)
                            grid[++x][y] = previousGrid;
                        continue;
                    }

                    for (let i = 0; i < RLE; i++)
                        grid[++x][y] = [type, this.readUInt8(), paint];
                }
            }

        } catch (e) {
            throw new TerrariaWorldParserError("Problem with decompressing the file (pako lib)", new Error(e));
        }

        return data;
    }
}