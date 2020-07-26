const terrariaFileParser = require("./utils/terraria-file-parser.js");
const TerrariaWorldParserError = require("./utils/terraria-world-parser-error.js");

module.exports = class terrariaWorldParser extends terrariaFileParser {
    constructor() {
        super();
    }

    loadFileSync(file) {
        try {
            super.loadFileSync(file);
        } catch(e) {
            throw new TerrariaWorldParserError("Problem with loading the file", e);
        }

        return this;
    }

    async loadFile(file) {
        try {
            await super.loadFile(file);
        } catch(e) {
            throw new TerrariaWorldParserError("Problem with loading the file", e);
        }

        return this;
    }

    loadBuffer(buffer) {
        try {
            super.loadBuffer(buffer);
        } catch(e) {
            throw new TerrariaWorldParserError("Problem with loading the buffer", e);
        }

        return this;
    }

    parse(options) {
        const sections = {
            fileFormatHeader:       this.parseFileFormatHeader,
            header:                 this.parseHeader,
            tiles:                  this.parseWorldTiles,
            chests:                 this.parseChests,
            signs:                  this.parseSigns,
            NPCs:                   this.parseNPCs,
            tileEntities:           this.parseTileEntities,
            weightedPressurePlates: this.parseWeightedPressurePlates,
            rooms:                  this.parseTownManager,
            bestiary:               this.parseBestiary,
            creativePowers:         this.parseCreativePowers,
            footer:                 this.parseFooter
        }

        this.options = {
            ...this.options,
            sections: Object.keys(sections),
            progressCallback: undefined,
            ignorePointers: false,
            ...options,
        };
        this.options.sections = this.options.sections.map(section => section.toLowerCase());

        if (this.options.progressCallback) {
            const onePercentSize = Math.floor(this.buffer.byteLength / 100);
            let nextPercentSize = onePercentSize;
            let percent = 0;

            let _offset = this.offset;
            Object.defineProperty(this, "offset", {
                get: () => _offset,
                set: (value) => {
                    _offset = value;
                    if (_offset >= nextPercentSize){
                        percent++;
                        nextPercentSize += onePercentSize;
                        this.options.progressCallback(percent);
                    }
                }
            });
        }

        let data = {};

        try {
            this.world = this.parseNecessaryData();
            if (this.options.sections.includes("necessary"))
                data.necessary = this.world;

            if (this.world.version < 225) {
                delete sections.bestiary;
                delete sections.creativePowers;
            }

            for (let [sectionName, parseFunction] of Object.entries(sections)) {
                if (this.options.sections.includes( sectionName.toLowerCase() )) {
                    const sectionIndex = Object.keys(sections).indexOf(sectionName);

                    this.offset = this.world.pointers[sectionIndex];
                    data[sectionName] = parseFunction.call(this);

                    if (!this.options.ignorePointers && this.offset != this.world.pointers[sectionIndex + 1] && this.offset != this.buffer.byteLength)
                        throw new Error("Bad " + sectionName + " section end offset");
                }
            }
        } catch(e) {
            throw new TerrariaWorldParserError("Problem with parsing the file", e);
        }

        return data;
    }

    parseNecessaryData() {
        let version, magicNumber, fileType, pointers, importants, height, width;

        this.offset = 0;

        try {
            version = this.readInt32();
            magicNumber = this.readString(7);
            fileType = this.readUInt8();
            this.skipBytes(12);
            pointers = [0];
            for (let i = this.readInt16(); i > 0; i--)
                pointers.push(this.readInt32());
            importants = this.parseBitsByte(this.readInt16());
            this.readString();
            this.readString();
            this.skipBytes(44);
            height = this.readInt32();
            width = this.readInt32();
        } catch(e) {
            throw new Error("Invalid file type");
        }

        this.offset = 0;

        if (magicNumber != "relogic" || fileType != 2)
            throw new Error("Invalid file type");

        if (version < 194)
            throw new Error("Map version is older than 1.3.5.3 and cannot be parsed");

        return {
            version,
            pointers,
            importants,
            width,
            height
        };
    }

    parseFileFormatHeader() {
        let data = {};

        data.version        = this.readInt32();
        data.magicNumber    = this.readString(7);
        data.fileType       = this.readUInt8();
        data.revision       = this.readUInt32();
        data.favorite       = this.readBoolean();
        this.skipBytes(7);
        data.pointers       = [];
        for (let i = this.readInt16(); i > 0; i--)
            data.pointers.push(this.readInt32());
        data.importants     = this.parseBitsByte(this.readInt16());

        return data;
    }

    parseHeader() {
        let data = {};

        data.mapName                = this.readString();
        data.seedText               = this.readString();
        data.worldGeneratorVersion  = this.readBytes(8);
        data.guid                   = this.readBytes(16);
        data.worldId                = this.readInt32();
        data.leftWorld              = this.readInt32();
        data.rightWorld             = this.readInt32();
        data.topWorld               = this.readInt32();
        data.bottomWorld            = this.readInt32();
        data.maxTilesY              = this.readInt32();
        data.maxTilesX              = this.readInt32();
        if (this.world.version >= 225) {
            data.gameMode           = this.readInt32();
            data.drunkWorld         = this.readBoolean();

            if (this.world.version >= 227)
                data.getGoodWorld   = this.readBoolean();
        } else {
            data.expertMode             = this.readBoolean();
        }
        data.creationTime           = this.readBytes(8);
        data.moonType               = this.readUInt8();

        data.treeX = [];
        data.treeX[0]               = this.readInt32();
        data.treeX[1]               = this.readInt32();
        data.treeX[2]               = this.readInt32();

        data.treeStyle = [];
        data.treeStyle[0]           = this.readInt32();
        data.treeStyle[1]           = this.readInt32();
        data.treeStyle[2]           = this.readInt32();
        data.treeStyle[3]           = this.readInt32();

        data.caveBackX = [];
        data.caveBackX[0]           = this.readInt32();
        data.caveBackX[1]           = this.readInt32();
        data.caveBackX[2]           = this.readInt32();

        data.caveBackStyle = [];
        data.caveBackStyle[0]       = this.readInt32();
        data.caveBackStyle[1]       = this.readInt32();
        data.caveBackStyle[2]       = this.readInt32();
        data.caveBackStyle[3]       = this.readInt32();

        data.iceBackStyle           = this.readInt32();
        data.jungleBackStyle        = this.readInt32();
        data.hellBackStyle          = this.readInt32();
        data.spawnTileX             = this.readInt32();
        data.spawnTileY             = this.readInt32();
        data.worldSurface           = this.readFloat64();
        data.rockLayer              = this.readFloat64();
        data.tempTime               = this.readFloat64();
        data.tempDayTime            = this.readBoolean();
        data.tempMoonPhase          = this.readInt32();
        data.tempBloodMoon          = this.readBoolean();
        data.tempEclipse            = this.readBoolean();
        data.dungeonX               = this.readInt32();
        data.dungeonY               = this.readInt32();
        data.crimson                = this.readBoolean();
        data.downedBoss1            = this.readBoolean();
        data.downedBoss2            = this.readBoolean();
        data.downedBoss3            = this.readBoolean();
        data.downedQueenBee         = this.readBoolean();
        data.downedMechBoss1        = this.readBoolean();
        data.downedMechBoss2        = this.readBoolean();
        data.downedMechBoss3        = this.readBoolean();
        data.downedMechBossAny      = this.readBoolean();
        data.downedPlantBoss        = this.readBoolean();
        data.downedGolemBoss        = this.readBoolean();
        data.downedSlimeKing        = this.readBoolean();
        data.savedGoblin            = this.readBoolean();
        data.savedWizard            = this.readBoolean();
        data.savedMech              = this.readBoolean();
        data.downedGoblins          = this.readBoolean();
        data.downedClown            = this.readBoolean();
        data.downedFrost            = this.readBoolean();
        data.downedPirates          = this.readBoolean();
        data.shadowOrbSmashed       = this.readBoolean();
        data.spawnMeteor            = this.readBoolean();
        data.shadowOrbCount         = this.readUInt8();
        data.altarCount             = this.readInt32();
        data.hardMode               = this.readBoolean();
        data.invasionDelay          = this.readInt32();
        data.invasionSize           = this.readInt32();
        data.invasionType           = this.readInt32();
        data.invasionX              = this.readFloat64();
        data.slimeRainTime          = this.readFloat64();
        data.sundialCooldown        = this.readUInt8();
        data.tempRaining            = this.readBoolean();
        data.tempRainTime           = this.readInt32();
        data.tempMaxRain            = this.readFloat32();
        data.oreTier1               = this.readInt32();
        data.oreTier2               = this.readInt32();
        data.oreTier3               = this.readInt32();
        data.setBG0                 = this.readUInt8();
        data.setBG1                 = this.readUInt8();
        data.setBG2                 = this.readUInt8();
        data.setBG3                 = this.readUInt8();
        data.setBG4                 = this.readUInt8();
        data.setBG5                 = this.readUInt8();
        data.setBG6                 = this.readUInt8();
        data.setBG7                 = this.readUInt8();
        data.cloudBGActive          = this.readInt32();
        data.numClouds              = this.readInt16();
        data.windSpeed              = this.readFloat32();

        data.anglerWhoFinishedToday = [];
        for (let i = this.readInt32(); i > 0; --i)
            data.anglerWhoFinishedToday.push(this.readString());

        data.savedAngler            = this.readBoolean();
        data.anglerQuest            = this.readInt32();
        data.savedStylist           = this.readBoolean();
        data.savedTaxCollector      = this.readBoolean();
        if (this.world.version >= 225)
            data.savedGolfer        = this.readBoolean();

        data.invasionSizeStart      = this.readInt32();
        data.tempCultistDelay       = this.readInt32();

        data.killCount = [];
        for (let i = this.readInt16(); i > 0; i--)
            data.killCount.push(this.readInt32());

        data.fastForwardTime        = this.readBoolean();
        data.downedFishron          = this.readBoolean();
        data.downedMartians         = this.readBoolean();
        data.downedAncientCultist   = this.readBoolean();
        data.downedMoonlord         = this.readBoolean();
        data.downedHalloweenKing    = this.readBoolean();
        data.downedHalloweenTree    = this.readBoolean();
        data.downedChristmasIceQueen = this.readBoolean();
        data.downedChristmasSantank = this.readBoolean();
        data.downedChristmasTree    = this.readBoolean();
        data.downedTowerSolar       = this.readBoolean();
        data.downedTowerVortex      = this.readBoolean();
        data.downedTowerNebula      = this.readBoolean();
        data.downedTowerStardust    = this.readBoolean();
        data.TowerActiveSolar       = this.readBoolean();
        data.TowerActiveVortex      = this.readBoolean();
        data.TowerActiveNebula      = this.readBoolean();
        data.TowerActiveStardust    = this.readBoolean();
        data.LunarApocalypseIsUp    = this.readBoolean();
        data.tempPartyManual        = this.readBoolean();
        data.tempPartyGenuine       = this.readBoolean();
        data.tempPartyCooldown      = this.readInt32();

        data.tempPartyCelebratingNPCs = [];
        for (let i = this.readInt32(); i > 0; i--)
            data.tempPartyCelebratingNPCs.push(this.readInt32());

        data.Temp_Sandstorm_Happening       = this.readBoolean();
        data.Temp_Sandstorm_TimeLeft        = this.readInt32();
        data.Temp_Sandstorm_Severity        = this.readFloat32();
        data.Temp_Sandstorm_IntendedSeverity = this.readFloat32();
        data.savedBartender                 = this.readBoolean();
        data.DD2Event_DownedInvasionT1      = this.readBoolean();
        data.DD2Event_DownedInvasionT2      = this.readBoolean();
        data.DD2Event_DownedInvasionT3      = this.readBoolean();

        if (this.world.version >= 225) {
            data.setBG8 = this.readUInt8();
            data.setBG9 = this.readUInt8();
            data.setBG10 = this.readUInt8();
            data.setBG11 = this.readUInt8();
            data.setBG12 = this.readUInt8();

            data.combatBookWasUsed = this.readBoolean();
            data.lanternNightCooldown = this.readInt32();
            data.lanternNightGenuine = this.readBoolean();
            data.lanternNightManual = this.readBoolean();
            data.lanternNightNextNightIsGenuine = this.readBoolean();

            data.treeTopsVariations = [];
            for (let i = this.readInt32(); i > 0; i--)
                data.treeTopsVariations.push(this.readInt32());

            data.forceHalloweenForToday = this.readBoolean();
            data.forceXMasForToday = this.readBoolean();

            data.savedOreTierCopper = this.readInt32();
            data.savedOreTierIron = this.readInt32();
            data.savedOreTierSilver = this.readInt32();
            data.savedOreTierGold = this.readInt32();

            data.boughtCat = this.readBoolean();
            data.boughtDog = this.readBoolean();
            data.boughtBunny = this.readBoolean();

            data.downedEmpressOfLight = this.readBoolean();
            data.downedQueenSlime = this.readBoolean();
        }

        return data;
    }

    parseWorldTiles() {
        let data;
        this.RLE = 0;

        data = new Array(this.world.width);
        for (let x = 0; x < this.world.width; x++) {
            data[x] = new Array(this.world.height);
            for (let y = 0; y < this.world.height; y++) {
                data[x][y] = this.parseTileData();

                while(this.RLE > 0) {
                    data[x][y+1] = data[x][y];
                    y++;
                    this.RLE--;
                }
            }
        }

        return data;
    }

    parseTileData() {
        let tile = {};

        const flags1 = this.readUInt8();
        let flags2, flags3;

        // flags2 present
        if (flags1 & 1) {
            flags2 = this.readUInt8();

        // flags3 present
            if (flags2 & 1)
                flags3 = this.readUInt8();
        }

        // contains block
        if (flags1 & 2) {
            // block id has 1 byte / 2 bytes
            if (flags1 & 32)
                tile.blockId = this.readUInt16();
            else
                tile.blockId = this.readUInt8();

            // important tile (animated, big sprite, more variants...)
            if (this.world.importants[tile.blockId]) {
                tile.frameX = this.readInt16();
                tile.frameY = this.readInt16();
                if (tile.blockId == 144)
                    tile.frameY = 0;
            }

            // painted block
            if (flags3 & 8)
                tile.blockColor = this.readUInt8();
        }

        // contains wall
        if (flags1 & 4) {
            tile.wallId = this.readUInt8();

            // painted wall
            if (flags3 & 16)
                tile.wallColor = this.readUInt8();
        }

        // liquid informations
        const liquidType = (flags1 & 24) >> 3;
        if (liquidType != 0) {
            tile.liquidAmount = this.readUInt8();
            switch (liquidType) {
                case 1: tile.liquidType = "water"; break;
                case 2: tile.liquidType = "lava"; break;
                case 3: tile.liquidType = "honey"; break;
            }
        }

        // flags2 has any other informations than flags3 presence
        if (flags2 > 1) {
            if (flags2 & 2)
                tile.wireRed = true;
            if (flags2 & 4)
                tile.wireBlue = true;
            if (flags2 & 8)
                tile.wireGreen = true;

            const slope = (flags2 & 112) >> 4;
            if (slope != 0)
                switch(slope) {
                    case 1: tile.slope = "half"; break;
                    case 2: tile.slope = "TR"; break;
                    case 3: tile.slope = "TL"; break;
                    case 4: tile.slope = "BR"; break;
                    case 5: tile.slope = "BL"; break;
                }
        }

        // flags3 has any informations
        if (flags3 > 0) {
            if (flags3 & 2)
                tile.actuator = true;
            if (flags3 & 4)
                tile.actuated = true;
            if (flags3 & 32)
                tile.wireYellow = true;
            if (flags3 & 64)
                tile.wallId = (this.readUInt8() << 8) | tile.wallId; //adding another byte
        }

        switch ((flags1 & 192) >> 6) {
            case 1: this.RLE = this.readUInt8(); break;
            case 2: this.RLE = this.readInt16(); break;
        }

        return tile;
    }

    parseChests() {
        let data = [];

        const chestsCount = this.readInt16(); //use world.chests.length instead
        this.readInt16(); //chestsSpace = 40 - constant in all supported map version files

        for (let i = 0; i < chestsCount; i++) {
            data[i] = {
                position: {
                    x: this.readInt32(),
                    y: this.readInt32()
                },
                name: this.readString()
            }

            if (data[i].name == "")
                delete data[i].name;

            for (let j = 0, stack; j < 40; j++) {
                stack = this.readInt16();
                if (stack == 0)
                    continue;

                if (!data[i].items)
                    data[i].items = [];

                data[i].items[j] = {
                    stack,
                    id: this.readInt32(),
                    prefix: this.readUInt8()
                };
            }
        }

        return data;
    }

    parseSigns() {
        let data = [];

        const signsCount = this.readInt16(); //use world.signs.count instead
        for (let i = 0; i < signsCount; i++)
            data[i] = {
                text: this.readString(),
                position: {
                    x: this.readInt32(),
                    y: this.readInt32()
                }
            };

        return data;
    }

    parseNPCs() {
        let data = [];

        let i = 0;
        for (; this.readBoolean(); i++) {
            data[i] = {
                townNPC: true,
                id: this.readInt32(),
                name: this.readString(),
                position: {
                    x: this.readFloat32(),
                    y: this.readFloat32()
                },
                homeless: this.readBoolean(),
                homePosition: {
                    x: this.readInt32(),
                    y: this.readInt32()
                }
            };

            if (this.world.version >= 225 && this.parseBitsByte(1)[0])
                data[i].variationIndex = this.readInt32();
        }

        for (; this.readBoolean(); i++)
            data[i] = {
                pillar: true,
                id: this.readInt32(),
                position: {
                    x: this.readFloat32(),
                    y: this.readFloat32()
                }
            };

        return data;
    }

    parseTileEntities() {
        let data = [];

        const tileEntitiesCount = this.readInt32(); //use world.tileEntities.length instead
        for (let i = 0; i < tileEntitiesCount; i++ ) {
            data[i] = {
                type: this.readUInt8(),
                id: this.readInt32(),
                position: {
                    x: this.readInt16(),
                    y: this.readInt16()
                }
            };;

            switch (data[i].type) {
                //dummy
                case 0:
                    data[i].targetDummy = {
                        npc: this.readInt16()
                    };
                    break;
                //item frame
                case 1:
                    data[i].itemFrame = {
                        itemId: this.readInt16(),
                        prefix: this.readUInt8(),
                        stack: this.readInt16()
                    };
                    break;
                //logic sensor
                case 2:
                    data[i].logicSensor = {
                        logicCheck: this.readUInt8(),
                        on: this.readBoolean()
                    };
                    break;
                //display doll
                case 3:
                    data[i].displayDoll = {
                        items: [],
                        dyes: []
                    };

                    var items = this.parseBitsByte(8);
                    var dyes = this.parseBitsByte(8);

                    for (let j = 0; j < 8; j++)
                        if (items[j]) {
                            if (!data[i].displayDoll.items)
                                data[i].displayDoll.items = [];
                            data[i].displayDoll.items[j] = {
                                itemId: this.readInt16(),
                                prefix: this.readUInt8(),
                                stack: this.readInt16()
                            };
                        }
                    for (let j = 0; j < 8; j++)
                        if (dyes[j]) {
                            if (!data[i].displayDoll.dyes)
                                data[i].displayDoll.dyes = [];
                            data[i].displayDoll.dyes[j] = {
                                itemId: this.readInt16(),
                                prefix: this.readUInt8(),
                                stack: this.readInt16()
                            };
                        }

                    break;
                //weapons rack
                case 4:
                    data[i].weaponsRack = {
                        itemId: this.readInt16(),
                        prefix: this.readUInt8(),
                        stack : this.readInt16()
                    };
                    break;
                //hat rack
                case 5:
                    data[i].hatRack = {
                        items: [],
                        dyes: []
                    };

                    var items = this.parseBitsByte(4);
                    var dyes = items.splice(2, 4);

                    for (let j = 0; j < 2; j++)
                        if (items[j]) {
                            if (!data[i].hatRack.items)
                                data[i].hatRack.items = [];
                            data[i].hatRack.items[j] = {
                                itemId: this.readInt16(),
                                prefix: this.readUInt8(),
                                stack: this.readInt16()
                            };
                        }
                    for (let j = 0; j < 2; j++)
                        if (dyes[j]) {
                            if (!data[i].hatRack.dyes)
                                data[i].hatRack.dyes = [];
                            data[i].hatRack.dyes[j] = {
                                itemId: this.readInt16(),
                                prefix: this.readUInt8(),
                                stack: this.readInt16()
                            };
                        }

                    break;
                //food platter
                case 6:
                    data[i].foodPlatter = {
                        itemId: this.readInt16(),
                        prefix: this.readUInt8(),
                        stack : this.readInt16()
                    };
                    break;
                //teleportation pylon
                case 7:
                    data[i].teleportationPylon = true;
                    break;
            }
        }

        return data;
    }

    parseWeightedPressurePlates() {
        let data = [];

        const pressurePlatesCount = this.readInt32(); //use world.weightedPressurePlates.length instead
        for (let i = 0; i < pressurePlatesCount; i++)
            data[i] = {
                position: {
                    x: this.readInt32(),
                    y: this.readInt32()
                }
            };

        return data;
    }

    parseTownManager() {
        let data = [];

        const roomsCount = this.readInt32(); //use world.townManager.length
        for (let i = 0; i < roomsCount; i++)
            data[i] = {
                NPCId: this.readInt32(),
                position: {
                    x: this.readInt32(),
                    y: this.readInt32()
                }
            };

        return data;
    }

    parseBestiary() {
        let data = {};

        data.NPCKills = {};
        for (let i = this.readInt32(); i > 0; --i)
            data.NPCKills[ this.readString() ] = this.readInt32();

        data.NPCSights = [];
        for (let i = this.readInt32(); i > 0; --i)
            data.NPCSights.push(this.readString());

        data.NPCChats = [];
        for (let i = this.readInt32(); i > 0; --i)
            data.NPCChats.push(this.readString());

        return data;
    }

    parseCreativePowers() {
        let data = [];

        while (this.readBoolean()) {
            let creativePower = {
                powerId: this.readInt16()
            };

            switch (creativePower.powerId) {
                case 0:
                    creativePower.freezeTime = {
                        enabled: this.readBoolean()
                    };
                    break;
                case 5:
                    creativePower.godMode = {
                        enabled: this.readBoolean()
                    };
                    break;
                case 8:
                    creativePower.modifyTimeRate = {
                        sliderValue: this.readFloat32()
                    };
                    break;
                case 9:
                    creativePower.freezeRainPower = {
                        enabled: this.readBoolean()
                    };
                    break;
                case 10:
                    creativePower.freezeWindDirectionAndStrength = {
                        enabled: this.readBoolean()
                    };
                    break;
                case 11:
                    creativePower.farPlacementRangePower = {
                        enabled: this.readBoolean()
                    };
                    break;
                case 12:
                    creativePower.difficultySliderPower = {
                        sliderValue: this.readFloat32()
                    };
                    break;
                case 13:
                    creativePower.stopBiomeSpreadPower = {
                        enabled: this.readBoolean()
                    };
                    break;
                case 14:
                    creativePower.spawnRateSliderPerPlayerPower = {
                        sliderValue: this.readFloat32()
                    };
                    break;
            }

            data.push(creativePower);
        }

        return data;
    }

    parseFooter() {
        return {
            signoff1: this.readBoolean(),
            signoff2: this.readString(),
            signoff3: this.readInt32()
        }
    }
}