class TerrariaUtilities {

	constructor(path) {
		const fs = require("fs");
		this.buffer = fs.readFileSync( path , [null, "r+"]);
		this.offset = 0;
		this.world = {
			pointers:[],
			importants:[],
			tiles: {
				x:null,
				y:null,
				solids: [true,true,true,null,null,null,true,true,true,true,true,null,null,null,null,null,null,null,null,true,null,null,true,true,null,true,null,null,null,null,true,null,null,null,null,null,null,true,true,true,true,true,null,true,true,true,true,true,true,null,null,true,true,true,true,null,true,true,true,true,true,null,true,true,true,true,true,true,true,null,true,null,null,null,null,true,true,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,true,true,true,null,true,true,null,null,true,true,true,true,true,true,true,true,true,null,null,null,true,null,null,true,null,null,null,null,null,null,true,null,null,true,null,null,null,null,true,true,true,true,null,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,null,true,true,true,true,true,null,null,null,null,true,true,true,null,true,true,true,true,true,null,null,null,null,true,true,true,true,true,true,true,true,true,true,true,true,true,null,true,true,true,true,true,null,true,null,null,true,null,null,null,null,null,null,null,null,null,true,true,true,true,true,true,null,null,true,true,null,true,null,true,true,null,null,null,true,null,null,null,null,null,null,null,null,true,true,true,true,true,true,null,true,true,true,true,true,true,true,true,true,true,true,true,true,true,null,null,null,true,true,true,null,null,null,null,null,null,null,null,null,true,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,true,true,true,null,true,null,null,null,null,null,true,true,null,null,true,true,true,true,true,null,null,null,null,null,null,true,null,null,null,true,true,true,true,true,true,true,true,true,null,true,true,true,true,null,null,null,true,null,null,null,null,null,null,null,true,true,true,true,true,true,true,null,null,null,null,null,null,null,true,null,true,true,true,true,true,null,null,null,null,null,null,null,null,null,null,true,true,true,true,true,true,true,true,true,null,null,true,true,true,null,null,null,null,null,true,true,true,true,null,null,true,true,null,null,null,true,null,null,null,true,true,true,true,true,null,null,null,null,null,null,null,null,null,null,null,true,true,true,true,true,true,null,null,null,null,null,null,true,true,true],
			},
		}
	}

	ReadInt8() {

		this.offset += 1;
		return this.buffer[this.offset - 1];
	}

	ReadInt16() {

		this.offset += 2;
		return this.buffer.readInt16LE( this.offset - 2 );
	}

	ReadUInt16() {

		this.offset += 2;
		return this.buffer.readUInt16LE( this.offset - 2 );
	}

	ReadInt32() {
		
		this.offset += 4;
		return this.buffer.readInt32LE( this.offset - 4 );
	}

	ReadUInt32() {
		
		this.offset += 4;
		return this.buffer.readUInt32LE( this.offset - 4 );
	}

	ReadString() {

		return this.ReadBytes( this.ReadInt8() ).toString("utf8");
	}

	ReadFloat() {

		this.offset += 4;
		return this.buffer.readFloatLE( this.offset - 4 );
	}

	ReadDouble() {

		this.offset += 8;
		return this.buffer.readDoubleLE( this.offset - 8 );
	}

	ReadBoolean() {

		if (this.ReadInt8()) return true;
		return false;
	}

	ReadBytes(count) {

		let data = [];

		for (let i = 0; i < count; i++) {
			data[i] = this.buffer[this.offset];
			this.offset += 1;
		}
		return Buffer.from(data);
	}

	SkipBytes(count) {

		this.offset += count;
	}
}

class TerrariaWorldParser extends TerrariaUtilities {

	constructor(path) {
		
		try {
			super(path);
		} catch (e) {

			if (e.code = "ENOENT") 
				e.message = `terraria-world-parser error \ndescription: wrong path \ndetails: ${e.stack}`;
			else 
				e.message = `terraria-world-parser error \ndetails: ${e.stack}`;
			throw e;
		}
	}

