const terrariaFileSaver = require("./utils/terraria-file-saver.js");
const TerrariaWorldSaverError = require("./utils/terraria-world-saver-error.js");

class terrariaWorldSaver extends terrariaFileSaver {
    constructor(worldObject) {
        super();
        this.worldObject = worldObject;
    }

    save(percentageCallback) {
        if (percentageCallback)
            this.percentageCallback = percentageCallback;

        const pointers = [
            this.saveFileFormatHeader(),
            this.saveHeader(),
            this.saveWorldTiles(),
            this.saveChests(),
            this.saveSigns(),
            this.saveNPCs(),
            this.saveTileEntities(),
            this.saveWeightedPressurePlates(),
            this.saveTownManager(),
            0
        ];

        this.saveFooter();
        this.trimBuffer();

        this.offset = this.pointersOffset;
        for (let i = 0; i < pointers.length; i++)
            this.saveInt32(pointers[i]);

        return this.buffer;
    }

    saveFileFormatHeader() {
        const data = this.worldObject.fileFormatHeader;

        this.saveInt32( data.version );
        this.saveString( "relogic", false );
        this.saveUInt8( data.fileType );
        this.saveUInt32( data.revision );
        this.skipBytes(7);
        this.saveBoolean( data.favorite );

        this.saveInt16(10);
        this.pointersOffset = this.offset;
        this.skipBytes(40);

        this.saveBytes( data._importantsSectionData );

        return this.offset;
    }

