import terrariaFileSaver from "./utils/terraria-file-saver.js";
import TerrariaWorldSaverError from "./utils/terraria-world-saver-error.js";

export default class terrariaWorldSaver extends terrariaFileSaver {
    constructor() {
        super();
    }

    save(options) {
        this.options = options;

        try {
            const pointers = [
                this.saveFileFormatHeader(),
                this.saveHeader(),
                this.saveWorldTiles(),
                this.saveChests(),
                this.saveSigns(),
                this.saveNPCs(),
                this.saveTileEntities(),
                this.saveWeightedPressurePlates(),
                this.saveTownManager()
            ];
            if (this.options.world.fileFormatHeader.version >= 225) {
                pointers.push(this.saveBestiary());
                pointers.push(this.saveCreativePowers());
            } else {
                pointers.push(0);
            }

            this.saveFooter();
            this.trimBuffer();

            this.offset = this.pointersOffset;
            for (let i = 0; i < pointers.length; i++)
                this.saveInt32(pointers[i]);
        } catch (e) {
            throw new TerrariaWorldSaverError("Problem with saving the file", e);
        }

        return this.buffer;
    }

    saveFileFormatHeader() {
        const data = this.options.world.fileFormatHeader;

        this.saveInt32(data.version);
        this.saveString("relogic", false);
        this.saveUInt8(data.fileType);
        this.saveUInt32(data.revision);
        this.saveBoolean(data.favorite);
        this.skipBytes(7);

        if (this.options.world.fileFormatHeader.version >= 225)
            this.saveInt16(11);
        else
            this.saveInt16(10);
        this.pointersOffset = this.offset;
        this.skipBytes(this.options.world.fileFormatHeader.version >= 225 ? 44 : 40);

        this.saveInt16(data.importants.length);
        this.saveBitsByte(data.importants);

        return this.offset;
    }

