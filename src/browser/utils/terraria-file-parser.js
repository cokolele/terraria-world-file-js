const aes = require("aes-js");

module.exports = class terrariaFileParser
{
    constructor(file)
    {
        const _this = this;

        return (async () => {
            await new Promise((resolve, reject) => {        
                const reader = new FileReader();

                reader.onload = function(e) {
                    _this.buffer = new DataView(reader.result);
                    _this.offset = 0;
                    resolve();
                }

                reader.onerror = function(e) {
                    reader.abort();
                    throw new Error(reader.error);
                    reject();
                }

                reader.readAsArrayBuffer(file);
            });

            return _this;
        })();
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
        //return this.readBytes( length ? length : this.readUInt8() );
        return aes.utils.utf8.fromBytes( this.readBytes( length ? length : this.readUInt8() ) );
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