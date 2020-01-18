function TerrariaWorldSaverError(msg, err)
{
    err.onlyMessage = err.message;
    err.message = msg + ":\n" + err.name + ": " + err.message;
    err.name = "TerrariaWorldSaverError";
    return err;
}

module.exports = TerrariaWorldSaverError;