    saveHeader() {
        const data = this.options.world.header;

        this.saveString(data.mapName);
        this.saveString(data.seedText);
        this.saveBytes(data.worldGeneratorVersion);
        this.saveBytes(data.guid);
        this.saveInt32(data.worldId);
        this.saveInt32(data.leftWorld);
        this.saveInt32(data.rightWorld);
        this.saveInt32(data.topWorld);
        this.saveInt32(data.bottomWorld);
        this.saveInt32(data.maxTilesY);
        this.saveInt32(data.maxTilesX);
        if (this.options.world.fileFormatHeader.version >= 225) {
            this.saveInt32(data.gameMode);
            this.saveBoolean(data.drunkWorld)

            if (this.options.world.fileFormatHeader.version >= 227)
                this.saveBoolean(data.getGoodWorld);
            if (this.options.world.fileFormatHeader.version >= 238)
                this.saveBoolean(data.getTenthAnniversaryWorld);
            if (this.options.world.fileFormatHeader.version >= 239)
                this.saveBoolean(data.dontStarveWorld);
            if (this.options.world.fileFormatHeader.version >= 241)
                this.saveBoolean(data.notTheBeesWorld);
            if (this.options.world.fileFormatHeader.version >= 249)
                this.saveBoolean(data.remixWorld);
            if (this.options.world.fileFormatHeader.version >= 266)
                this.saveBoolean(data.noTrapsWorld);
            if (this.options.world.fileFormatHeader.version >= 267)
                this.saveBoolean(data.zenithWorld);
        } else {
            this.saveBoolean(data.expertMode);
        }
        this.saveBytes(data.creationTime);
        this.saveUInt8(data.moonType);
        this.saveInt32(data.treeX[0]);
        this.saveInt32(data.treeX[1]);
        this.saveInt32(data.treeX[2]);
        this.saveInt32(data.treeStyle[0]);
        this.saveInt32(data.treeStyle[1]);
        this.saveInt32(data.treeStyle[2]);
        this.saveInt32(data.treeStyle[3]);
        this.saveInt32(data.caveBackX[0]);
        this.saveInt32(data.caveBackX[1]);
        this.saveInt32(data.caveBackX[2]);
        this.saveInt32(data.caveBackStyle[0]);
        this.saveInt32(data.caveBackStyle[1]);
        this.saveInt32(data.caveBackStyle[2]);
        this.saveInt32(data.caveBackStyle[3]);
        this.saveInt32(data.iceBackStyle);
        this.saveInt32(data.jungleBackStyle);
        this.saveInt32(data.hellBackStyle);
        this.saveInt32(data.spawnTileX);
        this.saveInt32(data.spawnTileY);
        this.saveFloat64(data.worldSurface);
        this.saveFloat64(data.rockLayer);
        this.saveFloat64(data.tempTime);
        this.saveBoolean(data.tempDayTime);
        this.saveInt32(data.tempMoonPhase);
        this.saveBoolean(data.tempBloodMoon);
        this.saveBoolean(data.tempEclipse);
        this.saveInt32(data.dungeonX);
        this.saveInt32(data.dungeonY);
        this.saveBoolean(data.crimson);
        this.saveBoolean(data.downedBoss1);
        this.saveBoolean(data.downedBoss2);
        this.saveBoolean(data.downedBoss3);
        this.saveBoolean(data.downedQueenBee);
        this.saveBoolean(data.downedMechBoss1);
        this.saveBoolean(data.downedMechBoss2);
        this.saveBoolean(data.downedMechBoss3);
        this.saveBoolean(data.downedMechBossAny);
        this.saveBoolean(data.downedPlantBoss);
        this.saveBoolean(data.downedGolemBoss);
        this.saveBoolean(data.downedSlimeKing);
        this.saveBoolean(data.savedGoblin);
        this.saveBoolean(data.savedWizard);
        this.saveBoolean(data.savedMech);
        this.saveBoolean(data.downedGoblins);
        this.saveBoolean(data.downedClown);
        this.saveBoolean(data.downedFrost);
        this.saveBoolean(data.downedPirates);
        this.saveBoolean(data.shadowOrbSmashed);
        this.saveBoolean(data.spawnMeteor);
        this.saveUInt8(data.shadowOrbCount);
        this.saveInt32(data.altarCount);
        this.saveBoolean(data.hardMode);
        if (this.options.world.fileFormatHeader.version >= 257)
            this.saveBoolean(data.afterPartyOfDoom);
        this.saveInt32(data.invasionDelay);
        this.saveInt32(data.invasionSize);
        this.saveInt32(data.invasionType);
        this.saveFloat64(data.invasionX);
        this.saveFloat64(data.slimeRainTime);
        this.saveUInt8(data.sundialCooldown);
        this.saveBoolean(data.tempRaining);
        this.saveInt32(data.tempRainTime);
        this.saveFloat32(data.tempMaxRain);
        this.saveInt32(data.oreTier1);
        this.saveInt32(data.oreTier2);
        this.saveInt32(data.oreTier3);
        this.saveUInt8(data.setBG0);
        this.saveUInt8(data.setBG1);
        this.saveUInt8(data.setBG2);
        this.saveUInt8(data.setBG3);
        this.saveUInt8(data.setBG4);
        this.saveUInt8(data.setBG5);
        this.saveUInt8(data.setBG6);
        this.saveUInt8(data.setBG7);
        this.saveInt32(data.cloudBGActive);
        this.saveInt16(data.numClouds);
        this.saveFloat32(data.windSpeed);
        this.saveInt32(data.anglerWhoFinishedToday.length);
        for (let i = 0; i < data.anglerWhoFinishedToday.length; i++)
            this.saveString(data.anglerWhoFinishedToday.shift());
        this.saveBoolean(data.savedAngler);
        this.saveInt32(data.anglerQuest);
        this.saveBoolean(data.savedStylist);
        this.saveBoolean(data.savedTaxCollector);
        if (this.options.world.fileFormatHeader.version >= 225)
            this.saveBoolean(data.savedGolfer);
        this.saveInt32(data.invasionSizeStart);
        this.saveInt32(data.tempCultistDelay);
        this.saveInt16(data.killCount.length);
        for (let i = 0; i < data.killCount.length; i++)
            this.saveInt32(data.killCount[i]);
        this.saveBoolean(data.fastForwardTime);
        this.saveBoolean(data.downedFishron);
        this.saveBoolean(data.downedMartians);
        this.saveBoolean(data.downedAncientCultist);
        this.saveBoolean(data.downedMoonlord);
        this.saveBoolean(data.downedHalloweenKing);
        this.saveBoolean(data.downedHalloweenTree);
        this.saveBoolean(data.downedChristmasIceQueen);
        this.saveBoolean(data.downedChristmasSantank);
        this.saveBoolean(data.downedChristmasTree);
        this.saveBoolean(data.downedTowerSolar);
        this.saveBoolean(data.downedTowerVortex);
        this.saveBoolean(data.downedTowerNebula);
        this.saveBoolean(data.downedTowerStardust);
        this.saveBoolean(data.TowerActiveSolar);
        this.saveBoolean(data.TowerActiveVortex);
        this.saveBoolean(data.TowerActiveNebula);
        this.saveBoolean(data.TowerActiveStardust);
        this.saveBoolean(data.LunarApocalypseIsUp);
        this.saveBoolean(data.tempPartyManual);
        this.saveBoolean(data.tempPartyGenuine);
        this.saveInt32(data.tempPartyCooldown);
        this.saveInt32(data.tempPartyCelebratingNPCs.length);
        for (let i = 0; i < data.tempPartyCelebratingNPCs.length; i++)
            this.saveInt32(data.tempPartyCelebratingNPCs.shift());
        this.saveBoolean(data.Temp_Sandstorm_Happening);
        this.saveInt32(data.Temp_Sandstorm_TimeLeft);
        this.saveFloat32(data.Temp_Sandstorm_Severity);
        this.saveFloat32(data.Temp_Sandstorm_IntendedSeverity);
        this.saveBoolean(data.savedBartender);
        this.saveBoolean(data.DD2Event_DownedInvasionT1);
        this.saveBoolean(data.DD2Event_DownedInvasionT2);
        this.saveBoolean(data.DD2Event_DownedInvasionT3);

        if (this.options.world.fileFormatHeader.version >= 225) {
            this.saveUInt8(data.setBG8);
            this.saveUInt8(data.setBG9);
            this.saveUInt8(data.setBG10);
            this.saveUInt8(data.setBG11);
            this.saveUInt8(data.setBG12);

            this.saveBoolean(data.combatBookWasUsed);
            this.saveInt32(data.lanternNightCooldown);
            this.saveBoolean(data.lanternNightGenuine);
            this.saveBoolean(data.lanternNightManual);
            this.saveBoolean(data.lanternNightNextNightIsGenuine);

            this.saveInt32(data.treeTopsVariations.length);
            for (let i = 0; i < data.treeTopsVariations.length; i++)
                this.saveInt32(data.treeTopsVariations[i]);

            this.saveBoolean(data.forceHalloweenForToday);
            this.saveBoolean(data.forceXMasForToday);

            this.saveInt32(data.savedOreTierCopper);
            this.saveInt32(data.savedOreTierIron);
            this.saveInt32(data.savedOreTierSilver);
            this.saveInt32(data.savedOreTierGold);

            this.saveBoolean(data.boughtCat);
            this.saveBoolean(data.boughtDog);
            this.saveBoolean(data.boughtBunny);

            this.saveBoolean(data.downedEmpressOfLight);
            this.saveBoolean(data.downedQueenSlime);
        }

        if (this.options.world.fileFormatHeader.version >= 240) {
            this.saveBoolean(data.downedDeerclops);
        }

        if (this.options.world.fileFormatHeader.version >= 269) {
            this.saveBoolean(data.unlockedSlimeBlueSpawn);
            this.saveBoolean(data.unlockedMerchantSpawn);
            this.saveBoolean(data.unlockedDemolitionistSpawn);
            this.saveBoolean(data.unlockedPartyGirlSpawn);
            this.saveBoolean(data.unlockedDyeTraderSpawn);
            this.saveBoolean(data.unlockedTruffleSpawn);
            this.saveBoolean(data.unlockedArmsDealerSpawn);
            this.saveBoolean(data.unlockedNurseSpawn);
            this.saveBoolean(data.unlockedPrincessSpawn);
            this.saveBoolean(data.combatBookVolumeTwoWasUsed);
            this.saveBoolean(data.peddlersSatchelWasUsed);
            this.saveBoolean(data.unlockedSlimeGreenSpawn);
            this.saveBoolean(data.unlockedSlimeOldSpawn);
            this.saveBoolean(data.unlockedSlimePurpleSpawn);
            this.saveBoolean(data.unlockedSlimeRainbowSpawn);
            this.saveBoolean(data.unlockedSlimeRedSpawn);
            this.saveBoolean(data.unlockedSlimeYellowSpawn);
            this.saveBoolean(data.unlockedSlimeCopperSpawn);
            this.saveBoolean(data.fastForwardTimeToDusk);
            this.saveUInt8(data.moondialCooldown);
        }

        return this.offset;
    }

