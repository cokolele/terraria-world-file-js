const terrariaFileParser = require("./utils/terraria-file-parser.js");
const TerrariaPlayerParserError = require("./utils/terraria-player-parser-error.js");

class terrariaWorldParser extends terrariaFileParser
{
    constructor(file)
    {
        try {
            super(file);
        } catch (e) {
            throw new TerrariaPlayerParserError(e, "Problem with opening the file");
        }
    }

    parse(selectedSections)
    {
        //world property cant be initialized in constructor
        //design flaw but it works
        this.world = {
            pointers:[],
            importants:[],
            tiles: {
                x:null,
                y:null,
                solids: [true,true,true,null,null,null,true,true,true,true,true,null,null,null,null,null,null,null,null,true,null,null,true,true,null,true,null,null,null,null,true,null,null,null,null,null,null,true,true,true,true,true,null,true,true,true,true,true,true,null,null,true,true,true,true,null,true,true,true,true,true,null,true,true,true,true,true,true,true,null,true,null,null,null,null,true,true,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,true,true,true,null,true,true,null,null,true,true,true,true,true,true,true,true,true,null,null,null,true,null,null,true,null,null,null,null,null,null,true,null,null,true,null,null,null,null,true,true,true,true,null,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,null,true,true,true,true,true,null,null,null,null,true,true,true,null,true,true,true,true,true,null,null,null,null,true,true,true,true,true,true,true,true,true,true,true,true,true,null,true,true,true,true,true,null,true,null,null,true,null,null,null,null,null,null,null,null,null,true,true,true,true,true,true,null,null,true,true,null,true,null,true,true,null,null,null,true,null,null,null,null,null,null,null,null,true,true,true,true,true,true,null,true,true,true,true,true,true,true,true,true,true,true,true,true,true,null,null,null,true,true,true,null,null,null,null,null,null,null,null,null,true,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,true,true,true,null,true,null,null,null,null,null,true,true,null,null,true,true,true,true,true,null,null,null,null,null,null,true,null,null,null,true,true,true,true,true,true,true,true,true,null,true,true,true,true,null,null,null,true,null,null,null,null,null,null,null,true,true,true,true,true,true,true,null,null,null,null,null,null,null,true,null,true,true,true,true,true,null,null,null,null,null,null,null,null,null,null,true,true,true,true,true,true,true,true,true,null,null,true,true,true,null,null,null,null,null,true,true,true,true,null,null,true,true,null,null,null,true,null,null,null,true,true,true,true,true,null,null,null,null,null,null,null,null,null,null,null,true,true,true,true,true,true,null,null,null,null,null,null,true,true,true],
            }
        }

        const allSections = ["FileFormatHeader", "Header", "WorldTiles", "Chests", "Signs", "NPCs", "TileEntities", "WeightedPressurePlates", "TownManager"];
        if (selectedSections == undefined) selectedSections = allSections;

        //fix parameter formatting (array order and strings casing)
        let fixedSelectedSections = [];
        for (const section of allSections) {
            for (const paramSection of selectedSections) {
                if (section.toUpperCase() === paramSection.toUpperCase()) 
                    fixedSelectedSections.push(section);
            }
        }
        this.selectedSections = selectedSections = fixedSelectedSections;

        let data = {};

        try {            
            for (const [i, section] of allSections.entries()) {
                const parseFunction = "parse" + section;

                if (i == 0) 
                    this.jumpTo(0);
                else
                    this.jumpTo(this.world.pointers[i-1]);

                    if (selectedSections.includes(section)) {
                        if (section == "NPCs") //return object properties with first letter lowercase except NPCs
                            data[section] = this[parseFunction]();
                        else
                            data[section.charAt(0).toLowerCase() + section.slice(1)] = this[parseFunction]();
                    } else if (section == "FileFormatHeader" || section == "Header") { // these sections contain data needed for further parsing
                        this[parseFunction]();
                        this.jumpTo(this.world.pointers[i]);
                    } else {
                        this.jumpTo(this.world.pointers[i]);
                    }

                if (this.offset != this.world.pointers[i]) 
                    throw new Error(section + " section position did not end where it should");
            }
        } catch (e) {
            throw new TerrariaPlayerParserError(e, "Problem with parsing the file");
        }

        return data;
    }

