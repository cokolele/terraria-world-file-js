import { utf8ByteArrayToString } from "./string.js";

export default class terrariaFileParse {
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

        let percent = 0;
        let percentilNext = 0;
        let percentil = this.buffer.byteLength / 100;

        let _offset = 0;
        Object.defineProperty(this, "offset", {
            get: () => {
                if (this.percentageCallback && _offset > percentilNext){
                    percent++;
                    percentilNext += percentil;
                    this.percentageCallback(percent);
                }
                return _offset;
            },
            set: (value) => {
                _offset = value;
            }
        });
    }

    readUInt8() {
        this.offset += 1;
        return this.buffer.getUint8( this.offset - 1, true );
    }

    readInt16() {
        this.offset += 2;
        return this.buffer.getInt16( this.offset - 2, true );
    }

    readUInt16() {
        this.offset += 2;
        return this.buffer.getUint16( this.offset - 2, true );
    }

    readInt32() {
        this.offset += 4;
        return this.buffer.getInt32( this.offset - 4, true );
    }

    readUInt32() {
        this.offset += 4;
        return this.buffer.getUint32( this.offset - 4, true );
    }

    readFloat32() {
        this.offset += 4;
        return this.buffer.getFloat32( this.offset - 4, true );
    }

    readFloat64() {
        this.offset += 8;
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
        return utf8ByteArrayToString( this.readBytes( length ? length : this.readUInt8() ) );
    }

    skipBytes(count) {
        this.offset += count;
    }

    jumpTo(offset) {
        this.offset = offset;
    }
}