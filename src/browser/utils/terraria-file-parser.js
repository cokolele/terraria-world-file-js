export default class terrariaFileParse {
    constructor() {
        this.offset = 0;
        this.options = {
            ignoreBounds: false
        };
    }

    async loadFile(file) {
        let buffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            }

            reader.onerror = () => {
                reader.abort();
                reject(reader.error);
            }

            reader.readAsArrayBuffer(file);
        });

        this.buffer = new DataView(buffer);
    }

    readUInt8() {
        this.offset += 1;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.getUint8( this.offset - 1, true );
    }

    readInt16() {
        this.offset += 2;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.getInt16( this.offset - 2, true );
    }

    readUInt16() {
        this.offset += 2;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.getUint16( this.offset - 2, true );
    }

    readInt32() {
        this.offset += 4;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.getInt32( this.offset - 4, true );
    }

    readUInt32() {
        this.offset += 4;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.getUint32( this.offset - 4, true );
    }

    readFloat32() {
        this.offset += 4;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.getFloat32( this.offset - 4, true );
    }

    readFloat64() {
        this.offset += 8;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.getFloat64( this.offset - 8, true );
    }

    readBoolean() {
        return (!!this.readUInt8());
    }

    readBytes(count) {
        let data = [];
        for (let i = 0; i < count; i++)
            data[i] = this.readUInt8();

        return new Uint8Array(data);
    }

    readString(length) {
        if (length === undefined) { //7 bit encoded int32
            length = 0;
            let shift = 0, byte;
            do {
                byte = this.readUInt8();
                length |= (byte & 127) << shift;
                shift += 7;
            } while (byte & 128);
        }

        return new TextDecoder().decode(this.readBytes(length));
    }

    skipBytes(count) {
        this.offset += count;
    }

    jumpTo(offset) {
        this.offset = offset;
    }

    parseBitsByte(size) {
        let bytes = [];
        for (let i = size; i > 0; i = i - 8)
            bytes.push( this.readUInt8() );

        let bitValues = [];
        for (let i = 0, j = 0; i < size; i++, j++) {
            if (j == 8)
                j = 0;
            bitValues[i] = (bytes[~~(i / 8)] & (1 << j)) > 0;
        }

        return bitValues;
    }
}