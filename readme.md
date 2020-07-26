<!--
  Title: terraria world parser
  Description: Terraria world file parser
  Author: cokolele
  Tags: terraria, world file, file structure, file dumper, file format, documentation, data, parsing, parser, map viewer, tool, javascript, node, browser, saver, editor, save, edit
  -->

# Terraria world file - js

Terraria world file parser and saver written in javascript

\- supports maps from 1.3.5.3 to 1.4.0.5

Feel free to contribute 🌳

## Usage

```javascript
import terrariaWorldParser from "/terraria-world-parser.js";
import terrariaWorldSaver from "/terraria-world-saver.js";

let world = await new terrariaWorldParser().loadFile(mapFile || "/map.wld");

world = world.parse();

const name = world.header.name;
const newName = "Canvas";

console.log( "Old name: " + name );
console.log( "New name: " + newName );

world.header.name = newName;

let newWorldFile = new terrariaWorldSaver().save({
    world
});
```

## Documentation:

*constructor*&nbsp;&nbsp;**new terrariaWorldParser()**
<br>
<br>*node method*&nbsp;&nbsp;**loadBuffer(*buffer* buffer)**
<br>*node method*&nbsp;&nbsp;**loadFileSync(*string* path)**
<br>*node method*&nbsp;&nbsp;**async loadFile(*string* path)**
<br>*browser method*&nbsp;&nbsp;**async loadFile(*File* file)**
<br>— Loads file buffer
<br>— Returns instance
<br>
<br>*method*&nbsp;&nbsp;**parse([*object* options])**
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*string array*&nbsp;&nbsp;**options.sections**
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Sections to parse
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Default: ["fileFormatHeader", "header", "tiles", "chests", "signs", "NPCs", "tileEntities",
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"weightedPressurePlates", "rooms", "bestiary", "creativePowers", "footer"]
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*boolean*&nbsp;&nbsp;**options.ignorePointers**
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Disables checking whether buffer offset matches the next section pointer
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Use if some sections are corrupted
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Default: false
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*boolean*&nbsp;&nbsp;**options.ignoreBounds**
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Fills the data with zeros if the buffer is outside bounds
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Use if some sections are missing
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Default: false
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*function*&nbsp;&nbsp;**options.progressCallback(*int* percent)**
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Called when loading progress changes
<br>— Parses file
<br>— Returns buffer
##
<br>*constructor*&nbsp;&nbsp;**new terrariaWorldSaver()**
<br>
<br>*browser method*&nbsp;&nbsp;**save(*object* options)**
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*object*&nbsp;&nbsp;**options.world**
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Same object structure as parser return object
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Required
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*function*&nbsp;&nbsp;**[options.progressCallback(*int* percent)]**
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Called when loading progress changes
<br>— Saves object
<br>— Returns buffer
<br>
<br>TODO: *node method*&nbsp;&nbsp;**save(*object* options)**
<br>— If you are reading this and want to help, you can create a pull request :)
##
<br>*Error*&nbsp;&nbsp;**TerrariaWorldParserError**
<br>| or
<br>*Error*&nbsp;&nbsp;**TerrariaWorldSaverError**
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*string*&nbsp;&nbsp;**name** = "TerrariaWorldParserError"
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| or
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*string*&nbsp;&nbsp;**name** = "TerrariaWorldSaverError"
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*string*&nbsp;&nbsp;**message** = onlyFriendlyMessage + ":\n" + onlyName + ": " + onlyMessage
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*string*&nbsp;&nbsp;**onlyFriendlyMessage**
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— user friendly error message
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*string*&nbsp;&nbsp;**onlyName**
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— original thrown error name
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*string*&nbsp;&nbsp;**onlyMessage**
<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— original thrown error message
<br>

## Return object:

*object*&nbsp;&nbsp;**fileFormatHeader**

Type | Variable | Description
--- | --- | ---
*int32* | version | map file version
*7 bytes string* | magicNumber | file format magic number
*uint8* | fileType | terraria's file type
*uint32* | revision | map was saved count
*uint64* | favorite | favorite
*int32 array* | pointers | offsets of sections
*bool array* | importants | tile frame importants (animated, big sprite, more variants...)<br>index = block id

*object*&nbsp;&nbsp;**header**

