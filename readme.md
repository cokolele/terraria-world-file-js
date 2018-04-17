## Terraria world parser

JavaScript based Terraria world file parser for Node.js
\- supports only maps generated in 1.3.5.3

###### Return object:

Type | Variable | Description
--- | --- | ---


*object* **fileFormatHeader**

Type | Variable | Description
--- | --- | ---
*int32* | version | map file version
*7 bytes string* | magicNumber | magic number
*byte* | fileType | file type
*uint32* | revision | how many times this map was opened ingame
*uint64* | favorite | favorite (always 0)
*int32 array* | pointers | memory pointers for sections
*bool array* | importants | tile frame important for blocks (animated, big sprite, more variants...) \n ! contains *null*s instead of *false*s \n ! array entry number == block id

*object* **header**

    *string*                    map name

*2d array* **worldTiles**
    
    *object*:                                           ! entries in object exists only if they are present in file

        *byte / unint16*        blockId                 block id
        *int16*                 frameX                  frame x (tile frame important)
        *int16*                 frameY                  frame y (^)
        *byte*                  wallId                  wall id
        *string*                hammered                edited block (half, TR, TL, BR, BL)

        *object* colors: 

            *byte*              block                   painted block
            *byte*              wall                    painted wall

        *object* liquid:

            *string*            type                    liquid type (water, lava, honey)
            *byte*              amount                  amount

        *object* wiring:

            *bool*              hasActuator             contains actuator
            *bool*              actuated                is actuated

            *object wires:

                *bool*          red                     contains red wire
                *bool*          blue                    contains blue wire
                *bool*          green                   contains green wire
                *bool*          yellow                  contains yellow wire




chestsData
signsData
npcsData
tileEntities
pressurePlates
townManager