    parseFileFormatHeader()
    {
        let data = {};
        data.version        = this.readInt32();
        data.magicNumber    = this.readString(7);
        data.fileType       = this.readUInt8();
        data.revision       = this.readUInt32();
        this.skipBytes(7);
        data.favorite       = this.readBoolean();
        data.pointers       = [];
        data.importants     = [];

        const pointersCount = this.readInt16();
        for (let i = 0; i < pointersCount; i++) {
            data.pointers[i] = this.readInt32();
        }

        const importantsCount = this.readInt16();
        let num3 = 0;
        let num4 = 128;
        for (let i = 0; i < importantsCount; ++i) {
            if (num4 == 128) {
                num3 = this.readUInt8();
                num4 = 1;
            } else 
                num4 = num4 << 1 ; 

            if ((num3 & num4) == num4)
                data.importants[i] = true;
        }

        this.world.pointers = data.pointers;
        this.world.importants = data.importants;

        if ( data.version < 194 || data.magicNumber != "relogic" || data.fileType != 2)
            throw new Error("world file version is not supported (only 1.3.5.3) or corrupted metadata");

        return data;
    }

    parseHeader()
    {
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

        if (!this.selectedSections.includes("Header")) {
            this.world.tiles.x = data.maxTilesX;
            this.world.tiles.y = data.maxTilesY;
            return;
        }

        data.expertMode             = this.readBoolean();
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
        data.eclipse                = data.tempEclipse;
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
        data.cloudBGAlpha           = data.cloudBGActive < 1 ? 0 : 1;
        data.numClouds              = this.readInt16();
        data.windSpeedSet           = this.readFloat32();
        data.windSpeed              = data.windSpeedSet;

        data.anglerWhoFinishedToday = [];
        for (let i = this.readInt32(); i > 0; --i) {
            data.anglerWhoFinishedToday.push(this.readString());
        }
        data.savedAngler            = this.readBoolean();
        data.anglerQuest            = this.readInt32();
        data.savedStylist           = this.readBoolean();
        data.savedTaxCollector      = this.readBoolean();
        data.invasionSizeStart      = this.readInt32();
        data.tempCultistDelay       = this.readInt32();

        data.killCount = [];
        const num1 = this.readInt16();
        for (let i = 0; i < num1; ++i) {
            if (i < 580)
                data.killCount[i] = this.readInt32();
            else
                this.skipBytes(4);
        }

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
        const num2 = this.readInt32();
        for (let i = 0; i < num2; ++i) {
            data.tempPartyCelebratingNPCs.push(this.readInt32());
        }

        data.Temp_Sandstorm_Happening       = this.readBoolean();
        data.Temp_Sandstorm_TimeLeft        = this.readInt32();
        data.Temp_Sandstorm_Severity        = this.readFloat32();
        data.Temp_Sandstorm_IntendedSeverity = this.readFloat32();
        data.savedBartender                 = this.readBoolean();
        data.DD2Event_DownedInvasionT1      = this.readBoolean();
        data.DD2Event_DownedInvasionT2      = this.readBoolean();
        data.DD2Event_DownedInvasionT3      = this.readBoolean();

        this.world.tiles.x = data.maxTilesX;
        this.world.tiles.y = data.maxTilesY;

        return data;
    }

    parseWorldTiles()
    {
        let data;

        data = new Array(this.world.tiles.x);
        for (let x = 0; x < this.world.tiles.x; x++) {
            data[x] = new Array(this.world.tiles.y);
            for (let y = 0; y < this.world.tiles.y; y++) {
                const tile = this.parseTileData();
                data[x][y] = tile;
                let RLE = tile.RLE;
                delete tile.RLE;

                while(RLE > 0) {
                    y++;
                    RLE--;
                    data[x][y] = tile;
                }
            }
        }
        
        return data;
    }

