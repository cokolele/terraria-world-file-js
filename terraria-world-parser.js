const fs = require("fs");

class TerrariaUtilities {

	constructor(path) {

		this.buffer = fs.readFileSync( path , [null, "r+"]);
		this.offset = 0;

		this.pointers = this.LoadPointers();
		this.importants = this.LoadImportants();
	}

	ReadByte() {

		const data = this.buffer[this.offset];
		this.offset += 1;

		return data
	}

	ReadInt16() {

		const data = this.buffer.readInt16LE( this.offset );
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
      
// www.github.com/deoxxa/dissolve
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

	JumpTo(offset) {

		this.offset = offset;
	}

	ReadGuid(bytesArray) {

		this.offset += 16;
		return "TODO";
	}

	LoadPointers() {

		this.JumpTo(0x18);

		let pointers = [];
		const numberOfPointers = this.ReadInt16();
		for (let i = 0; i < numberOfPointers; i++) {
			pointers[i] = this.ReadInt32();
		}

		return pointers;
	}

	LoadImportants() {

/*		data.importants = [];
		const numberOfImportants = this.readInt16();
		for (let i = 0; i < numberOfImportants; i++) {
			data.importants[i] = 
		}
*/
		return "TODO";
	}
}

class TerrariaWorldParser extends TerrariaUtilities {

	constructor(path) {
		
		super(path);
	}

	Load() {

		let data = {};

		data.fileFormatHeader 	= this.LoadFileFormatHeader();
		data.header 			= this.LoadHeader();

		return data;
	}

	LoadFileFormatHeader() {
		
		let data = {};
		this.JumpTo(0);
		
		data.version 		= this.ReadInt32();
		data.magicNumber 	= this.ReadBytes(7).toString("ascii");
		data.fileType 		= this.ReadByte();
		data.revision 		= this.ReadUInt32();
		data.favorite  		= "0 (always zero)"; this.SkipBytes(8);
		data.pointers 		= this.pointers;
		data.importants 	= this.importants;

		return data;
	}

	LoadHeader() {

		let data = {};
		this.JumpTo(this.pointers[0]);

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
		this.SkipBytes(); //data.shadowOrbCount 		= (int) this.ReadByte();
		data.altarCount 			= this.ReadInt32();
		data.hardMode 				= this.ReadBoolean();
		data.invasionDelay 			= this.ReadInt32();
		data.invasionSize 			= this.ReadInt32();
		data.invasionType 			= this.ReadInt32();
		data.invasionX 				= this.ReadDouble();
		data.slimeRainTime 			= this.ReadDouble();
		this.SkipBytes();//data.sundialCooldown 		= (int) this.ReadByte();
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
/*		data.cloudBGAlpha 			= (double) data.cloudBGActive < 1.0 ? 0.0f : 1f;
		data.cloudBGActive 			= (float) -data.genRand.Next(8640, 86400);
		data.numClouds 				= (int) this.ReadInt16();
*/		data.windSpeedSet 			= this.ReadSingle();
		data.windSpeed 				= data.windSpeedSet;
//		for (int index = this.ReadInt32(); index > 0; --index)
//			data.anglerWhoFinishedToday.Add(this.ReadString());
		data.savedAngler 			= this.ReadBoolean();
		data.anglerQuest 			= this.ReadInt32();
		data.savedStylist 			= this.ReadBoolean();
		data.savedTaxCollector 		= this.ReadBoolean();
		data.invasionSizeStart 		= this.ReadInt32();
		data.tempCultistDelay 		= this.ReadInt32();
/*		int num1 = (int) this.ReadInt16();
		for (int index = 0; index < num1; ++index)
			{
				if (index < 580)
					data.killCount[index] = this.ReadInt32();
				else
					this.ReadInt32();
			}*/
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
/*		int num2 = this.ReadInt32();
		for (int index = 0; index < num2; ++index)
			data.tempPartyCelebratingNPCs.Add(this.ReadInt32());*/
		data.Temp_Sandstorm_Happening 		= this.ReadBoolean();
		data.Temp_Sandstorm_TimeLeft 		= this.ReadInt32();
		data.Temp_Sandstorm_Severity 		= this.ReadSingle();
		data.Temp_Sandstorm_IntendedSeverity = this.ReadSingle();

		return data;
	}

}

module.exports = TerrariaWorldParser;