	Load() {

		let data = {};
		
		try {

			data.fileFormatHeader   = this.LoadFileFormatHeader();
			data.header             = this.LoadHeader();
			data.worldTiles         = this.LoadWorldTiles();
			data.chestsData         = this.LoadChests();
			data.signsData          = this.LoadSigns();
			data.npcsData           = this.LoadNPCs();
			data.tileEntities       = this.LoadTileEntities();
			data.pressurePlates     = this.LoadWeightedPressurePlates();
			data.townManager        = this.LoadTownManager()

		} catch (e) {

			if (e.stack.includes("LoadFileFormatHeader")) 
				e.message = `terraria-world-parser error \ndescription: potentionally corrupted file format header section \ndetails: ${e.stack}`;
			else if (e.stack.includes("LoadHeader")) 
				e.message = `terraria-world-parser error \ndescription: potentionally corrupted header section \ndetails: ${e.stack}`;
			else if (e.stack.includes("LoadWorldTiles")) 
				e.message = `terraria-world-parser error \ndescription: potentionally corrupted world tiles section \ndetails: ${e.stack}`;
			else if (e.stack.includes("LoadChests")) 
				e.message = `terraria-world-parser error \ndescription: potentionally corrupted chests section \ndetails: ${e.stack}`;
			else if (e.stack.includes("LoadSigns")) 
				e.message = `terraria-world-parser error \ndescription: potentionally corrupted signs section \ndetails: ${e.stack}`;
			else if (e.stack.includes("LoadNPCs")) 
				e.message = `terraria-world-parser error \ndescription: potentionally corrupted NPCs section \ndetails: ${e.stack}`;
			else if (e.stack.includes("LoadTileEntities")) 
				e.message = `terraria-world-parser error \ndescription: potentionally corrupted tile entities section \ndetails: ${e.stack}`;
			else if (e.stack.includes("LoadWeightedPressurePlates")) 
				e.message = `terraria-world-parser error \ndescription: potentionally corrupted pressure plates section \ndetails: ${e.stack}`;
			else if (e.stack.includes("LoadTownManager")) 
				e.message = `terraria-world-parser error \ndescription: potentionally corrupted town manager section \ndetails: ${e.stack}`;
			else
				e.message = `terraria-world-parser error \ndetails: ${e.stack}`;
			throw e;
		}
		
		return data;
	}

	LoadFileFormatHeader() {

		let data = {};

		data.version        = this.ReadInt32();
		data.magicNumber    = this.ReadBytes(7).toString("ascii");
		data.fileType       = this.ReadInt8();
		data.revision       = this.ReadUInt32();
		data.favorite       = this.ReadBytes(8);
		data.pointers       = [];
		data.importants     = [];

		const pointersCount = this.ReadInt16();

		for (let i = 0; i < pointersCount; i++) {
			data.pointers[i] = this.ReadInt32();
		}

		const importantsCount = this.ReadInt16();
		let num3 = 0;
		let num4 = 128;

		for (let i = 0; i < importantsCount; ++i) {

			if (num4 == 128) {
				num3 = this.ReadInt8();
				num4 = 1;
			} else num4 = num4 << 1 ; 

			if ((num3 & num4) == num4) data.importants[i] = true;
		}

		if ( data.version < 194 || data.magicNumber != "relogic" || data.fileType != 2 || data.pointers.length != 10 || data.importants.length != 470 )
			throw new Error("world file version is not supported (only 1.3.5.8) or corrupted metadata");
		if ( this.offset != data.pointers[0] ) 
			throw new Error("file format header section position did not end where it should");

		this.world.pointers = data.pointers;
		this.world.importants = data.importants;
		return data;
	}