    parseTileData()
    {
        let tile = {};

        let flags2, flags3;
        const flags1 = this.readUInt8();

        // flags2 present
        if ((flags1 & 1) == 1) {
            flags2 = this.readUInt8();

        // flags3 present
            if ((flags2 & 1) == 1)
                flags3 = this.readUInt8();
        }

        // contains block
        if ((flags1 & 2) == 2) {
            // block id has 1 byte / 2 bytes
            if ((flags1 & 32) == 32)
                tile.blockId = this.readUInt16();
            else
                tile.blockId = this.readUInt8();

            // important tile (animated, big sprite, more variants...)
            if (this.world.importants[tile.blockId]) {
                tile.frameX = this.readInt16();
                tile.frameY = tile.blockId == 144 ? 0 : this.readInt16();
            }

            // painted block
            if ((flags3 & 8) == 8) {
                if (!tile.color)
                    tile.color = {};
                tile.color.block = this.readUInt8();
            }
        }

        // contains wall
        if ((flags1 & 4) == 4) {
            tile.wallId = this.readUInt8();

            // painted wall
            if ((flags3 & 16) == 16) {
                if (!tile.colors) tile.colors = {};
                tile.colors.wall = this.readUInt8();
            }
        }

        // liquid informations
        const liquidType = (flags1 & 24) >> 3;
        if (liquidType != 0) {
            if (!tile.liquid)
                tile.liquid = {};
            tile.liquid.amount = this.readUInt8();
            switch (liquidType) {
                case 1: tile.liquid.type = "water"; break;
                case 2: tile.liquid.type = "lava"; break;
                case 3: tile.liquid.type = "honey"; break;
            }
        }

        // flags2 has any other informations than flags3 presence
        if (flags2 > 1) {
            if (!tile.wiring) 
                tile.wiring = {};
            if (!tile.wiring.wires)
                tile.wiring.wires = {};
            if ((flags2 & 2) == 2)
                tile.wiring.wires.red = true;
            if ((flags2 & 4) == 4)
                tile.wiring.wires.blue = true;
            if ((flags2 & 8) == 8)
                tile.wiring.wires.green = true;

            const hammeredBlock = (flags2 & 112) >> 4;
            if (hammeredBlock != 0 && this.world.tiles.solids[tile.blockId]) {
                switch(hammeredBlock) {
                    case 1: tile.hammered = "half"; break;
                    case 2: tile.hammered = "TR"; break;
                    case 3: tile.hammered = "TL"; break;
                    case 4: tile.hammered = "BR"; break;
                    case 5: tile.hammered = "BL"; break;
                }
            }
        }

        // flags3 has any informations
        if (flags3 > 0) {   
            if (!tile.wiring)
                tile.wiring = {};
            if ((flags3 & 2) == 2)
                tile.wiring.hasActuator = true;
            if ((flags3 & 4) == 4)
                tile.wiring.actuated = true;
            if ((flags3 & 32) == 32) {
                if (!tile.wiring.wires)
                    tile.wiring.wires = {};
                tile.wiring.wires.yellow = true;
            }
        }

        switch ((flags1 & 192) >> 6) {
            case 0: tile.RLE = 0; break;
            case 1: tile.RLE = this.readUInt8(); break;
            default: tile.RLE = this.readInt16(); break;
        }

        return tile;
    }