    saveWorldTiles() {
        const data = this.options.world.tiles;

        let onePercentSize, onePercentSizeNext, percent;
        if (this.options.progressCallback) {
            onePercentSize = Math.floor(this.options.world.header.maxTilesX / 100);
            onePercentSizeNext = onePercentSize;
            percent = 0;
        }

        for (let x = 0; x < this.options.world.header.maxTilesX; x++) {

            if (this.options.progressCallback) {
                if (x >= onePercentSizeNext) {
                    percent++;
                    onePercentSizeNext += onePercentSize;
                    this.options.progressCallback(percent);
                }
            }

            for (let y = 0; y < this.options.world.header.maxTilesY;) {
                const tile = data[x][y];
                let flags1, flags2, flags3, flags4;

                const startY = y;
                do
                    y++;
                while (y < this.options.world.header.maxTilesY && JSON.stringify(tile) === JSON.stringify(data[x][y]))

                const RLE = y - startY - 1;

                if (RLE) {
                    if (RLE > 255)
                        flags1 |= 128;
                    else
                        flags1 |= 64;
                }

                if (typeof tile.blockId == "number") {
                    flags1 |= 2;

                    if (tile.blockId > 255)
                        flags1 |= 32;
                }

                if (tile.wallId) {
                    flags1 |= 4;

                    if (tile.wallId > 255)
                        flags3 |= 64
                }

                if (tile.liquidType) {
                    switch (tile.liquidType) {
                        case "water": flags1 |= (1 << 3); break;
                        case "lava": flags1 |= (2 << 3); break;
                        case "shimmer": flags3 |= 128;
                        case "honey": flags1 |= (3 << 3); break;
                    }
                }

                if (tile.slope) {
                    switch (tile.slope) {
                        case "half": flags2 |= (1 << 4); break;
                        case "TR": flags2 |= (2 << 4); break;
                        case "TL": flags2 |= (3 << 4); break;
                        case "BR": flags2 |= (4 << 4); break;
                        case "BL": flags2 |= (5 << 4); break;
                    }
                }

                if (tile.wireRed)
                    flags2 |= 2;

                if (tile.wireBlue)
                    flags2 |= 4;

                if (tile.wireGreen)
                    flags2 |= 8;

                if (tile.wireYellow)
                    flags3 |= 32;

                if (tile.actuated)
                    flags3 |= 4;

                if (tile.actuator)
                    flags3 |= 2;

                if (tile.wallColor)
                    flags3 |= 16;

                if (tile.blockColor)
                    flags3 |= 8;

                if (tile.invisibleBlock)
                    flags4 |= 2;

                if (tile.invisibleWall)
                    flags4 |= 4;

                if (tile.fullBrightBlock)
                    flags4 |= 8;

                if (tile.fullBrightWall)
                    flags4 |= 16;

                if (flags4) {
                    this.saveUInt8(flags1 | 1);
                    this.saveUInt8(flags2 | 1);
                    this.saveUInt8(flags3 | 1);
                } else if (flags3) {
                    this.saveUInt8(flags1 | 1);
                    this.saveUInt8(flags2 | 1);
                } else if (flags2) {
                    this.saveUInt8(flags1 | 1);
                } else {
                    this.saveUInt8(flags1);
                }

                if (flags1 & 2) {
                    if (flags1 & 32)
                        this.saveUInt16(tile.blockId);
                    else
                        this.saveUInt8(tile.blockId);

                    if (this.options.world.fileFormatHeader.importants[tile.blockId]) {
                        this.saveInt16(tile.frameX);
                        this.saveInt16(tile.frameY);
                    }

                    if (flags3 & 8)
                        this.saveUInt8(tile.blockColor);
                }

                if (flags1 & 4) {
                    this.saveUInt8(tile.wallId & 255);

                    if (flags3 & 16)
                        this.saveUInt8(tile.wallColor);
                }

                if (typeof tile.liquidAmount == "number")
                    this.saveUInt8(tile.liquidAmount);

                if (flags3 & 64)
                    this.saveUInt8(1);

                if (RLE) {
                    if (RLE > 255)
                        this.saveUInt16(RLE);
                    else
                        this.saveUInt8(RLE);
                }
            }
        }

        return this.offset;
    }