	LoadHeader() {

		let data = {};

		data.mapName                = this.ReadString();
		data.seedText               = this.ReadString();
		data.worldGeneratorVersion  = this.ReadBytes(8);
		data.guid                   = this.ReadBytes(16);
		data.worldId                = this.ReadInt32();
		data.leftWorld              = this.ReadInt32();
		data.rightWorld             = this.ReadInt32();
		data.topWorld               = this.ReadInt32();
		data.bottomWorld            = this.ReadInt32();
		data.maxTilesY              = this.ReadInt32();
		data.maxTilesX              = this.ReadInt32();
		data.expertMode             = this.ReadBoolean();
		data.creationTime           = this.ReadBytes(8);
		data.moonType               = this.ReadInt8();

		data.treeX = [];
		data.treeX[0]               = this.ReadInt32();
		data.treeX[1]               = this.ReadInt32();
		data.treeX[2]               = this.ReadInt32();

		data.treeStyle = [];
		data.treeStyle[0]           = this.ReadInt32();
		data.treeStyle[1]           = this.ReadInt32();
		data.treeStyle[2]           = this.ReadInt32();
		data.treeStyle[3]           = this.ReadInt32();

		data.caveBackX = [];
		data.caveBackX[0]           = this.ReadInt32();
		data.caveBackX[1]           = this.ReadInt32();
		data.caveBackX[2]           = this.ReadInt32();

		data.caveBackStyle = [];
		data.caveBackStyle[0]       = this.ReadInt32();
		data.caveBackStyle[1]       = this.ReadInt32();
		data.caveBackStyle[2]       = this.ReadInt32();
		data.caveBackStyle[3]       = this.ReadInt32();

		data.iceBackStyle           = this.ReadInt32();
		data.jungleBackStyle        = this.ReadInt32();
		data.hellBackStyle          = this.ReadInt32();
		data.spawnTileX             = this.ReadInt32();
		data.spawnTileY             = this.ReadInt32();
		data.worldSurface           = this.ReadDouble();
		data.rockLayer              = this.ReadDouble();
		data.tempTime               = this.ReadDouble();
		data.tempDayTime            = this.ReadBoolean();
		data.tempMoonPhase          = this.ReadInt32();
		data.tempBloodMoon          = this.ReadBoolean();
		data.tempEclipse            = this.ReadBoolean();
		data.eclipse                = data.tempEclipse;
		data.dungeonX               = this.ReadInt32();
		data.dungeonY               = this.ReadInt32();
		data.crimson                = this.ReadBoolean();
		data.downedBoss1            = this.ReadBoolean();
		data.downedBoss2            = this.ReadBoolean();
		data.downedBoss3            = this.ReadBoolean();
		data.downedQueenBee         = this.ReadBoolean();
		data.downedMechBoss1        = this.ReadBoolean();
		data.downedMechBoss2        = this.ReadBoolean();
		data.downedMechBoss3        = this.ReadBoolean();
		data.downedMechBossAny      = this.ReadBoolean();
		data.downedPlantBoss        = this.ReadBoolean();
		data.downedGolemBoss        = this.ReadBoolean();
		data.downedSlimeKing        = this.ReadBoolean();
		data.savedGoblin            = this.ReadBoolean();
		data.savedWizard            = this.ReadBoolean();
		data.savedMech              = this.ReadBoolean();
		data.downedGoblins          = this.ReadBoolean();
		data.downedClown            = this.ReadBoolean();
		data.downedFrost            = this.ReadBoolean();
		data.downedPirates          = this.ReadBoolean();
		data.shadowOrbSmashed       = this.ReadBoolean();
		data.spawnMeteor            = this.ReadBoolean();
		data.shadowOrbCount         = this.ReadInt8();
		data.altarCount             = this.ReadInt32();
		data.hardMode               = this.ReadBoolean();
		data.invasionDelay          = this.ReadInt32();
		data.invasionSize           = this.ReadInt32();
		data.invasionType           = this.ReadInt32();
		data.invasionX              = this.ReadDouble();
		data.slimeRainTime          = this.ReadDouble();
		data.sundialCooldown        = this.ReadInt8();
		data.tempRaining            = this.ReadBoolean();
		data.tempRainTime           = this.ReadInt32();
		data.tempMaxRain            = this.ReadFloat();
		data.oreTier1               = this.ReadInt32();
		data.oreTier2               = this.ReadInt32();
		data.oreTier3               = this.ReadInt32();
		data.setBG0                 = this.ReadInt8();
		data.setBG1                 = this.ReadInt8();
		data.setBG2                 = this.ReadInt8();
		data.setBG3                 = this.ReadInt8();
		data.setBG4                 = this.ReadInt8();
		data.setBG5                 = this.ReadInt8();
		data.setBG6                 = this.ReadInt8();
		data.setBG7                 = this.ReadInt8();
		data.cloudBGActive          = this.ReadInt32();
		data.cloudBGAlpha           = data.cloudBGActive < 1 ? 0 : 1;
		data.numClouds              = this.ReadInt16();
		data.windSpeedSet           = this.ReadFloat();
		data.windSpeed              = data.windSpeedSet;

		data.anglerWhoFinishedToday = [];
		for (let i = this.ReadInt32(); i > 0; --i) {
			data.anglerWhoFinishedToday.push(this.ReadString());
		}

		data.savedAngler            = this.ReadBoolean();
		data.anglerQuest            = this.ReadInt32();
		data.savedStylist           = this.ReadBoolean();
		data.savedTaxCollector      = this.ReadBoolean();
		data.invasionSizeStart      = this.ReadInt32();
		data.tempCultistDelay       = this.ReadInt32();

		data.killCount = [];
		const num1 = this.ReadInt16();
		for (let i = 0; i < num1; ++i) {
			if (i < 580)
				data.killCount[i] = this.ReadInt32();
			else
				this.SkipBytes(4);
		}

		data.fastForwardTime        = this.ReadBoolean();
		data.downedFishron          = this.ReadBoolean();
		data.downedMartians         = this.ReadBoolean();
		data.downedAncientCultist   = this.ReadBoolean();
		data.downedMoonlord         = this.ReadBoolean();
		data.downedHalloweenKing    = this.ReadBoolean();
		data.downedHalloweenTree    = this.ReadBoolean();
		data.downedChristmasIceQueen = this.ReadBoolean();
		data.downedChristmasSantank = this.ReadBoolean();
		data.downedChristmasTree    = this.ReadBoolean();
		data.downedTowerSolar       = this.ReadBoolean();
		data.downedTowerVortex      = this.ReadBoolean();
		data.downedTowerNebula      = this.ReadBoolean();
		data.downedTowerStardust    = this.ReadBoolean();
		data.TowerActiveSolar       = this.ReadBoolean();
		data.TowerActiveVortex      = this.ReadBoolean();
		data.TowerActiveNebula      = this.ReadBoolean();
		data.TowerActiveStardust    = this.ReadBoolean();
		data.LunarApocalypseIsUp    = this.ReadBoolean();
		data.tempPartyManual        = this.ReadBoolean();
		data.tempPartyGenuine       = this.ReadBoolean();
		data.tempPartyCooldown      = this.ReadInt32();

		data.tempPartyCelebratingNPCs = [];
		const num2 = this.ReadInt32();
		for (let i = 0; i < num2; ++i) {
			data.tempPartyCelebratingNPCs.push(this.ReadInt32());
		}
		
		data.Temp_Sandstorm_Happening       = this.ReadBoolean();
		data.Temp_Sandstorm_TimeLeft        = this.ReadInt32();
		data.Temp_Sandstorm_Severity        = this.ReadFloat();
		data.Temp_Sandstorm_IntendedSeverity = this.ReadFloat();
		data.savedBartender                 = this.ReadBoolean();
		data.DD2Event_DownedInvasionT1      = this.ReadBoolean();
		data.DD2Event_DownedInvasionT2      = this.ReadBoolean();
		data.DD2Event_DownedInvasionT3      = this.ReadBoolean();

		if (this.offset != this.world.pointers[1])
			throw new Error("header section position did not end where it should");

		this.world.tiles.x = data.maxTilesX;
		this.world.tiles.y = data.maxTilesY;
		return data;
	}

