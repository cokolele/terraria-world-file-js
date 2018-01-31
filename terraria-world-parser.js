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

	ReadByte() {

		const data = this.buffer[this.offset];
		this.offset += 1;

		return data;
	}

	ReadInt16() {

		const data = this.buffer.readInt16LE( this.offset );
		this.offset += 2;

		return data;
	}

	ReadUInt16() {

		const data = this.buffer.readUInt16LE( this.offset );
		this.offset += 2;

		return data;
	}

	ReadInt32() {
		
		const data = this.buffer.readInt32LE( this.offset );
		this.offset += 4;

		return data;
	}

	ReadUInt32() {
		
		const data = this.buffer.readUInt32LE( this.offset );
		this.offset += 4;

		return data;
	}
      
	ReadInt64() {

		const firstHalf = this.buffer.readInt32LE( this.offset );
		this.offset += 4;
		const secondHalf = this.buffer.readInt32LE( this.offset );
		const wat = this.buffer[this.offset];
		this.offset += 4;

		const data = 4294967296 * secondHalf + ( wat & 128 === 128 ? 1 : -1 ) * firstHalf;

		return data;
	}

	ReadUInt64() {
		
		const firstHalf = this.buffer.readUInt32LE( this.offset );
		this.offset += 4;
		const secondHalf = this.buffer.readUInt32LE( this.offset );
		this.offset += 4;

		const data = 4294967296 * secondHalf + firstHalf;

		return data
	}

	ReadString() {

		const stringLength = this.ReadByte();
		const data = this.ReadBytes(stringLength).toString("utf8");

		return data;
	}

	ReadSingle() {

		const data = this.buffer.readFloatLE();
		this.offset += 4;

		return data;
	}

	ReadDouble() {
		const data = this.buffer.readDoubleLE( this.offset );
		this.offset += 8;

		return data;
	}

	ReadBoolean() {

		if (this.ReadByte()) return true;
		return false;
	}

	ReadBytes(count, raw = false) {

		let data = [];

		for (let i = 0; i < count; i++) {
			data[i] = this.buffer[this.offset];
			this.offset += 1;
		}
		
		if (raw) if (count == 1) {
				return data[0]
			} else return data;
		return Buffer.from(data);
	}

	SkipBytes(count = 1) {

		this.offset += count;
	}

	SkipStrings(count = 1) {

		for (let i = 0; i < count; i++) {

			const stringLength = this.ReadByte();
			this.offet += stringLength;
		}
	}

	JumpTo(offset) {

		this.offset = offset;
	}

	ReadGuid(bytesArray) {

		this.SkipBytes(16);
		return "TODO";
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

			data.fileFormatHeader 	= this.LoadFileFormatHeader();
			//data.header 			= this.LoadHeader();
			//data.worldTiles 		= this.LoadWorldTiles();
			data.chestsData 		= this.LoadChests();
			
			delete data.fileFormatHeader;
			delete data.header;
			delete data.worldTiles;

		} catch (e) {

			if (e.stack.includes("LoadFileFormatHeader")) 
				e.message = `terraria-world-parser error \ndescription: potentionally corrupted file format header section \ndetails: ${e.stack}`;
			else if (e.stack.includes("LoadHeader")) 
				e.message = `terraria-world-parser error \ndescription: potentionally corrupted header section \ndetails: ${e.stack}`;
			else if (e.stack.includes("LoadWorldTiles")) 
				e.message = `terraria-world-parser error \ndescription: potentionally corrupted world tiles section \ndetails: ${e.stack}`;
			else 
				e.message = `terraria-world-parser error \ndetails: ${e.stack}`;
			throw e;
		}
		
		return data;
	}

	LoadFileFormatHeader() {

		let data = {};

		data.version 		= this.ReadInt32();
		data.magicNumber 	= this.ReadBytes(7).toString("ascii");
		data.fileType 		= this.ReadByte();
		data.revision 		= this.ReadUInt32();
		data.favorite  		= "0 (always zero)"; this.SkipBytes(8);
		data.pointers 		= [];
		data.importants 	= [];

		const cPointers = this.ReadInt16();

		for (let i = 0; i < cPointers; i++) {
			data.pointers[i] = this.ReadInt32();
		}

		const cImportants = this.ReadInt16();
		let num3 = 0;
		let num4 = 128;

		for (let i = 0; i < cImportants; ++i) {

			if (num4 == 128) {

				num3 = this.ReadByte();
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

		data.mapName 				= this.ReadString();
		data.seedText 				= this.ReadString();
		data.worldGeneratorVersion 	= this.ReadUInt64();
		data.guid 					= this.ReadGuid();
		data.worldID 				= this.ReadInt32();
		data.leftWorld 				= this.ReadInt32();
		data.rightWorld 			= this.ReadInt32();
		data.topWorld 				= this.ReadInt32();
		data.bottomWorld 			= this.ReadInt32();
		data.maxTilesY 				= this.ReadInt32();
		data.maxTilesX 				= this.ReadInt32();
		data.expertMode 			= this.ReadBoolean();
		data.creationTime 			= this.ReadInt64();
		data.moonType 				= this.ReadByte();

		data.treeX = [];
		data.treeX[0] 				= this.ReadInt32();
		data.treeX[1] 				= this.ReadInt32();
		data.treeX[2] 				= this.ReadInt32();

		data.treeStyle = [];
		data.treeStyle[0] 			= this.ReadInt32();
		data.treeStyle[1] 			= this.ReadInt32();
		data.treeStyle[2] 			= this.ReadInt32();
		data.treeStyle[3] 			= this.ReadInt32();

		data.caveBackX = [];
		data.caveBackX[0] 			= this.ReadInt32();
		data.caveBackX[1] 			= this.ReadInt32();
		data.caveBackX[2] 			= this.ReadInt32();

		data.caveBackStyle = [];
		data.caveBackStyle[0] 		= this.ReadInt32();
		data.caveBackStyle[1] 		= this.ReadInt32();
		data.caveBackStyle[2] 		= this.ReadInt32();
		data.caveBackStyle[3] 		= this.ReadInt32();

		data.iceBackStyle 			= this.ReadInt32();
		data.jungleBackStyle 		= this.ReadInt32();
		data.hellBackStyle 			= this.ReadInt32();
		data.spawnTileX 			= this.ReadInt32();
		data.spawnTileY 			= this.ReadInt32();
		data.worldSurface 			= this.ReadDouble();
		data.rockLayer 				= this.ReadDouble();
		data.tempTime 				= this.ReadDouble();
		data.tempDayTime 			= this.ReadBoolean();
		data.tempMoonPhase 			= this.ReadInt32();
		data.tempBloodMoon 			= this.ReadBoolean();
		data.tempEclipse 			= this.ReadBoolean();
		data.eclipse 				= data.tempEclipse;
		data.dungeonX 				= this.ReadInt32();
		data.dungeonY 				= this.ReadInt32();
		data.crimson 				= this.ReadBoolean();
		data.downedBoss1 			= this.ReadBoolean();
		data.downedBoss2 			= this.ReadBoolean();
		data.downedBoss3 			= this.ReadBoolean();
		data.downedQueenBee 		= this.ReadBoolean();
		data.downedMechBoss1 		= this.ReadBoolean();
		data.downedMechBoss2 		= this.ReadBoolean();
		data.downedMechBoss3 		= this.ReadBoolean();
		data.downedMechBossAny 		= this.ReadBoolean();
		data.downedPlantBoss 		= this.ReadBoolean();
		data.downedGolemBoss 		= this.ReadBoolean();
		data.downedSlimeKing 		= this.ReadBoolean();
		data.savedGoblin 			= this.ReadBoolean();
		data.savedWizard 			= this.ReadBoolean();
		data.savedMech 				= this.ReadBoolean();
		data.downedGoblins 			= this.ReadBoolean();
		data.downedClown 			= this.ReadBoolean();
		data.downedFrost 			= this.ReadBoolean();
		data.downedPirates 			= this.ReadBoolean();
		data.shadowOrbSmashed 		= this.ReadBoolean();
		data.spawnMeteor 			= this.ReadBoolean();
		data.shadowOrbCount 		= this.ReadByte();
		data.altarCount 			= this.ReadInt32();
		data.hardMode 				= this.ReadBoolean();
		data.invasionDelay 			= this.ReadInt32();
		data.invasionSize 			= this.ReadInt32();
		data.invasionType 			= this.ReadInt32();
		data.invasionX 				= this.ReadDouble();
		data.slimeRainTime 			= this.ReadDouble();
		data.sundialCooldown 		= this.ReadByte();
		data.tempRaining 			= this.ReadBoolean();
		data.tempRainTime 			= this.ReadInt32();
		data.tempMaxRain 			= this.ReadSingle();
		data.oreTier1 				= this.ReadInt32();
		data.oreTier2 				= this.ReadInt32();
		data.oreTier3 				= this.ReadInt32();
		data.setBG0 				= this.ReadByte();
		data.setBG1 				= this.ReadByte();
		data.setBG2 				= this.ReadByte();
		data.setBG3 				= this.ReadByte();
		data.setBG4 				= this.ReadByte();
		data.setBG5 				= this.ReadByte();
		data.setBG6 				= this.ReadByte();
		data.setBG7 				= this.ReadByte();
		data.cloudBGActive 			= this.ReadInt32();
		data.cloudBGAlpha 			= data.cloudBGActive < 1 ? 0 : 1;
		data.cloudBGActive 			= Math.random() * (86400 - 8640) + 8640; //(float) -data.genRand.Next(8640, 86400);
		data.numClouds 				= this.ReadInt16();
		data.windSpeedSet 			= this.ReadSingle();
		data.windSpeed 				= data.windSpeedSet;

		data.anglerWhoFinishedToday = [];
		for (let i = this.ReadInt32(); i > 0; --i) {
			data.anglerWhoFinishedToday.push(this.ReadString());
		}

		data.savedAngler 			= this.ReadBoolean();
		data.anglerQuest 			= this.ReadInt32();
		data.savedStylist 			= this.ReadBoolean();
		data.savedTaxCollector 		= this.ReadBoolean();
		data.invasionSizeStart 		= this.ReadInt32();
		data.tempCultistDelay 		= this.ReadInt32();

		data.killCount = [];
		const num1 = this.ReadInt16();
		for (let i = 0; i < num1; ++i) {
			if (i < 580)
				data.killCount[i] = this.ReadInt32();
			else
				this.SkipBytes(4);
		}

		data.fastForwardTime 		= this.ReadBoolean();
		data.downedFishron 			= this.ReadBoolean();
		data.downedMartians 		= this.ReadBoolean();
		data.downedAncientCultist 	= this.ReadBoolean();
		data.downedMoonlord 		= this.ReadBoolean();
		data.downedHalloweenKing 	= this.ReadBoolean();
		data.downedHalloweenTree 	= this.ReadBoolean();
		data.downedChristmasIceQueen = this.ReadBoolean();
		data.downedChristmasSantank = this.ReadBoolean();
		data.downedChristmasTree 	= this.ReadBoolean();
		data.downedTowerSolar 		= this.ReadBoolean();
		data.downedTowerVortex 		= this.ReadBoolean();
		data.downedTowerNebula 		= this.ReadBoolean();
		data.downedTowerStardust 	= this.ReadBoolean();
		data.TowerActiveSolar 		= this.ReadBoolean();
		data.TowerActiveVortex 		= this.ReadBoolean();
		data.TowerActiveNebula 		= this.ReadBoolean();
		data.TowerActiveStardust 	= this.ReadBoolean();
		data.LunarApocalypseIsUp 	= this.ReadBoolean();
		data.tempPartyManual 		= this.ReadBoolean();
		data.tempPartyGenuine 		= this.ReadBoolean();
		data.tempPartyCooldown 		= this.ReadInt32();

		data.tempPartyCelebratingNPCs = [];
		const num2 = this.ReadInt32();
		for (let i = 0; i < num2; ++i) {
			data.tempPartyCelebratingNPCs.push(this.ReadInt32());
		}
		
		data.Temp_Sandstorm_Happening 		= this.ReadBoolean();
		data.Temp_Sandstorm_TimeLeft 		= this.ReadInt32();
		data.Temp_Sandstorm_Severity 		= this.ReadSingle();
		data.Temp_Sandstorm_IntendedSeverity = this.ReadSingle();
		data.savedBartender 				= this.ReadBoolean();
		data.DD2Event_DownedInvasionT1 		= this.ReadBoolean();
		data.DD2Event_DownedInvasionT2 		= this.ReadBoolean();
		data.DD2Event_DownedInvasionT3 		= this.ReadBoolean();

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

				const tile = this.DeserializeTileData();

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

	DeserializeTileData() {

		let tile = {};

		tile.blockId = -1;
		let flags2, flags3;
		const flags1 = this.ReadByte();

		// flags2 present
		if ((flags1 & 1) == 1) {
			flags2 = this.ReadByte();

		// flags3 present
			if ((flags2 & 1) == 1)
				flags3 = this.ReadByte();
		}

		// contains block
		if ((flags1 & 2) == 2) {

			// block id has 1 byte / 2 bytes
			if ((flags1 & 32) == 32) tile.blockId = this.ReadUInt16();
			else tile.blockId = this.ReadByte();

			// important tile (animated, big sprite, more variants...)
			if (this.world.importants[tile.blockId]) {
				tile.frameX = this.ReadInt16();
				tile.frameY = tile.blockId == 144 ? 0 : this.ReadInt16();
			} else {
				tile.frameX = -1;
				tile.frameY = -1;
			}

			// painted block
			if ((flags3 & 8) == 8) {
				if (!tile.color) tile.color = {};
				tile.color.block = this.ReadByte();
			}
		}

		// contains wall
		if ((flags1 & 4) == 4) {
			tile.wall = this.ReadByte();

			// painted wall
			if ((flags3 & 16) == 16) {
				if (!tile.color) tile.color = {};
				tile.color.wall = this.ReadByte();
			}
		}

		// liquid informations
		const liquidType = (flags1 & 24) >> 3;
		if (liquidType != 0) {
			
			if (!tile.liquid) tile.liquid = {};
			tile.liquid.amount = this.ReadByte();
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
			case 1: tile.RLE = this.ReadByte(); break;
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
			data.chests[i].x 	= this.ReadInt32();
			data.chests[i].y 	= this.ReadInt32();
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
				data.chests[i].items[_i].stack 	= (stack < 0) ? 1 : stack;
				data.chests[i].items[_i].id 	= this.ReadInt32();
				data.chests[i].items[_i].prefix = this.ReadByte();
			}

			// skipping overflow items
			for (let _i = 0; _i < data.overflow; _i++) {
				if (this.ReadInt16() > 0) this.SkipBytes(5);
			}
		}

		return data;
	}
}

module.exports = TerrariaWorldParser;