Type | Variable | Description
--- | --- | ---
*string* | mapName | map name
*string* | seedText | map seed
*uint64* | worldGeneratorVersion | version of the world generator, returns 8 bytes array
*guid* | guid | guid of the map, returns 16 bytes array
*int32* | worldId | map ID
*int32* | leftWorld | map dimesion in pixels
*int32* | rightWorld | ^
*int32* | topWorld | ^
*int32* | bottomWorld | ^
*int32* | maxTilesY | map dimension y in tiles
*int32* | maxTilesX | map dimension x in tiles
*int32* | gameMode | map game mode<br>only >1.4.0.1
*bool* | drunkWorld | drunk world (seed) enabled<br>only >1.4.0.1
*bool* | getGoodWorld | good world (seed) enabled<br>only >1.4.0.3
*bool* | expertMode | expert mode<br>only 1.3.5.3
*int64* | creationTime | time of creation, returns 8 bytes array (Datetime.ToBinary)
*uint8* | moonType | moon type
*int32 array* | treeX | x positions where corresponding treeStyle ends
*int32 array* | treeStyle | tree styles
*int32 array* | caveBackX | x positions where corresponding caveBackStyles ends
*int32 array* | caveBackStyle | cave background styles
*int32* | iceBackStyle | ice underground/cavern background style
*int32* | jungleBackStyle | jungle underground/cavern background style
*int32* | hellBackStyle | underworld background style
*int32* | spawnTileX | position x of the spawn point
*int32* | spawnTileY | position y of the spawn point
*double* | worldSurface | y dimension where cavern starts
*double* | rockLayer | y dimension where underground starts
*double* | tempTime | current time
*bool* | tempDayTime | is day time
*int32* | tempMoonPhase | moon phase
*bool* | tempBloodMoon | is blood moon happening
*bool* | tempEclipse | is eclipse happening
*int32* | dungeonX | position x of the dungeon base
*int32* | dungeonY | position y of the dungeon base
*bool* | crimson | has crimson
*bool* | downedBoss1 | eye of cthulu killed
*bool* | downedBoss2 | eater of worlds killed
*bool* | downedBoss3 | skeletron killed
*bool* | downedQueenBee | queen bee killed
*bool* | downedMechBoss1 | the destroyes killed
*bool* | downedMechBoss2 | the skeletron prime killed
*bool* | downedMechBoss3 | the twins killed
*bool* | downedMechBossAny | any mechanical boss killed
*bool* | downedPlantBoss | plantera killed
*bool* | downedGolemBoss | golem killed
*bool* | downedSlimeKing | slime king killed
*bool* | savedGoblin | goblin saved
*bool* | savedWizard | wizard saved
*bool* | savedMech | mechanic saved
*bool* | downedGoblins | goblins endured
*bool* | downedClown | clown killed
*bool* | downedFrost | frost legion endured
*bool* | downedPirates | pirates endured
*bool* | shadowOrbSmashed | shadow orb / crimson heart smashed
*bool* | spawnMeteor | can meteor spawn
*uint8* | shadowOrbCount | shadow orbs / crimson hearts smashed count (x/3)
*int32* | altarCount | altars smashed count
*bool* | hardMode | hardmode
*int32* | invasionDelay | ?
*int32* | invasionSize | ?
*int32* | invasionType | type of an event
*double* | invasionX | ?
*double* | slimeRainTime | ?
*uint8* | sundialCooldown | cooldown of the Enchanted Sundial
*bool* | tempRaining | is currently raining
*int32* | tempRainTime | current rain time
*float* | tempMaxRain | ?
*int32* | oreTier1 | tier 1 hardmode ore block id
*int32* | oreTier2 | tier 2 hardmode ore block id
*int32* | oreTier3 | tier 3 hardmode ore block id
*uint8* | setBG0 | forest background style
*uint8* | setBG1 | corruption background style
*uint8* | setBG2 | jungle background style
*uint8* | setBG3 | snow background style
*uint8* | setBG4 | hallow background style
*uint8* | setBG5 | crimson background style
*uint8* | setBG6 | desert background style
*uint8* | setBG7 | ocean background style
*int32* | cloudBGActive | ?
*int16* | numClouds | clouds count (max 200)
*float* | windSpeed | wind speed
*string array* | anglerWhoFinishedToday | name of players that completed angler quest
*bool* | savedAngler | angler saved
*int32* | anglerQuest | id of the current angler quest (probably)
*bool* | savedStylist | stylist saved
*bool* | savedTaxCollector | tax collector saved
*int32* | invasionSizeStart | ?
*int32* | tempCultistDelay | ?
*int32 array* | killCount | kill counter of the enemies (index == id)
*bool* | fastForwardTime | ?
*bool* | downedFishron | fishron killed
*bool* | downedMartians | martians killed
*bool* | downedAncientCultist | cultists killed
*bool* | downedMoonlord | moon lord killed
*bool* | downedHalloweenKing | pumpking killed
*bool* | downedHalloweenTree | everscream killed
*bool* | downedChristmasIceQueen | ice queen killed
*bool* | downedChristmasSantank | santa-nk1 killed
*bool* | downedChristmasTree | mourning wood killed
*bool* | downedTowerSolar | solar pillar killed
*bool* | downedTowerVortex | vortex pillar killed
*bool* | downedTowerNebula | nebula pillar killed
*bool* | downedTowerStardust | stardust pillar killed
*bool* | TowerActiveSolar | solar pillar spawned
*bool* | TowerActiveVortex | vortex pillar spawned
*bool* | TowerActiveNebula | nebula pillar spawned
*bool* | TowerActiveStardust | stardust pillar spawned
*bool* | LunarApocalypseIsUp | lunar event active
*bool* | tempPartyManual | party started by player
*bool* | tempPartyGenuine | party started by random
*int32* | tempPartyCooldown | party event cooldown
*int32 array* | tempPartyCelebratingNpcs | NPCs currently celebrating
*bool* | Temp_Sandstorm_Happening | is sandstorm happening
*int32* | Temp_Sandstorm_TimeLeft | time left to sandstorm end
*float* | Temp_Sandstorm_Severity | severity of the sandstorm
*float* | Temp_Sandstorm_IntendedSeverity | intented severity of the sandstorm
*bool* | savedBartender | tavernkeed saved
*bool* | DD2Event_DownedInvasionT1 | old one's army tier 1 killed
*bool* | DD2Event_DownedInvasionT2 | old one's army tier 2 killed
*bool* | DD2Event_DownedInvasionT3 | old one's army tier 3 killed
*uint8* | setBG8 | mushroom biome background style<br>only 1.4
*uint8* | setBG9 | underworld background style<br>only 1.4
*uint8* | setBG10 | Forest 2 background style<br>only 1.4
*uint8* | setBG11 | Forest 3 background style<br>only 1.4
*uint8* | setBG12 | Forest 4 background style<br>only 1.4
*bool* | combatBookWasUsed | ?<br>only 1.4
*int32 array* | treeTopsVariations | ?<br>only 1.4
*bool* | forceHalloweenForToday | ?<br>only 1.4
*bool* | forceXMasForToday | ?<br>only 1.4
*int32* | savedOreTierCopper | tier 1 normalmode block id<br>only 1.4
*int32* | savedOreTierIron | tier 2 normalmode block id<br>only 1.4
*int32* | savedOreTierSilver | tier 3 normalmode block id<br>only 1.4
*int32* | savedOreTierGold | tier 4 normalmode block id<br>only 1.4
*bool* | boughtCat | bought cat<br>only 1.4
*bool* | boughtDog | bought dog<br>only 1.4
*bool* | boughtBunny | bought bunny<br>only 1.4
*bool* | downedEmpressOfLight | killed empress of light<br>only 1.4
*bool* | downedQueenSlime | killed queen slime<br>only 1.4