    saveHeader() {
        const data = this.worldObject.header;

        this.saveString( data.mapName );
        this.saveString( data.seedText );
        this.saveBytes( data.worldGeneratorVersion );
        this.saveBytes( data.guid );
        this.saveInt32( data.worldId );
        this.saveInt32( data.leftWorld );
        this.saveInt32( data.rightWorld );
        this.saveInt32( data.topWorld );
        this.saveInt32( data.bottomWorld );
        this.saveInt32( data.maxTilesY );
        this.saveInt32( data.maxTilesX );
        this.saveBoolean( data.expertMode );
        this.saveBytes( data.creationTime );
        this.saveUInt8( data.moonType );
        this.saveInt32( data.treeX[0] );
        this.saveInt32( data.treeX[1] );
        this.saveInt32( data.treeX[2] );
        this.saveInt32( data.treeStyle[0] );
        this.saveInt32( data.treeStyle[1] );
        this.saveInt32( data.treeStyle[2] );
        this.saveInt32( data.treeStyle[3] );
        this.saveInt32( data.caveBackX[0] );
        this.saveInt32( data.caveBackX[1] );
        this.saveInt32( data.caveBackX[2] );
        this.saveInt32( data.caveBackStyle[0] );
        this.saveInt32( data.caveBackStyle[1] );
        this.saveInt32( data.caveBackStyle[2] );
        this.saveInt32( data.caveBackStyle[3] );
        this.saveInt32( data.iceBackStyle );
        this.saveInt32( data.jungleBackStyle );
        this.saveInt32( data.hellBackStyle );
        this.saveInt32( data.spawnTileX );
        this.saveInt32( data.spawnTileY );
        this.saveFloat64( data.worldSurface );
        this.saveFloat64( data.rockLayer );
        this.saveFloat64( data.tempTime );
        this.saveBoolean( data.tempDayTime );
        this.saveInt32( data.tempMoonPhase );
        this.saveBoolean( data.tempBloodMoon );
        this.saveBoolean( data.tempEclipse );
        this.saveInt32( data.dungeonX );
        this.saveInt32( data.dungeonY );
        this.saveBoolean( data.crimson );
        this.saveBoolean( data.downedBoss1 );
        this.saveBoolean( data.downedBoss2 );
        this.saveBoolean( data.downedBoss3 );
        this.saveBoolean( data.downedQueenBee );
        this.saveBoolean( data.downedMechBoss1 );
        this.saveBoolean( data.downedMechBoss2 );
        this.saveBoolean( data.downedMechBoss3 );
        this.saveBoolean( data.downedMechBossAny );
        this.saveBoolean( data.downedPlantBoss );
        this.saveBoolean( data.downedGolemBoss );
        this.saveBoolean( data.downedSlimeKing );
        this.saveBoolean( data.savedGoblin );
        this.saveBoolean( data.savedWizard );
        this.saveBoolean( data.savedMech );
        this.saveBoolean( data.downedGoblins );
        this.saveBoolean( data.downedClown );
        this.saveBoolean( data.downedFrost );
        this.saveBoolean( data.downedPirates );
        this.saveBoolean( data.shadowOrbSmashed );
        this.saveBoolean( data.spawnMeteor );
        this.saveUInt8( data.shadowOrbCount );
        this.saveInt32( data.altarCount );
        this.saveBoolean( data.hardMode );
        this.saveInt32( data.invasionDelay );
        this.saveInt32( data.invasionSize );
        this.saveInt32( data.invasionType );
        this.saveFloat64( data.invasionX );
        this.saveFloat64( data.slimeRainTime );
        this.saveUInt8( data.sundialCooldown );
        this.saveBoolean( data.tempRaining );
        this.saveInt32( data.tempRainTime );
        this.saveFloat32( data.tempMaxRain );
        this.saveInt32( data.oreTier1 );
        this.saveInt32( data.oreTier2 );
        this.saveInt32( data.oreTier3 );
        this.saveUInt8( data.setBG0 );
        this.saveUInt8( data.setBG1 );
        this.saveUInt8( data.setBG2 );
        this.saveUInt8( data.setBG3 );
        this.saveUInt8( data.setBG4 );
        this.saveUInt8( data.setBG5 );
        this.saveUInt8( data.setBG6 );
        this.saveUInt8( data.setBG7 );
        this.saveInt32( data.cloudBGActive );
        this.saveInt16( data.numClouds );
        this.saveFloat32( data.windSpeed );
        this.saveInt32( data.anglerWhoFinishedToday.length );
        for (let i = 0; i < data.anglerWhoFinishedToday.length; --i)
            this.saveString( data.anglerWhoFinishedToday.shift() );
        this.saveBoolean( data.savedAngler );
        this.saveInt32( data.anglerQuest );
        this.saveBoolean( data.savedStylist );
        this.saveBoolean( data.savedTaxCollector );
        this.saveInt32( data.invasionSizeStart );
        this.saveInt32( data.tempCultistDelay );
        this.saveInt16( data.killCount.length );
        for (let i = 0; i < data.killCount.length; ++i)
            this.saveInt32( data.killCount[i] );
        this.saveBoolean( data.fastForwardTime );
        this.saveBoolean( data.downedFishron );
        this.saveBoolean( data.downedMartians );
        this.saveBoolean( data.downedAncientCultist );
        this.saveBoolean( data.downedMoonlord );
        this.saveBoolean( data.downedHalloweenKing );
        this.saveBoolean( data.downedHalloweenTree );
        this.saveBoolean( data.downedChristmasIceQueen );
        this.saveBoolean( data.downedChristmasSantank );
        this.saveBoolean( data.downedChristmasTree );
        this.saveBoolean( data.downedTowerSolar );
        this.saveBoolean( data.downedTowerVortex );
        this.saveBoolean( data.downedTowerNebula );
        this.saveBoolean( data.downedTowerStardust );
        this.saveBoolean( data.TowerActiveSolar );
        this.saveBoolean( data.TowerActiveVortex );
        this.saveBoolean( data.TowerActiveNebula );
        this.saveBoolean( data.TowerActiveStardust );
        this.saveBoolean( data.LunarApocalypseIsUp );
        this.saveBoolean( data.tempPartyManual );
        this.saveBoolean( data.tempPartyGenuine );
        this.saveInt32( data.tempPartyCooldown );
        this.saveInt32(data.tempPartyCelebratingNPCs.length);
        for (let i = 0; i < data.tempPartyCelebratingNPCs.length; i++)
            this.saveInt32( data.tempPartyCelebratingNPCs.shift() );
        this.saveBoolean( data.Temp_Sandstorm_Happening );
        this.saveInt32( data.Temp_Sandstorm_TimeLeft );
        this.saveFloat32( data.Temp_Sandstorm_Severity );
        this.saveFloat32( data.Temp_Sandstorm_IntendedSeverity );
        this.saveBoolean( data.savedBartender );
        this.saveBoolean( data.DD2Event_DownedInvasionT1 );
        this.saveBoolean( data.DD2Event_DownedInvasionT2 );
        this.saveBoolean( data.DD2Event_DownedInvasionT3 );

        return this.offset;
    }

