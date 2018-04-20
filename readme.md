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

! most of these are not described

Type | Variable | Description
--- | --- | ---
*string* | mapName | name of the map
*string* | seedText | seed of the map
*uint64* | worldGeneratorVersion | -
*guid* | guid | guid of the map
*int32* | worldId | id of the world, used as name of the .map file
*int32* | leftWorld | map dimesions in pixels (1 tile = 16 pixels)
*int32* | rightWorld | ^
*int32* | topWorld | ^
*int32* | bottomWorld | ^
*int32* | maxTilesY | map dimension in tiles
*int32* | maxTilesX | ^
*bool* | expertMode | expert mode map
*int64* | creationTime | time of creation (created with C# Datetime.ToBinary())
*byte* | moonType | 
*int32 array* | treeX | 
*int32 array* | treeStyle |
*int32 array* | caveBackX |
*int32 array* | caveBackStyle |
*int32* | iceBackStyle | 
*int32* | jungleBackStyle | 
*int32* | hellBackStyle | 
*int32* | spawnTileX | 
*int32* | spawnTileY | 
*double* | worldSurface | 
*double* | rockLayer | 
*double* | tempTime | 
*bool* | tempDayTime | 
*int32* | tempMoonPhase | 
*bool* | tempBloodMoon | 
*bool* | tempEclipse | 
*bool* | eclipse | 
*int32* | dungeonX | 
*int32* | dungeonY | 
*bool* | crimson | 
*bool* | downedBoss1 | 
*bool* | downedBoss2 | 
*bool* | downedBoss3 | 
*bool* | downedQueenBee | 
*bool* | downedMechBoss1 | 
*bool* | downedMechBoss2 | 
*bool* | downedMechBoss3 | 
*bool* | downedMechBossAny | 
*bool* | downedPlantBoss | 
*bool* | downedGolemBoss | 
*bool* | downedSlimeKing | 
*bool* | savedGoblin | 
*bool* | savedWizard | 
*bool* | savedMech | 
*bool* | downedGoblins |  
*bool* | downedClown | 
*bool* | downedFrost | 
*bool* | downedPirates | 
*bool* | shadowOrbSmashed | 
*bool* | spawnMeteor | 
*byte* | shadowOrbCount | 
*int32* | altarCount | 
*bool* | hardMode | 
*int32* | invasionDelay | 
*int32* | invasionSize | 
*int32* | invasionType | 
*double* | invasionX | 
*double* | slimeRainTime | 
*byte* | sundialCooldown | 
*bool* | tempRaining | 
*int32* | tempRainTime | 
*float* | tempMaxRain | 
*int32* | oreTier1 | 
*int32* | oreTier2 | 
*int32* | oreTier3 | 
*byte* | setBG0 | 
*byte* | setBG1 | 
*byte* | setBG2 | 
*byte* | setBG3 | 
*byte* | setBG4 | 
*byte* | setBG5 | 
*byte* | setBG6 | 
*byte* | setBG7 | 
*int32* | cloudBGActive | 
*double* | cloudBGAlpha | 
*int16* | numClouds |
*float* | windSpeedSet |
*float* | windSpeed |
*string array* | anglerWhoFinishedToday |
*bool* | savedAngler
*int32* | anglerQuest
*bool* | savedStylist
*bool* | savedTaxCollector
*int32* | invasionSizeStart
*int32* | tempCultistDelay
*int32 array* | killCount |
*bool* | fastForwardTime |
*bool* | downedFishron |
*bool* | downedMartians |
*bool* | downedAncientCultist |
*bool* | downedMoonlord |
*bool* | downedHalloweenKing |
*bool* | downedHalloweenTree |
*bool* | downedChristmasIceQueen |
*bool* | downedChristmasSantank |
*bool* | downedChristmasTree |
*bool* | downedTowerSolar |
*bool* | downedTowerVortex |
*bool* | downedTowerNebula |
*bool* | downedTowerStardust |
*bool* | TowerActiveSolar |
*bool* | TowerActiveVortex |
*bool* | TowerActiveNebula |
*bool* | TowerActiveStardust |
*bool* | LunarApocalypseIsUp |
*bool* | tempPartyManual |
*bool* | tempPartyGenuine |
*int32* | tempPartyCooldown |
*int32 array* | tempPartyCelebratingNpcs |
*bool* | Temp_Sandstorm_Happening |
*int32 | Temp_Sandstorm_TimeLeft |
*float* | Temp_Sandstorm_Severity |
*float* | Temp_Sandstorm_IntendedSeverity |
*bool* | savedBartender |
*bool* | DD2Event_DownedInvasionT1 |
*bool* | DD2Event_DownedInvasionT2 |
*bool* | DD2Event_DownedInvasionT3 |

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