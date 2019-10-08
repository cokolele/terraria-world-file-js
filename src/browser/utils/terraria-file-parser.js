const { utf8ByteArrayToString } = require("./string.js");

module.exports = class terrariaFileParser
{
    loadFile(file)
    {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                this.buffer = new DataView(reader.result);
                this.offset = 0;
                resolve();
            }

            reader.onerror = () => {
                reader.abort();
                console.warn("TerrariaWorldParserError: failed loading the file");
                throw new reader.error;
            }

            reader.readAsArrayBuffer(file);
        });
    }

    readUInt8()
    {
        this.offset += 1;
        return this.buffer.getUint8( this.offset - 1, true );
    }

    readInt16()
    {
        this.offset += 2;
        return this.buffer.getInt16( this.offset - 2, true );
    }

    readUInt16()
    {
        this.offset += 2;
        return this.buffer.getUint16( this.offset - 2, true );
    }

    readInt32()
    {
        this.offset += 4;
        return this.buffer.getInt32( this.offset - 4, true );
    }

    readUInt32()
    {
        this.offset += 4;
        return this.buffer.getUint32( this.offset - 4, true );
    }

    readFloat32()
    {
        this.offset += 4;
        return this.buffer.getFloat32( this.offset - 4, true );
    }

    readFloat64()
    {
        this.offset += 8;
        return this.buffer.getFloat64( this.offset - 8, true );
    }

    readBoolean()
    {
        return (!!this.readUInt8());
    }

    readBytes(count)
    {
        let data = [];
        for (let i = 0; i < count; i++)
            data[i] = this.readUInt8();

        return new Uint8Array(data);
    }

    readString(length)
    {
        return utf8ByteArrayToString( this.readBytes( length ? length : this.readUInt8() ) );
    }

    skipBytes(count)
    {
        this.offset += count;
    }

    jumpTo(offset)
    {
        this.offset = offset;
    }
}