    saveChests() {
        const data = this.options.world.chests;

        this.saveInt16(data.length);
        this.saveInt16(40);

        data.forEach(chest => {
            this.saveInt32(chest.position.x);
            this.saveInt32(chest.position.y);
            if (chest.name)
                this.saveString(chest.name);
            else
                this.saveUInt8(0);

            const chestItems = Array(40).fill(null);
            if (chest.items) {
                chest.items.forEach((item, i) => {
                    chestItems[i] = item;
                });
            }

            chestItems.forEach(item => {
                if (item === null)
                    this.saveInt16(0);
                else {
                    this.saveInt16(item.stack);
                    this.saveInt32(item.id);
                    this.saveUInt8(item.prefix);
                }
            });
        });

        return this.offset
    }

    saveSigns() {
        const data = this.options.world.signs;

        this.saveInt16(data.length);

        data.forEach(sign => {
            this.saveString(sign.text);
            this.saveInt32(sign.position.x);
            this.saveInt32(sign.position.y);
        });

        return this.offset;
    }

    saveNPCs() {
        const data = this.options.world.NPCs;

        const shimmeredNPCs = data.filter(NPC => NPC.shimmered);
        this.saveInt32(shimmeredNPCs.length);
        shimmeredNPCs.forEach(NPC => this.saveInt32(NPC.id));

        data.forEach(NPC => {
            if (NPC.townNPC) {
                this.saveBoolean(true);
                this.saveInt32(NPC.id);
                this.saveString(NPC.name);
                this.saveFloat32(NPC.position.x);
                this.saveFloat32(NPC.position.y);
                this.saveBoolean(NPC.homeless);
                this.saveInt32(NPC.homePosition.x);
                this.saveInt32(NPC.homePosition.y);

                if (this.options.world.fileFormatHeader.version >= 225) {
                    if (NPC.variationIndex !== undefined) {
                        this.saveBitsByte([true]);
                        this.saveInt32(NPC.variationIndex);
                    }
                    else
                        this.saveBitsByte([false]);
                }
            }
        });
        this.saveBoolean(false);

        data.forEach(NPC => {
            if (NPC.pillar) {
                this.saveBoolean(true);
                this.saveInt32(NPC.id);
                this.saveFloat32(NPC.position.x);
                this.saveFloat32(NPC.position.y);
            }
        });
        this.saveBoolean(false);

        return this.offset;
    }

