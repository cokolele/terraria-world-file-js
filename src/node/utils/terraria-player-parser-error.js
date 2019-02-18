class TerrariaPlayerParserError extends Error
{
    constructor(error, message)
    {
        super(message);
        error.message = this.message = `${this.message}: \n${error.name}: ${error.message}`;
        error.name = this.name = "TerrariaPlayerParserError";
        this.stack = error.stack;
        this.userMessage = message;
    }
}

module.exports = TerrariaPlayerParserError;