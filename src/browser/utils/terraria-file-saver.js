const { stringToUtf8ByteArray } = require("./string.js");
require("./polyfills/ArrayBuffer-transfer.js");

module.exports = class terrariaFileSave {
    constructor() {
        this.buffer = new ArrayBuffer(1024 * 1024);
        this.dataView = new DataView(this.buffer);
        this.offset = 0;
    }

    checkBounds(appendLength) {
        if (this.offset + appendLength > this.buffer.byteLength) {
            this.buffer = ArrayBuffer.transfer(this.buffer, this.buffer.byteLength + 1024 * 1024);
            this.dataView = new DataView(this.buffer);
        }
    }

    trimBuffer() {
        this.buffer = this.buffer.slice(0, this.offset);
        this.dataView = new DataView(this.buffer);
    }

    saveUInt8(value) {
        this.checkBounds(1);
        this.dataView.setUint8(this.offset, value, true);
        this.offset += 1;
    }

    saveInt16(value) {
        this.checkBounds(2);
        this.dataView.setInt16(this.offset, value, true);
        this.offset += 2;
    }

    saveUInt16(value) {
        this.checkBounds(2);
        this.dataView.setUint16(this.offset, value, true);
        this.offset += 2;
    }

    saveInt32(value) {
        this.checkBounds(4);
        this.dataView.setInt32(this.offset, value, true);
        this.offset += 4;
    }

    saveUInt32(value) {
        this.checkBounds(4);
        this.dataView.setUint32(this.offset, value, true);
        this.offset += 4;
    }

    saveFloat32(value) {
        this.checkBounds(4);
        this.dataView.setFloat32(this.offset, value, true);
        this.offset += 4;
    }

    saveFloat64(value) {
        this.checkBounds(8);
        this.dataView.setFloat64(this.offset, value, true);
        this.offset += 8;
    }

    saveBoolean(value) {
        this.saveUInt8(value ? 1 : 0);
    }

    saveBytes(bytesArray) {
        bytesArray.forEach(byte => {
            this.saveUInt8(byte);
        });
    }

    saveString(string, saveLength = true) {
        const stringBytes = stringToUtf8ByteArray(string);

        if (saveLength)
            this.saveUInt8(stringBytes.length);

        this.saveBytes(stringBytes);
    }

    skipBytes(count) {
        this.offset += count;
    }
}