    saveTileEntities() {
        const data = this.options.world.tileEntities;

        this.saveInt32(data.length);

        data.forEach(tileEntity => {
            if (tileEntity.targetDummy)
                this.saveUInt8(0);
            else if (tileEntity.itemFrame)
                this.saveUInt8(1);
            else if (tileEntity.logicSensor)
                this.saveUInt8(2);
            else if (tileEntity.displayDoll)
                this.saveUInt8(3);
            else if (tileEntity.weaponsRack)
                this.saveUInt8(4);
            else if (tileEntity.hatRack)
                this.saveUInt8(5);
            else if (tileEntity.foodPlatter)
                this.saveUInt8(6);
            else if (tileEntity.teleportationPylon)
                this.saveUInt8(7);

            this.saveInt32(tileEntity.id);
            this.saveInt16(tileEntity.position.x);
            this.saveInt16(tileEntity.position.y);

            if (tileEntity.targetDummy) {
                this.saveInt16(tileEntity.targetDummy.npc);
            } else if (tileEntity.itemFrame) {
                this.saveInt16(tileEntity.itemFrame.itemId);
                this.saveUInt8(tileEntity.itemFrame.prefix);
                this.saveInt16(tileEntity.itemFrame.stack);
            } else if (tileEntity.logicSensor) {
                this.saveUInt8(tileEntity.logicSensor.logicCheck);
                this.saveBoolean(tileEntity.logicSensor.on);
            } else if (tileEntity.displayDoll) {
                let itemsBits = [], dyesBits = [];

                if (tileEntity.displayDoll.items)
                    for (let i = 0; i < 8; i++)
                        itemsBits[i] = tileEntity.displayDoll.items[i] ? true : false;
                this.saveBitsByte(itemsBits);

                if (tileEntity.displayDoll.dyes)
                    for (let i = 0; i < 8; i++)
                        dyesBits[i] = tileEntity.displayDoll.dyes[i] ? true : false;
                this.saveBitsByte(dyesBits);

                for (let j = 0; j < 8; j++)
                    if (itemsBits[j]) {
                        this.saveInt16(tileEntity.displayDoll.items[j].itemId);
                        this.saveUInt8(tileEntity.displayDoll.items[j].prefix);
                        this.saveInt16(tileEntity.displayDoll.items[j].stack);
                    }

                for (let j = 0; j < 8; j++)
                    if (dyesBits[j]) {
                        this.saveInt16(tileEntity.displayDoll.dyes[j].itemId);
                        this.saveUInt8(tileEntity.displayDoll.dyes[j].prefix);
                        this.saveInt16(tileEntity.displayDoll.dyes[j].stack);
                    }
            } else if (tileEntity.weaponsRack) {
                this.saveInt16(tileEntity.weaponsRack.itemId);
                this.saveUInt8(tileEntity.weaponsRack.prefix);
                this.saveInt16(tileEntity.weaponsRack.stack);
            } else if (tileEntity.hatRack) {
                let itemsBits = [], dyesBits = [];

                if (tileEntity.hatRack.items)
                    for (let i = 0; i < 2; i++)
                        itemsBits[i] = tileEntity.hatRack.items[i] ? true : false;

                if (tileEntity.hatRack.dyes)
                    for (let i = 0; i < 2; i++)
                        dyesBits[i] = tileEntity.hatRack.dyes[i] ? true : false;

                this.saveBitsByte([...itemsBits, ...dyesBits]);

                for (let j = 0; j < 2; j++)
                    if (itemsBits[j]) {
                        this.saveInt16(tileEntity.hatRack.items[j].itemId);
                        this.saveUInt8(tileEntity.hatRack.items[j].prefix);
                        this.saveInt16(tileEntity.hatRack.items[j].stack);
                    }

                for (let j = 0; j < 2; j++)
                    if (dyesBits[j]) {
                        this.saveInt16(tileEntity.hatRack.dyes[j].itemId);
                        this.saveUInt8(tileEntity.hatRack.dyes[j].prefix);
                        this.saveInt16(tileEntity.hatRack.dyes[j].stack);
                    }
            } else if (tileEntity.foodPlatter) {
                this.saveInt16(tileEntity.foodPlatter.itemId);
                this.saveUInt8(tileEntity.foodPlatter.prefix);
                this.saveInt16(tileEntity.foodPlatter.stack);
            }
        });

        return this.offset;
    }

