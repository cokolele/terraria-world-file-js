const { utf8ByteArrayToString } = require("./string.js");

module.exports = class terrariaFileParser
{
    async loadFile(file)
    {
        let result = await new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            }

            reader.onerror = () => {
                reader.abort();
                console.warn("TerrariaWorldParserError: failed loading the file:");
                throw reader.error;
            }

            reader.readAsArrayBuffer(file);
        });

        this.buffer = new DataView(result);
        this.callback = () => {};
        const _this = this;
        this.offset = {
            _value: 0,
            percentil: file.size / 100,
            percentilNext: 0,
            percent: 0,
            set value(val) {
                this._value = val;
                if (val > this.percentilNext) {
                    this.percentilNext += this.percentil;
                    this.percent += 1;
                    _this.callback(this.percent);
                }
            },
            get value() {
                return this._value;
            },
        };
    }

    readUInt8()
    {
        this.offset.value += 1;
        return this.buffer.getUint8( this.offset.value - 1, true );
    }

    readInt16()
    {
        this.offset.value += 2;
        return this.buffer.getInt16( this.offset.value - 2, true );
    }

    readUInt16()
    {
        this.offset.value += 2;
        return this.buffer.getUint16( this.offset.value - 2, true );
    }

    readInt32()
    {
        this.offset.value += 4;
        return this.buffer.getInt32( this.offset.value - 4, true );
    }

    readUInt32()
    {
        this.offset.value += 4;
        return this.buffer.getUint32( this.offset.value - 4, true );
    }

    readFloat32()
    {
        this.offset.value += 4;
        return this.buffer.getFloat32( this.offset.value - 4, true );
    }

    readFloat64()
    {
        this.offset.value += 8;
        return this.buffer.getFloat64( this.offset.value - 8, true );
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
        this.offset.value += count;
    }

    jumpTo(offset)
    {
        this.offset.value = offset;
    }
}