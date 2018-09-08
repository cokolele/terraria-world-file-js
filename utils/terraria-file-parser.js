class terrariaFileParser
{
	constructor(path)
	{
		const fs = require("fs");
		this.buffer = fs.readFileSync( path , [null, "r+"]);
		this.offset = 0;	
		this.world = {
			pointers:[],
			importants:[],
			tiles: {
				x:null,
				y:null,
				solids: [true,true,true,null,null,null,true,true,true,true,true,null,null,null,null,null,null,null,null,true,null,null,true,true,null,true,null,null,null,null,true,null,null,null,null,null,null,true,true,true,true,true,null,true,true,true,true,true,true,null,null,true,true,true,true,null,true,true,true,true,true,null,true,true,true,true,true,true,true,null,true,null,null,null,null,true,true,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,true,true,true,null,true,true,null,null,true,true,true,true,true,true,true,true,true,null,null,null,true,null,null,true,null,null,null,null,null,null,true,null,null,true,null,null,null,null,true,true,true,true,null,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,null,true,true,true,true,true,null,null,null,null,true,true,true,null,true,true,true,true,true,null,null,null,null,true,true,true,true,true,true,true,true,true,true,true,true,true,null,true,true,true,true,true,null,true,null,null,true,null,null,null,null,null,null,null,null,null,true,true,true,true,true,true,null,null,true,true,null,true,null,true,true,null,null,null,true,null,null,null,null,null,null,null,null,true,true,true,true,true,true,null,true,true,true,true,true,true,true,true,true,true,true,true,true,true,null,null,null,true,true,true,null,null,null,null,null,null,null,null,null,true,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,true,true,true,null,true,null,null,null,null,null,true,true,null,null,true,true,true,true,true,null,null,null,null,null,null,true,null,null,null,true,true,true,true,true,true,true,true,true,null,true,true,true,true,null,null,null,true,null,null,null,null,null,null,null,true,true,true,true,true,true,true,null,null,null,null,null,null,null,true,null,true,true,true,true,true,null,null,null,null,null,null,null,null,null,null,true,true,true,true,true,true,true,true,true,null,null,true,true,true,null,null,null,null,null,true,true,true,true,null,null,true,true,null,null,null,true,null,null,null,true,true,true,true,true,null,null,null,null,null,null,null,null,null,null,null,true,true,true,true,true,true,null,null,null,null,null,null,true,true,true],
			},
		}
	}

	ReadInt8()
	{
		this.offset += 1;
		return this.buffer[this.offset - 1];
	}

	ReadInt16()
	{
		this.offset += 2;
		return this.buffer.readInt16LE( this.offset - 2 );
	}

	ReadUInt16()
	{
		this.offset += 2;
		return this.buffer.readUInt16LE( this.offset - 2 );
	}

	ReadInt32()
	{
		this.offset += 4;
		return this.buffer.readInt32LE( this.offset - 4 );
	}

	ReadUInt32()
	{
		this.offset += 4;
		return this.buffer.readUInt32LE( this.offset - 4 );
	}

	ReadString()
	{
		return this.ReadBytes( this.ReadInt8() ).toString("utf8");
	}

	ReadFloat()
	{
		this.offset += 4;
		return this.buffer.readFloatLE( this.offset - 4 );
	}

	ReadDouble()
	{
		this.offset += 8;
		return this.buffer.readDoubleLE( this.offset - 8 );
	}

	ReadBoolean()
	{
		if (this.ReadInt8()) return true;
		return false;
	}

	ReadBytes(count)
	{
		let data = [];
		for (let i = 0; i < count; i++)
		{
			data[i] = this.buffer[this.offset];
			this.offset += 1;
		}
		return Buffer.from(data);
	}

	SkipBytes(count)
	{
		this.offset += count;
	}

	JumpTo(offset)
	{
		this.offset = offset;
	}
}

module.exports = terrariaFileParser;