*2D objects array*&nbsp;&nbsp;**tiles**

Type | Variable | Description
--- | --- | ---
*uint8 / uint16* | blockId | tile id
*uint8 / uint16* | wallId | wall id
*int16* | frameX | frame x (tile frame important)
*int16* | frameY | frame y (^)
*string* | slope | edited block (half, TR, TL, BR, BL)
*uint8* | blockColor | block paint
*uint8* | wallColor | wall paint
*string* | liquidType | liquid type (water, lava, honey)
*uint8* | liquidAmount | liquid amount
*bool* | actuator | contains actuator
*bool* | actuated | is actuated
*bool* | wireRed | contains red wire
*bool* | wireBlue | contains blue wire
*bool* | wireGreen | contains green wire
*bool* | wireYellow | contains yellow wire

*objects array*&nbsp;&nbsp;**chests**

Type | Variable | Description
--- | --- | ---
*string* | name | name of the chest
*object* | position |
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | x | position x of the chest
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | y | position y of the chest
*object array* | items |
\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | stack | stack of the item
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | id | id of the item
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix | id of the prefix for the item (modifier)

*objects array*&nbsp;&nbsp;**signs**

Type | Variable | Description
--- | --- | ---
*string* | text | text of the sign
*object* | position |
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | x | position x of the sign
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | y | position y of the sign

*objects array*&nbsp;&nbsp;**NPCs**

