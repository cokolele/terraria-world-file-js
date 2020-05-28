import "./polyfills/ArrayBuffer-transfer.js";

export default class terrariaFileSave {
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
        const stringBytes = new TextEncoder().encode(string);

        if (saveLength) {
            let length = stringBytes.length, length7BitBytes = [], byte;

            do {
                byte = length & 127;
                length >>= 7;
                if (length)
                    byte |= 128;
                length7BitBytes.push(byte);
            } while (length)

            this.saveBytes(length7BitBytes);
        }

        this.saveBytes(stringBytes);
    }

    skipBytes(count) {
        this.offset += count;
    }

    saveBitsByte(_bitsArray) {
        const bitsArray = [..._bitsArray]; // we dont wanna remove data from the passed reference
        let bytes = [];

        for (let i = bitsArray.length; i > 0; i -= 8) {
            let byte = 0;

            for (let j = 0; j < 8; j++)
                byte |= (bitsArray.shift() << j);

            bytes.push(byte);
        }

        this.saveBytes(bytes);
    }
}