    saveWorldTiles() {
        const data = this.worldObject.worldTiles;

        const percentil = this.worldObject.header.maxTilesX / 100;
        let percent = 0;
        let percentilNext = 0;

        for (let x = 0; x < this.worldObject.header.maxTilesX; x++) {
            if (x > percentilNext) {
                percent++;
                percentilNext += percentil
                this.percentageCallback(percent);
            }

            for (let y = 0; y < this.worldObject.header.maxTilesY;) {
                const tile = data[x][y];
                let flags1, flags2, flags3;

                const prevY = y;
                while (y < this.worldObject.header.maxTilesY && JSON.stringify(tile) === JSON.stringify(data[x][++y])){}
                const RLE = y - prevY - 1;

                if (RLE) {
                    if (RLE > 255)
                        flags1 |= 128;
                    else
                        flags1 |= 64;
                }

                if (tile.blockId !== undefined) {
                    flags1 |= 2;

                    if (tile.blockId > 255)
                        flags1 |= 32;
                }

                if (tile.wallId !== undefined)
                    flags1 |= 4;

                if (tile.liquid) {
                    switch(tile.liquid.type) {
                        case "water": flags1 |= (1 << 3); break;
                        case "lava": flags1 |= (2 << 3); break;
                        case "honey": flags1 |= (3 << 3); break;
                    }
                }

                if (tile.slope) {
                    switch(tile.slope) {
                        case "half": flags2 |= (1 << 4); break;
                        case "TR": flags2 |= (2 << 4); break;
                        case "TL": flags2 |= (3 << 4); break;
                        case "BR": flags2 |= (4 << 4); break;
                        case "BL": flags2 |= (5 << 4); break;
                    }
                }

                if (tile.wiring) {
                    if (tile.wiring.wires) {
                        if (tile.wiring.wires.yellow)
                            flags3 |= 32;

                        if (tile.wiring.wires.red)
                            flags2 |= 2;

                        if (tile.wiring.wires.blue)
                            flags2 |= 4;

                        if (tile.wiring.wires.green)
                            flags2 |= 8;
                    }

                    if (tile.wiring.actuated)
                        flags3 |= 4;

                    if (tile.wiring.actuator)
                        flags3 |= 2;
                }

                if (tile.colors) {
                    if (tile.colors.wall)
                        flags3 |= 16;

                    if (tile.colors.block)
                        flags3 |= 8;
                }

                if (flags2 || flags3) {
                    flags1 |= 1;
                    this.saveUInt8( flags1 );

                    if (flags3) {
                        flags2 |= 1;
                        this.saveUInt8( flags2 );
                        this.saveUInt8( flags3 );
                    } else
                        this.saveUInt8( flags2 );
                } else
                    this.saveUInt8( flags1 );

                if (flags1 & 2) {
                    if (flags1 & 32)
                        this.saveUInt16( tile.blockId );
                    else
                        this.saveUInt8( tile.blockId );

                    if (this.worldObject.fileFormatHeader.importants[tile.blockId]) {
                        this.saveUInt16( tile.frameX );
                        tile.blockId != 144 && this.saveUInt16( tile.frameY );
                    }

                    if (flags3 & 8)
                        this.saveUInt8( tile.colors.block );
                }

                if (flags1 & 4) {
                    this.saveUInt8( tile.wallId );

                    if (flags3 & 16)
                        this.saveUInt8( tile.colors.wall );
                }

                if (tile.liquid)
                    this.saveUInt8( tile.liquid.amount );

                if (RLE) {
                    if (RLE > 255)
                        this.saveUInt16( RLE );
                    else
                        this.saveUInt8( RLE );
                }
            }
        }

        return this.offset;
    }