Type | Variable | Description
--- | --- | ---
*int32* | id | id
*bool* | townNPC | is townNPC
*bool* | pillar | is pillar
*string* | name | name<br>only townNPCs
*bool* | homeless | is homeless<br>only townNPCs
*object* | position |
\|&nbsp;&nbsp;&nbsp;&nbsp;*float* | x | position x of an npc
\|&nbsp;&nbsp;&nbsp;&nbsp;*float* | y | position y of an npc
*object* | homePosition | only townNPCs
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | x | position x of npc's home
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | y | position y of npc's home

*objects array*&nbsp;&nbsp;**tileEntities**

Type | Variable | Description
--- | --- | ---
*uint8* | type | tile entity type
*int32* | id | tile entity ID
*object* | position |
\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | x | position x of the tile entity
\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | y | position y of the tile entity
*object* | targetDummy |
\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | npc | ?
*object* | itemFrame |
\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | itemId | ID of the framed item
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix | prefix of the framed item (modifier)
\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | stack | stack of the framed item
*object* | logicSensor |
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | logicCheck | type of the logic check (probably)
\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | on | is on
*object* | displayDoll | only 1.4
\|&nbsp;&nbsp;&nbsp;&nbsp;*objects array* | items | size = 8
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | itemId | item ID
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix |item modifier
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | stack | items stack
\|&nbsp;&nbsp;&nbsp;&nbsp;*objects array* | dyes | size = 8
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | itemId | dye ID
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix |dye modifier
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | stack | dye stack
*object* | weaponRack | only 1.4
\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | itemId | item ID
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix | item modifier
\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | stack | item stack
*object* | hatRack | only 1.4
\|&nbsp;&nbsp;&nbsp;&nbsp;*objects array* | items | size = 2
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | itemId | item ID
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix |item modifier
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | stack | items stack
\|&nbsp;&nbsp;&nbsp;&nbsp;*objects array* | dyes | size = 2
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | itemId | dye ID
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix |dye modifier
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | stack | dye stack
*object* | foodPlatter | only 1.4
\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | itemId | item ID
\|&nbsp;&nbsp;&nbsp;&nbsp;*uint8* | prefix | item modifier
\|&nbsp;&nbsp;&nbsp;&nbsp;*int16* | stack | item stack
*bool* | teleportationPylon | is pylon<br>type is determined by its position in the world<br>only 1.4

*objects array*&nbsp;&nbsp;**weightedPressurePlates**

Type | Variable | Description
--- | --- | ---
*object* : | position |
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | x | position x of the pressurePlate
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | y | position y of the pressurePlate

*objects array*&nbsp;&nbsp;**rooms**

Type | Variable | Description
--- | --- | ---
*int32* | NPCId |
*object* : | position |
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | x | position x of the room
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | y | position y of the room

*object*&nbsp;&nbsp;**bestiary**<br>— only 1.4

Type | Variable | Description
--- | --- | ---
*object* : | NPCKills |
\|&nbsp;&nbsp;&nbsp;&nbsp;*string* | [key] | name of the NPC
\|&nbsp;&nbsp;&nbsp;&nbsp;*int32* | [value] | given NPC kill count
*strings array* : | NPCSights | name of NPCs that player encountered
*strings array* : | NPCChats | name of NPCs that player chatted with

*objects array*&nbsp;&nbsp;**creativePowers**<br>— only 1.4

Type | Variable | Description
--- | --- | ---
*int16* | powerId | id of the power (order of the CreativePowerManager.Initialize in source code)<br>each object has only one power listed below
*object* : | freezeTime | id 0
\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | enabled | is enabled
*object* : | godMode | id 5
\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | enabled | is enabled
*object* : | modifyTimeRate | id 8
\|&nbsp;&nbsp;&nbsp;&nbsp;*float32* | sliderValue | value of the slider
*object* : | freezeRainPower | id 9
\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | enabled | is enabled
*object* : | freezeWindDirectionAndStrength | id 10
\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | enabled | is enabled
*object* : | farPlacementRangePower | id 11
\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | enabled | is enabled
*object* : | difficultySliderPower | id 12
\|&nbsp;&nbsp;&nbsp;&nbsp;*float32* | sliderValue | value of the slider
*object* : | stopBiomeSpreadPower | id 13
\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | enabled | is enabled
*object* : | spawnRateSliderPerPlayerPower | id 14
\|&nbsp;&nbsp;&nbsp;&nbsp;*float32* | sliderValue | value of the slider

*object*&nbsp;&nbsp;**footer**

Type | Variable | Description
--- | --- | ---
*bool* | signoff1 | always *true*
*string* | signoff2 | map name
*int32* | signoff3 | map id