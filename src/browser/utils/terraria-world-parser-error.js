function TerrariaPlayerParserError(msg, err)
{
    err.message = msg + ":\n" + err.name + ": " + err.message;
    err.name = "TerrariaPlayerParserError";
    return err;
}

module.exports = TerrariaPlayerParserError;