const { readFile, readFileSync } = require("fs");

module.exports = class terrariaFileParser {
    constructor() {
        this.offset = 0;
        this.options = {
            ignoreBounds: false
        };
    }

    loadFileSync(file) {
        this.buffer = readFileSync(file, [null, "r+"]);
    }

    async loadFile(file) {
        this.buffer = await readFile(file, [null, "r+"]);
    }

    loadBuffer(buffer) {
        this.buffer = buffer;
    }

    readUInt8() {
        this.offset += 1;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer[this.offset - 1];
    }

    readInt16() {
        this.offset += 2;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.readInt16LE( this.offset - 2 );
    }

    readUInt16() {
        this.offset += 2;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.readUInt16LE( this.offset - 2 );
    }

    readInt32() {
        this.offset += 4;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.readInt32LE( this.offset - 4 );
    }

    readUInt32() {
        this.offset += 4;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.readUInt32LE( this.offset - 4 );
    }

    readFloat32() {
        this.offset += 4;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.readFloatLE( this.offset - 4 );
    }

    readFloat64() {
        this.offset += 8;
        if (this.options.ignoreBounds && this.offset > this.buffer.byteLength)
            return 0;
        return this.buffer.readDoubleLE( this.offset - 8 );
    }

    readBoolean() {
        return (!!this.readUInt8());
    }

    readBytes(count) {
        let data = [];
        for (let i = 0; i < count; i++)
            data[i] = this.readUInt8();

        return Buffer.from(data);
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

        return this.readBytes(length).toString("utf8");
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