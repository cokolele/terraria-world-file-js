function TerrariaWorldParserError(msg, err)
{
    err.onlyMessage = err.message;
    err.message = msg + ":\n" + err.name + ": " + err.message;
    err.name = "TerrariaWorldParserError";
    return err;
}

module.exports = TerrariaWorldParserError;