    saveChests() {
        const data = this.worldObject.chests;

        this.saveInt16( data.chestsCount );
        this.saveInt16( data.chestSpace );

        for (let i = 0; i < data.chestsCount; i++) {
            this.saveInt32( data.chests[i].position.x );
            this.saveInt32( data.chests[i].position.y );
            if (data.chests[i].name)
                this.saveString( data.chests[i].name );
            else
                this.saveUInt8( 0 );

            const chestItems = Array(data.chestSpace).fill(null);
            if (data.chests[i].items) {
                data.chests[i].items.forEach((item, i) => {
                    chestItems[i] = item;
                });
            }

            chestItems.forEach(item => {
                if (item === null)
                    this.saveInt16( 0 );
                else {
                    this.saveInt16( item.stack );
                    this.saveInt32( item.id );
                    this.saveUInt8( item.prefix );
                }
            });
        }

        return this.offset
    }

    saveSigns() {
        const data = this.worldObject.signs;

        this.saveInt16( data.signsCount );

        for (let i = 0; i < data.signsCount; i++) {
            this.saveString( data.signs[i].text );
            this.saveInt32( data.signs[i].position.x );
            this.saveInt32( data.signs[i].position.y );
        }

        return this.offset;
    }

    saveNPCs() {
        const data = this.worldObject.NPCs;

        if (data.NPCs)
            data.NPCs.forEach(NPC => {
                this.saveBoolean( true );
                this.saveInt32( NPC.id );
                this.saveString( NPC.name );
                this.saveFloat32( NPC.position.x );
                this.saveFloat32( NPC.position.y );
                this.saveBoolean( NPC.homeless );
                this.saveInt32( NPC.homePosition.x );
                this.saveInt32( NPC.homePosition.y );
            });
        this.saveBoolean( false );

        if (data.pillars)
            data.pillars.forEach(pillar => {
                this.saveBoolean( true );
                this.saveInt32( pillar.id );
                this.saveFloat32( pillar.position.x );
                this.saveFloat32( pillar.position.y );
            });
        this.saveBoolean( false );

        return this.offset;
    }

    saveTileEntities() {
        const data = this.worldObject.tileEntities;

        this.saveInt32( data.tileEntitiesCount );

        if (data.tileEntities)
            data.tileEntities.forEach(tileEntity => {
                this.saveUInt8( tileEntity.targetDummy ? 0 : ( tileEntity.itemFrame ? 1 : 2 ) );
                this.saveInt32( tileEntity.id );
                this.saveInt16( tileEntity.position.x );
                this.saveInt16( tileEntity.position.y );

                if (tileEntity.targetDummy) {
                    this.saveInt16( tileEntity.targetDummy.npc );
                } else if (tileEntity.itemFrame) {
                    this.saveInt16( tileEntity.itemFrame.itemId );
                    this.saveUInt8( tileEntity.itemFrame.prefix );
                    this.saveInt16( tileEntity.itemFrame.stack );
                } else {
                    this.saveUInt8( tileEntity.logicSensor.logicCheck );
                    this.saveBoolean( tileEntity.logicSensor.on );
                }
            });

        return this.offset;
    }

    saveWeightedPressurePlates() {
        const data = this.worldObject.weightedPressurePlates;

        this.saveInt32( data.pressurePlatesCount );

        if (data.pressurePlates)
            data.pressurePlates.forEach(pressurePlate => {
                this.saveInt32( pressurePlate.position.x );
                this.saveInt32( pressurePlate.position.y );
            });

        return this.offset;
    }

    saveTownManager() {
        const data = this.worldObject.townManager;

        this.saveInt32( data.roomsCount );

        if (data.rooms)
            data.rooms.forEach(room => {
                this.saveInt32( room.npcId );
                this.saveInt32( room.position.x );
                this.saveInt32( room.position.y );
            });

        return this.offset;
    }

    saveFooter() {
        const data = this.worldObject.footer;

        this.saveBoolean( data.signoff1 );
        this.saveString( data.signoff2 );
        this.saveInt32( data.signoff3 );

        return this.offset;
    }
}

if (module)
    module.exports = terrariaWorldSaver;
else if (window)
    window.terrariaWorldSaver = terrariaWorldSaver;