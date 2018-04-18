## Terraria world parser

JavaScript based Terraria world file parser for Node.js
\- supports only maps generated in 1.3.5.3

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