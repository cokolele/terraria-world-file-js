if (!ArrayBuffer.transfer) {
    ArrayBuffer.transfer = function(source, length) {
        if (!(source instanceof ArrayBuffer))
            throw new Error("Source must be an instance of ArrayBuffer");
        if (length <= source.byteLength)
            return source.slice(0, length);
        var sourceView = new Uint8Array(source),
            destView = new Uint8Array(new ArrayBuffer(length));
        destView.set(sourceView);
        return destView.buffer;
    };
}