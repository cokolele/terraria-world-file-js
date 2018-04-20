# Terraria world parser

JavaScript based Terraria world file parser for Node.js

\- supports only maps generated in 1.3.5.3

## Usage 

```javascript
const TerrariaWorldParser = require("./terraria-world-parser.js");

try {

    let world = new TerrariaWorldParser("./Canvas.wld");
    world = world.Load();

    const name = world.header.mapName;
    const size = world.header.maxTilesX + "x" + world.header.maxTilesY;
    console.log( `Size of ${name} is ${size}`);

} catch (e) {
    console.log(e.message)
}
```

Other examples in /examples directory:

\- generate map image (png)

\- count all trees

## Return object:

***object* fileFormatHeader**

Type | Variable | Description
--- | --- | ---
*int32* | version | map file version (not game version)
*7 bytes string* | magicNumber | magic number for file format
*byte* | fileType | file format type (relogic uses more formats than .wld)
*uint32* | revision | how many times this map was opened ingame
*uint64* | favorite | is map favorite (always 0)
*int32 array* | pointers | memory pointers for sections
*bool array* | importants | tile frame important for blocks (animated, big sprite, more variants...)<br>\- contains *null*s instead of *false*s<br>\- array entry number == block id

***object* header**

Type | Variable | Description
--- | --- | ---
*string* | mapName | name of the map
*string* | seedText | seed of the map
*uint64* | worldGeneratorVersion | -
*int64* | creationTime | time of creation (created with C# Datetime.ToBinary())
*guid* | guid | guid of the map
*int32 array* | killCount | kill counter of the enemies (array index == enemy id probably)
*int32* | worldId | id of the world, used as name of the .map file
*int32* | leftWorld | map dimesion in pixels (1 tile = 16 pixels)
*int32* | rightWorld | ^
*int32* | topWorld | ^
*int32* | bottomWorld | ^
*int32* | maxTilesY | map dimension in tiles
*int32* | maxTilesX | ^
*int32* | spawnTileX | position x of the spawn point
*int32* | spawnTileY | position y of the spawn point
*int32* | dungeonX | position x of the dungeon base
*int32* | dungeonY | position y of the dungeon base
*int32 array* | treeX | ?
*int32 array* | treeStyle | ?
*int32 array* | caveBackX | ?
*int32 array* | caveBackStyle | ?
*int32* | iceBackStyle | ?
*int32* | jungleBackStyle | ?
*int32* | hellBackStyle | ?
*double* | worldSurface | ?
*double* | rockLayer | ?
*bool* | expertMode | expert mode map
*bool* | hardMode | is map is hardmode
*int32* | oreTier1 | what is <tier 1> hardmore ore (block id)
*int32* | oreTier2 | ^
*int32* | oreTier3 | ^
*bool* | crimson | is world crimson
*int32* | altarCount | how many altars exists
*bool* | shadowOrbSmashed | has been shadow orb (crimson hearts count too probably) smashed
*byte* | shadowOrbCount | how many shadow orbs (crimson hearts ?) exists
*double* | tempTime | current time
*bool* | tempDayTime | is day time
*bool* | spawnMeteor | ?
*byte* | moonType | ?
*bool* | tempRaining | is currently raining
*int32* | tempRainTime | current rain time
*float* | tempMaxRain | ?
*int32* | cloudBGActive | ?
*double* | cloudBGAlpha | ?
*int16* | numClouds | ?
*float* | windSpeedSet | ?
*float* | windSpeed | ?
*bool* | Temp_Sandstorm_Happening | is sandstorm happening
*int32 | Temp_Sandstorm_TimeLeft | time left to sandstorm end
*float* | Temp_Sandstorm_Severity | current severity of the sandstorm
*float* | Temp_Sandstorm_IntendedSeverity | (? max / average) intented severity of the sandstorm
*int32* | tempMoonPhase | moon phase (probably)
*bool* | tempBloodMoon | is blood moon happening
*bool* | tempEclipse | is eclipse happening
*bool* | eclipse | ?
*int32* | invasionDelay | ?
*int32* | invasionSize | ?
*int32* | invasionSizeStart | ?
*int32* | invasionType | type of an event
*double* | invasionX | ?
*double* | slimeRainTime | ?
*int32* | tempCultistDelay | ?
*bool* | tempPartyManual | ?
*bool* | tempPartyGenuine | ?
*int32* | tempPartyCooldown | party event cooldown
*int32 array* | tempPartyCelebratingNpcs | NPCs currently celebrating
*bool* | TowerActiveSolar | is solar pillar up
*bool* | TowerActiveVortex | is vortex pillar up
*bool* | TowerActiveNebula | is nebula pillar up
*bool* | TowerActiveStardust | is stardust pillar up
*bool* | LunarApocalypseIsUp | is lunar event active
*bool* | downedBoss1 | has been <boss 1> killed
*bool* | downedBoss2 | ^
*bool* | downedBoss3 | ^
*bool* | downedQueenBee | ^
*bool* | downedMechBoss1 | ^
*bool* | downedMechBoss2 | ^
*bool* | downedMechBoss3 | ^
*bool* | downedMechBossAny | ^
*bool* | downedPlantBoss | ^
*bool* | downedGolemBoss | ^
*bool* | downedSlimeKing | ^
*bool* | downedGoblins | ^
*bool* | downedClown | ^
*bool* | downedFrost | ^
*bool* | downedPirates | ^
*bool* | downedFishron | ^
*bool* | downedMartians | ^
*bool* | downedAncientCultist | ^
*bool* | downedMoonlord | ^
*bool* | downedHalloweenKing | ^
*bool* | downedHalloweenTree | ^
*bool* | downedChristmasIceQueen | ^
*bool* | downedChristmasSantank | ^
*bool* | downedChristmasTree | ^
*bool* | downedTowerSolar | ^
*bool* | downedTowerVortex | ^
*bool* | downedTowerNebula | ^
*bool* | downedTowerStardust | ^
*bool* | DD2Event_DownedInvasionT1 | is Old One's Army <tier 1> downed
*bool* | DD2Event_DownedInvasionT2 | ^
*bool* | DD2Event_DownedInvasionT3 | ^
*bool* | savedGoblin | is \<goblin> saved
*bool* | savedWizard | ^
*bool* | savedMech | ^
*bool* | savedAngler | ^
*bool* | savedStylist | ^
*bool* | savedTaxCollector | ^
*bool* | savedBartender | ^ (Tavernkeep)
*byte* | setBG0 | ?
*byte* | setBG1 | ?
*byte* | setBG2 | ?
*byte* | setBG3 | ?
*byte* | setBG4 | ?
*byte* | setBG5 | ?
*byte* | setBG6 | ?
*byte* | setBG7 | ?
*byte* | sundialCooldown | cooldown of the Enchanted Sundial
*bool* | fastForwardTime | ?
*string array* | anglerWhoFinishedToday | ?
*int32* | anglerQuest | id of the current angler quest (probably)

***2d object array* worldTiles**

Type | Variable | Description
--- | --- | ---
*byte / unint16* | blockId | block id
*int16* | frameX | frame x (tile frame important)
*int16* | frameY | frame y (^)
*byte* | wallId | wall id
*string* | hammered | edited block (half, TR, TL, BR, BL)
*object* : | colors |
\|&nbsp;&nbsp;&nbsp;&nbsp;*byte* | block | painted block
\|&nbsp;&nbsp;&nbsp;&nbsp;*byte* | wall | painted wall
*object* : | liquid |
\|&nbsp;&nbsp;&nbsp;&nbsp;*string* | type | liquid type (water, lava, honey)
\|&nbsp;&nbsp;&nbsp;&nbsp;*byte* | amount | amount
*object* : | wiring |
\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | hasActuator | contains actuator
\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | actuated | is actuated
\|&nbsp;&nbsp;&nbsp;&nbsp;*object* : | wires |
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | red | contains red wire
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | blue | contains blue wire
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | green | contains green wire
\|&nbsp;&nbsp;&nbsp;&nbsp;\|&nbsp;&nbsp;&nbsp;&nbsp;*bool* | yellow | contains yellow wire

chestsData

signsData

npcsData

tileEntities

pressurePlates

townManager