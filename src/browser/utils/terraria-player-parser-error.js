class TerrariaPlayerParserError extends Error
{
    constructor(error, message)
    {
        super(message);
        this.name = "TerrariaPlayerParserError";
        this.message = `${this.message}: \n${error.name}: ${error.message}`;
		this.stack = error.stack;
        this.userMessage = message;
    }
}

module.exports = TerrariaPlayerParserError;