	LoadWorldTiles() {

		let data;

		data = new Array(this.world.tiles.x);
		for (let x = 0; x < this.world.tiles.x; x++) {

			data[x] = new Array(this.world.tiles.y);
			for (let y = 0; y < this.world.tiles.y; y++) {

				const tile = this.ParseTileData();

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

		if (this.offset != this.world.pointers[2])
			throw new Error("world tiles section position did not end where it should");
		
		return data;
	}

	ParseTileData() {

		let tile = {};

		let flags2, flags3;
		const flags1 = this.ReadInt8();

		// flags2 present
		if ((flags1 & 1) == 1) {
			flags2 = this.ReadInt8();

		// flags3 present
			if ((flags2 & 1) == 1)
				flags3 = this.ReadInt8();
		}

		// contains block
		if ((flags1 & 2) == 2) {

			// block id has 1 byte / 2 bytes
			if ((flags1 & 32) == 32) tile.blockId = this.ReadUInt16();
			else tile.blockId = this.ReadInt8();

			// important tile (animated, big sprite, more variants...)
			if (this.world.importants[tile.blockId]) {
				tile.frameX = this.ReadInt16();
				tile.frameY = tile.blockId == 144 ? 0 : this.ReadInt16();
			}

			// painted block
			if ((flags3 & 8) == 8) {
				if (!tile.color) tile.color = {};
				tile.color.block = this.ReadInt8();
			}
		}

		// contains wall
		if ((flags1 & 4) == 4) {
			tile.wallId = this.ReadInt8();

			// painted wall
			if ((flags3 & 16) == 16) {
				if (!tile.colors) tile.colors = {};
				tile.colors.wall = this.ReadInt8();
			}
		}

		// liquid informations
		const liquidType = (flags1 & 24) >> 3;
		if (liquidType != 0) {
			
			if (!tile.liquid) tile.liquid = {};
			tile.liquid.amount = this.ReadInt8();
			switch(liquidType) {
				case 1: tile.liquid.type = "water"; break;
				case 2: tile.liquid.type = "lava"; break;
				case 3: tile.liquid.type = "honey"; break;
			}
		}

		// flags2 has any other informations than flags3 presence
		if (flags2 > 1) {
			
			if (!tile.wiring) tile.wiring = {};
			if (!tile.wiring.wires) tile.wiring.wires = {};
			if ((flags2 & 2) == 2) tile.wiring.wires.red = true;
			if ((flags2 & 4) == 4) tile.wiring.wires.blue = true;
			if ((flags2 & 8) == 8) tile.wiring.wires.green = true;

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
			
			if (!tile.wiring) tile.wiring = {};
			if ((flags3 & 2) == 2) tile.wiring.hasActuator = true;
			if ((flags3 & 4) == 4) tile.wiring.actuated = true;
			if ((flags3 & 32) == 32) tile.wiring.wires.yellow = true;
		}

		switch ((flags1 & 192) >> 6) {
			case 0: tile.RLE = 0; break;
			case 1: tile.RLE = this.ReadInt8(); break;
			default: tile.RLE = this.ReadInt16(); break;
		}

		return tile;
	}

	LoadChests() {

		let data = {};

		data.chestsCount = this.ReadInt16();
		data.chestSpace = this.ReadInt16();
		data.overflow = data.chestSpace <= 40 ? 0 : data.chestSpace - 40;
		if (data.chestsCount) 
			data.chests = [];

		for (let i = 0; i < data.chestsCount; i++) {
			
			data.chests[i] = {};
			data.chests[i].position = {
				x: this.ReadInt32(),
				y: this.ReadInt32()
			};
			data.chests[i].name = this.ReadString();
			if (data.chests[i].name == '') 
				delete data.chests[i].name;

			for (let _i = 0; _i < data.chestSpace; _i++) {

				const stack = this.ReadInt16();
				if (stack == 0) 
					continue;

				if (!data.chests[i].items) 
					data.chests[i].items = [];
				data.chests[i].items[_i] = {};
				data.chests[i].items[_i].stack  = (stack < 0) ? 1 : stack;
				data.chests[i].items[_i].id     = this.ReadInt32();
				data.chests[i].items[_i].prefix = this.ReadInt8();
			}

			// skipping overflow items
			for (let _i = 0; _i < data.overflow; _i++) {
				if (this.ReadInt16() > 0) this.SkipBytes(5);
			}
		}

		if (this.offset != this.world.pointers[3])
			throw new Error("chests section position did not end where it should");

		return data;
	}

	LoadSigns() {

		let data = {};

		data.signsCount = this.ReadInt16();
		if (data.signsCount) data.signs = [];

		for (let i = 0; i < data.signsCount; i++) {

			data.signs[i] = {};
			data.signs[i].text = this.ReadString();
			data.signs[i].position = {
				x: this.ReadInt32(),
				y: this.ReadInt32()
			};
		}
		
		if (this.offset != this.world.pointers[4])
			throw new Error("signs section position did not end where it should");
		
		return data;
	}

	LoadNPCs() {

		let data = [];
		
		let i = 0;
		for (; this.ReadBoolean(); i++) {

			data[i] = {};
			data[i].id         = this.ReadInt32();
			data[i].name       = this.ReadString();
			data[i].position   = {
				x: this.ReadFloat(),
				y: this.ReadFloat(),
			};
			data[i].homeless   = this.ReadBoolean();
			data[i].homePosition = {
				x: this.ReadInt32(),
				y: this.ReadInt32(),
			};
		}

		//pillars, i guess
		for (; this.ReadBoolean(); i++) {
			
			data[i] = {};
			data[i].id = this.ReadInt32();

			data[i].position = {
				x: this.ReadFloat(),
				y: this.ReadFloat(),
			};
		}

		if (this.offset != this.world.pointers[5])
			throw new Error("NPCs section position did not end where it should");

		return data;
	}

	LoadTileEntities() {

		let data = {};

		data.tileEntitiesCount = this.ReadInt32();
		if (data.tileEntitiesCount) data.tileEntities = [];

		for (let i = 0; i < data.tileEntitiesCount; i++ ) {
			
			data.tileEntities[i] = {};

			const type              = this.ReadInt8();
			data.tileEntities[i].id = this.ReadInt32();
			data.tileEntities[i].position = {
				x: this.ReadInt16(),
				y: this.ReadInt16()
			};

			switch (type) {

				//dummy
				case 0:

					data.tileEntities[i].targetDummy = {
						"npc": this.ReadInt16(),
					}
					break;

				//item frame
				case 1:
					data.tileEntities[i].itemFrame = {
						"itemId": this.ReadInt16(),
						"prefix": this.ReadInt8(),
						"stack" : this.ReadInt16(),
					}
					break;

				//logic sensor
				case 2:
					data.tileEntities[i].logicSensor = {
						"logicCheck": this.ReadInt8(),
						"on"        : this.ReadBoolean(),
					}
					break;
			}

		}

		if (this.offset != this.world.pointers[6])
			throw new Error("tile entities section position did not end where it should");

		return data;
	}

	LoadWeightedPressurePlates() {

		let data = {};

		data.pressurePlatesCount = this.ReadInt32();
		if (data.pressurePlatesCount) data.pressurePlates = [];

		for (let i = 0; i < data.pressurePlatesCount; i++ ) {

			data.pressurePlates[i].position = {
				x: this.ReadInt32(),
				y: this.ReadInt32()
			};
		}

		if (this.offset != this.world.pointers[7])
			throw new Error("pressure plates section position did not end where it should");

		return data;
	}

	LoadTownManager() {

		let data = {};

		data.roomsCount = this.ReadInt32();
		data.rooms = [];

		for (let i = 0; i < data.roomsCount; i++) {

			data.rooms[i] = {};
			data.rooms[i].npcId = this.ReadInt32();
			data.rooms[i].position = {
				x: this.ReadInt32(),
				y: this.ReadInt32()
			};
		}

		return data;
	}
}

module.exports = TerrariaWorldParser;