    saveWeightedPressurePlates() {
        const data = this.options.world.weightedPressurePlates;

        this.saveInt32(data.length);

        data.forEach(pressurePlate => {
            this.saveInt32(pressurePlate.position.x);
            this.saveInt32(pressurePlate.position.y);
        });

        return this.offset;
    }

    saveTownManager() {
        const data = this.options.world.rooms;

        this.saveInt32(data.length);

        data.forEach(room => {
            this.saveInt32(room.NPCId);
            this.saveInt32(room.position.x);
            this.saveInt32(room.position.y);
        });

        return this.offset;
    }

    saveBestiary() {
        const data = this.options.world.bestiary;

        data.NPCKills = Object.entries(data.NPCKills);

        this.saveInt32(data.NPCKills.length);
        for (let i = 0; i < data.NPCKills.length; i++) {
            this.saveString(data.NPCKills[i][0]);
            this.saveInt32(data.NPCKills[i][1]);
        }

        this.saveInt32(data.NPCSights.length);
        for (let i = 0; i < data.NPCSights.length; i++)
            this.saveString(data.NPCSights[i]);

        this.saveInt32(data.NPCChats.length);
        for (let i = 0; i < data.NPCChats.length; i++)
            this.saveString(data.NPCChats[i]);

        return this.offset;
    }

    saveCreativePowers() {
        const creativePowers = this.options.world.creativePowers;

        this.saveBoolean(true);
        this.saveInt16(0);
        this.saveBoolean(creativePowers.freezeTime);

        this.saveBoolean(true);
        this.saveInt16(8);
        this.saveFloat32(creativePowers.modifyTimeRate);

        this.saveBoolean(true);
        this.saveInt16(9);
        this.saveBoolean(creativePowers.freezeRainPower);

        this.saveBoolean(true);
        this.saveInt16(10);
        this.saveBoolean(creativePowers.freezeWindDirectionAndStrength);

        this.saveBoolean(true);
        this.saveInt16(12);
        this.saveFloat32(creativePowers.difficultySliderPower);

        this.saveBoolean(true);
        this.saveInt16(13);
        this.saveBoolean(creativePowers.stopBiomeSpreadPower);

        this.saveBoolean(false);

        return this.offset;
    }

    saveFooter() {
        this.saveBoolean(true);
        this.saveString(this.options.world.header.mapName);
        this.saveInt32(this.options.world.header.worldId);
    }
}