    parseChests()
    {
        let data = {};

        data.chestsCount = this.readInt16();
        data.chestSpace = this.readInt16();
        data.overflow = data.chestSpace <= 40 ? 0 : data.chestSpace - 40;
        if (data.chestsCount) 
            data.chests = [];

        for (let i = 0; i < data.chestsCount; i++) {
            data.chests[i] = {};
            data.chests[i].position = {
                x: this.readInt32(),
                y: this.readInt32()
            };
            data.chests[i].name = this.readString();
            if (data.chests[i].name == '') 
                delete data.chests[i].name;

            for (let _i = 0; _i < data.chestSpace; _i++) {
                const stack = this.readInt16();
                if (stack == 0) 
                    continue;

                if (!data.chests[i].items) 
                    data.chests[i].items = [];
                data.chests[i].items[_i] = {};
                data.chests[i].items[_i].stack  = (stack < 0) ? 1 : stack;
                data.chests[i].items[_i].id     = this.readInt32();
                data.chests[i].items[_i].prefix = this.readUInt8();
            }

            // skipping overflow items
            for (let _i = 0; _i < data.overflow; _i++) {
                if (this.readInt16() > 0)
                    this.skipBytes(5);
            }
        }
        
        return data;
    }

    parseSigns()
    {
        let data = {};

        data.signsCount = this.readInt16();
        if (data.signsCount)
            data.signs = [];

        for (let i = 0; i < data.signsCount; i++) {
            data.signs[i] = {};
            data.signs[i].text = this.readString();
            data.signs[i].position = {
                x: this.readInt32(),
                y: this.readInt32()
            };
        }
        
        return data;
    }

    parseNPCs()
    {
        let data = [];
        
        let i = 0;
        for (; this.readBoolean(); i++) {
            data[i] = {};
            data[i].id = this.readInt32();
            data[i].name = this.readString();
            data[i].position = {
                x: this.readFloat32(),
                y: this.readFloat32(),
            };
            data[i].homeless = this.readBoolean();
            data[i].homePosition = {
                x: this.readInt32(),
                y: this.readInt32(),
            };
        }

        //pillars, i guess
        for (; this.readBoolean(); i++) {
            data[i] = {};
            data[i].id = this.readInt32();

            data[i].position = {
                x: this.readFloat32(),
                y: this.readFloat32(),
            };
        }
        
        return data;
    }

    parseTileEntities()
    {
        let data = {};

        data.tileEntitiesCount = this.readInt32();
        if (data.tileEntitiesCount)
            data.tileEntities = [];

        for (let i = 0; i < data.tileEntitiesCount; i++ ) {
            data.tileEntities[i] = {};

            const type = this.readUInt8();
            data.tileEntities[i].id = this.readInt32();
            data.tileEntities[i].position = {
                x: this.readInt16(),
                y: this.readInt16()
            };

            switch (type) {
                //dummy
                case 0:
                    data.tileEntities[i].targetDummy = {
                        "npc": this.readInt16(),
                    }
                    break;
                //item frame
                case 1:
                    data.tileEntities[i].itemFrame = {
                        "itemId": this.readInt16(),
                        "prefix": this.readUInt8(),
                        "stack" : this.readInt16(),
                    }
                    break;
                //logic sensor
                case 2:
                    data.tileEntities[i].logicSensor = {
                        "logicCheck": this.readUInt8(),
                        "on"        : this.readBoolean(),
                    }
                    break;
            }

        }

        return data;
    }

    parseWeightedPressurePlates()
    {
        let data = {};

        data.pressurePlatesCount = this.readInt32();
        if (data.pressurePlatesCount) 
            data.pressurePlates = [];

        for (let i = 0; i < data.pressurePlatesCount; i++ ) {
            data.pressurePlates[i].position = {
                x: this.readInt32(),
                y: this.readInt32()
            };
        }

        return data;
    }

    parseTownManager()
    {
        let data = {};

        data.roomsCount = this.readInt32();
        data.rooms = [];

        for (let i = 0; i < data.roomsCount; i++) {
            data.rooms[i] = {};
            data.rooms[i].npcId = this.readInt32();
            data.rooms[i].position = {
                x: this.readInt32(),
                y: this.readInt32()
            };
        }

        return data;
    }
}

if (window)
    window.terrariaWorldParser = terrariaWorldParser;
if (module)
    module.exports = terrariaWorldParser;